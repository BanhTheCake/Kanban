import DefaultLayout from '@/layouts/DefaultLayout';
import { Box, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useMemo } from 'react';
import { TiStarFullOutline } from 'react-icons/ti';
import { IoTrashBin } from 'react-icons/io5';
import {
    deleteBoardById,
    getDetailsBoard,
    updateCurrentBoard,
} from '@/utils/axios/board.axios';
import _ from 'lodash';
import HeadBoard from '@/components/system/HeadBoard';
import { toast } from 'react-toastify';
import SectionsBoards from '@/components/system/SectionsBoard';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Board } from '@/utils/type';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { GetServerSideProps } from 'next';
import { resetServerContext } from 'react-beautiful-dnd';
import BoardDetailsLoading from '../../components/skeleton/BoardDetailsLoading.skeleton';

interface BoardDetailsProps { }

const BoardDetails: FunctionComponent<BoardDetailsProps> = () => {
    const router = useRouter();

    const token = useSelector<RootState>(state => state.auth.token)

    const { boardId } = router.query;

    const queryClient = useQueryClient()

    const { mutate: updateQuery } = useMutation({
        mutationKey: '/boards/update',
        mutationFn: updateCurrentBoard
    })

    const { mutate: deleteQuery } = useMutation({
        mutationKey: '/boards/delete',
        mutationFn: deleteBoardById
    })

    const { data: currentBoard, refetch: refetchCurrentBoards, isLoading } = useQuery(['/boards/current', boardId], () => getDetailsBoard(boardId as string), {
        enabled: !!boardId && !!token,
        keepPreviousData: true
    })

    const boardQuery = useMemo(() => {
        if (!currentBoard) return undefined;
        return currentBoard.boards;
    }, [currentBoard]);

    const sectionsQuery = useMemo(() => {
        if (!currentBoard) return undefined;
        return currentBoard.sections;
    }, [currentBoard]);

    const handleClickFavorite = () => {
        const allBoardsQuery = queryClient.getQueryData<Board[]>('/boards/all')
        const favoriteBoardsQuery = queryClient.getQueryData<Board[]>('/boards/favorite')

        if (!favoriteBoardsQuery || !allBoardsQuery || !boardQuery) return;
        const stateFavorite = !boardQuery.isFavorite;

        if (stateFavorite) {
            const copyBoards = _.cloneDeep(allBoardsQuery);
            const currentBoard = copyBoards.find(
                (board) => board.boardId === boardQuery.boardId
            )!;
            currentBoard.isFavorite = stateFavorite

            queryClient.setQueryData('/boards/all', [...copyBoards])
            queryClient.setQueryData('/boards/favorite', [currentBoard, ...favoriteBoardsQuery])

            updateQuery({ data: { isFavorite: stateFavorite }, id: boardId as string }, {
                onError: () => {
                    queryClient.refetchQueries('/boards/all')
                    queryClient.refetchQueries('/boards/favorite')
                    refetchCurrentBoards();
                    toast.error('Error')
                }
            })
        }

        if (!stateFavorite) {
            const copyFavorites = _.cloneDeep(favoriteBoardsQuery);
            const currentBoard = copyFavorites.findIndex(
                (board) => board.boardId === boardQuery.boardId
            )!;
            const newBoards = _.cloneDeep(allBoardsQuery).map((board) => {
                if (board.boardId === copyFavorites[currentBoard].boardId)
                    return {
                        ...board,
                        isFavorite: stateFavorite,
                    }
                return board
            })
            const newFavorite = copyFavorites.filter(board => board.boardId !== copyFavorites[currentBoard].boardId)

            queryClient.setQueryData('/boards/all', [...newBoards])
            queryClient.setQueryData('/boards/favorite', [...newFavorite])

            updateQuery({ data: { isFavorite: stateFavorite }, id: boardId as string }, {
                onError: () => {
                    queryClient.refetchQueries('/boards/all')
                    queryClient.refetchQueries('/boards/favorite')
                    refetchCurrentBoards();
                    toast.error('Error')
                }
            })
        }

        const newBoards = _.cloneDeep(boardQuery);
        newBoards.isFavorite = stateFavorite;
        queryClient.setQueryData(['/boards/current', boardId], { ...currentBoard, boards: newBoards })
    };

    const onDelete = () => {
        const allBoardsQuery = queryClient.getQueryData<Board[]>('/boards/all')
        const favoriteBoardsQuery = queryClient.getQueryData<Board[]>('/boards/favorite')

        if (!allBoardsQuery || !favoriteBoardsQuery) return;
        const boardDelete = allBoardsQuery.find(
            (board) => board.boardId === boardId
        );
        const newBoards = _.cloneDeep(allBoardsQuery).filter(
            (board) => board.boardId !== boardId
        );
        if (boardDelete && boardDelete.isFavorite === true) {
            const newFavoriteBoards = _.cloneDeep(favoriteBoardsQuery).filter(
                (board) => board.boardId !== boardId
            );
            queryClient.setQueryData('/boards/favorite', [...newFavoriteBoards])
        }
        queryClient.setQueryData('/boards/all', [...newBoards])
        router.push('/dashboard')
        deleteQuery(boardId as string, {
            onError: () => {
                queryClient.refetchQueries('/boards/all')
                queryClient.refetchQueries('/boards/favorite')
                toast.error('Please try again !')
            }
        })
    };

    if (isLoading) return <BoardDetailsLoading />

    return (
        <DefaultLayout>
            {boardQuery && (
                <VStack
                    p="8"
                    px="4"
                    pb={'2'}
                    w={'full'}
                    alignItems={'start'}
                    position={'relative'}
                    h={'full'}
                    overflow={'auto'}
                >
                    <Text
                        as={TiStarFullOutline}
                        fontSize={'3xl'}
                        cursor={'pointer'}
                        position={'absolute'}
                        zIndex={'modal'}
                        sx={{ top: '0', left: '6px' }}
                        color={boardQuery.isFavorite ? 'yellow.400' : ''}
                        onClick={handleClickFavorite}
                    />
                    <Text
                        as={IoTrashBin}
                        fontSize={'2xl'}
                        cursor={'pointer'}
                        position={'absolute'}
                        zIndex={'modal'}
                        sx={{ top: '0', right: '8px' }}
                        color={'red.400'}
                        _hover={{ color: 'red.500' }}
                        onClick={onDelete}
                    />
                    <HeadBoard boards={boardQuery} boardId={boardId as string} />
                    <Box w={'full'} sx={{ flex: '1' }}>
                        {sectionsQuery && (
                            <SectionsBoards
                                sections={sectionsQuery}
                                boardId={boardId as string}
                            />
                        )}
                    </Box>
                </VStack>
            )}
        </DefaultLayout>
    );
};

export default BoardDetails;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    resetServerContext()
    return { props: {} }
}