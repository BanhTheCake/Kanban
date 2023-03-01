import {
    TGetDetailsBoard,
    TUpdateCurrentBoardProps,
    updateCurrentBoard,
} from '@/utils/axios/board.axios';
import { Box } from '@chakra-ui/react';
import { FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import EmojiInput from '../globals/InputEmoji';
import DescriptionBoard from './DescriptionBoard';
import HeaderBoard from './HeaderBoard';
import _ from 'lodash';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Board } from '@/utils/type';

interface HeadBoardProps {
    boards: Board;
    boardId: string;
}

const HeadBoard: FunctionComponent<HeadBoardProps> = ({ boards, boardId }) => {
    const queryClient = useQueryClient();

    const { mutate: updateQuery } = useMutation({
        mutationKey: '/boards/update',
        mutationFn: updateCurrentBoard,
    });

    const handleOptimistUi = useCallback(
        (key: keyof TUpdateCurrentBoardProps, value: any) => {
            const allBoardsQuery =
                queryClient.getQueryData<Board[]>('/boards/all');
            const favoritesQuery =
                queryClient.getQueryData<Board[]>(
                    '/boards/favorite'
                );

            if (!allBoardsQuery || !favoritesQuery) return;

            const copyAllBoards = _.cloneDeep(allBoardsQuery);
            const copyFavorites = _.cloneDeep(favoritesQuery);

            const currentBoard:
                | Record<keyof Board, any>
                | undefined = copyAllBoards.find(
                    (board) => board.boardId === boardId
                );
            const currentBoardInFavorite:
                | Record<keyof Board, any>
                | undefined = copyFavorites.find(
                    (board) => board.boardId === boardId
                );

            if (currentBoard) {
                currentBoard[key] = value;
                queryClient.setQueryData('/boards/all', [...copyAllBoards]);
            }
            if (currentBoardInFavorite) {
                currentBoardInFavorite[key] = value;
                queryClient.setQueryData('/boards/favorite', [
                    ...copyFavorites,
                ]);
            }
        },
        [boardId, queryClient]
    );

    const updateDebounce = useMemo(() => {
        const updateFunc = (
            key: keyof TUpdateCurrentBoardProps,
            value: any
        ) => {
            const currentData = queryClient.getQueryData<TGetDetailsBoard>([
                '/boards/current',
                boardId,
            ]);
            if (!currentData) return;
            queryClient.setQueryData(['/boards/current', boardId], {
                ...currentData,
                boards: {
                    ...currentData.boards,
                    [key]: value,
                },
            });
            updateQuery(
                { data: { [key]: value }, id: boardId },
                {
                    onError: (err) => {
                        toast.error('Please try again !');
                        queryClient.refetchQueries([
                            '/boards/current',
                            boardId,
                        ]);
                        queryClient.refetchQueries('/boards/all');
                        queryClient.refetchQueries('/boards/favorite');
                    },
                }
            );
        };
        return _.debounce(updateFunc, 500);
    }, [updateQuery, boardId, queryClient]);

    const handleUpdate = useCallback(
        (key: keyof TUpdateCurrentBoardProps) => {
            return (value: any) => {
                updateDebounce(key, value);
                handleOptimistUi(key, value);
            };
        },
        [updateDebounce, handleOptimistUi]
    );

    return (
        <Box
            w={'full'}
            gap={'1'}
            display="flex"
            flexDirection={'column'}
            pb={'2'}
        >
            <EmojiInput
                initEmoji={boards.icon}
                handleUpdate={handleUpdate('icon')}
                keyType={'icon'}
            />
            <HeaderBoard
                initValue={boards.title}
                handleUpdate={handleUpdate('title')}
                deps={[boardId]}
            />
            <DescriptionBoard
                initValue={boards.description}
                maxRows={5}
                minRows={1}
                handleUpdate={handleUpdate('description')}
            />
        </Box>
    );
};

export default HeadBoard;
