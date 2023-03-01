import DefaultLayoutLoading from '@/components/skeleton/DefaultLayoutLoading.skeleton';
import SidebarList from '@/components/system/SidebarList';
import { RootState } from '@/redux/store';
import {
    createNewBoard,
    getFavoriteBoards,
    getPrivateBoards,
    updatePositionBoard,
} from '@/utils/axios/board.axios';
import logout from '@/utils/helpers/logout';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface DefaultLayoutProps {
    children: React.ReactNode;
}

const DefaultLayout: FunctionComponent<DefaultLayoutProps> = ({ children }) => {
    const router = useRouter();

    const username = useSelector<RootState>(
        (state) => state.auth.user.username
    ) as RootState['auth']['user']['username'];

    const {
        data: privateBoardsQuery,
        refetch: refetchPrivateBoards,
        isLoading: isGetPrivateBoardsLoading,
    } = useQuery('/boards/all', ({ signal }) => getPrivateBoards(), {
        enabled: !!username,
    });

    const { data: favoriteBoardsQuery, refetch: refetchFavoriteBoards, isLoading: isGetFavoriteBoardsLoading } =
        useQuery('/boards/favorite', ({ signal }) => getFavoriteBoards(), {
            enabled: !!username,
        });

    const queryClient = useQueryClient();

    const { mutate: handleCreateQuery } = useMutation({
        mutationKey: '/boards/create',
        mutationFn: createNewBoard,
    });

    const { mutate: handleUpdatePositionQuery } = useMutation({
        mutationKey: '/boards/updatePosition',
        mutationFn: updatePositionBoard,
    });

    const handleCreateNew = async () => {
        handleCreateQuery(undefined, {
            onSuccess: (data) => {
                refetchPrivateBoards();
                router.push({
                    pathname: ['/dashboard', data?.boardId].join('/'),
                });
            },
            onError: (error) => {
                toast.error('Please try again !');
            },
        });
    };

    const onLogout = async () => {
        await logout(() => {
            router.push('/login');
        });
    };

    const onDragEndPrivate = (result: DropResult) => {
        const { destination, source } = result;
        if (
            !destination ||
            !privateBoardsQuery ||
            destination.index === source.index
        )
            return;

        const newBoards = [...privateBoardsQuery];
        const [currentBoard] = newBoards.splice(source.index, 1);
        newBoards.splice(destination.index, 0, currentBoard);

        queryClient.setQueryData('/boards/all', [...newBoards]);
        handleUpdatePositionQuery(
            { data: newBoards, type: 'private' },
            {
                onError: () => {
                    refetchPrivateBoards();
                    toast.error('Please try again !');
                },
            }
        );
    };

    const onDragEndFavorite = (result: DropResult) => {
        const { destination, source } = result;
        if (
            !destination ||
            !favoriteBoardsQuery ||
            destination.index === source.index
        )
            return;

        const newBoards = [...favoriteBoardsQuery];
        const [currentBoard] = newBoards.splice(source.index, 1);
        newBoards.splice(destination.index, 0, currentBoard);

        queryClient.setQueryData('/boards/favorite', [...newBoards]);
        handleUpdatePositionQuery(
            { data: [...newBoards], type: 'favorite' },
            {
                onError: () => {
                    refetchFavoriteBoards();
                    toast.error('Please try again !');
                },
            }
        );
    };

    const isLoading = isGetPrivateBoardsLoading || isGetFavoriteBoardsLoading
    if (isLoading) return <DefaultLayoutLoading>{children}</DefaultLayoutLoading>;

    return (
        <HStack sx={{ width: '100vw', height: '100vh' }}>
            <VStack
                w={'60'}
                h={'full'}
                bg={'blackAlpha.400'}
                p={'3'}
                fontWeight="semibold"
            >
                <Box
                    w={'full'}
                    alignItems={'center'}
                    display={'flex'}
                    justifyContent={'space-between'}
                    gap={'4'}
                >
                    <Text>{username || 'Potato'}</Text>
                    <Text
                        cursor={'pointer'}
                        display={'flex'}
                        onClick={onLogout}
                    >
                        <FiLogOut size={24} />
                    </Text>
                </Box>
                <Box pt={'6'} w={'full'}>
                    <Text>Favorites</Text>
                    <SidebarList
                        boards={favoriteBoardsQuery}
                        droppableId={'boards-favorite'}
                        keyDrop={'boards-favorite-key'}
                        onDragEnd={onDragEndFavorite}
                    />
                </Box>
                <Box
                    pt={'6'}
                    w={'full'}
                    sx={{ flex: '1' }}
                    display={'flex'}
                    flexDirection={'column'}
                    overflow={'hidden'}
                >
                    <Box
                        w={'full'}
                        alignItems={'center'}
                        display={'flex'}
                        justifyContent={'space-between'}
                        gap={'4'}
                    >
                        <Text pb={'2'}>Privates</Text>
                        <Text
                            cursor={'pointer'}
                            display={'flex'}
                            onClick={handleCreateNew}
                        >
                            <AiOutlinePlusSquare size={22} />
                        </Text>
                    </Box>
                    <Box
                        sx={{
                            '::-webkit-scrollbar': {
                                display: 'none',
                            },
                            flex: '1',
                        }}
                        display={'flex'}
                        flexDirection={'column'}
                        overflowY={'auto'}
                    >
                        <SidebarList
                            boards={privateBoardsQuery}
                            droppableId={'boards-private'}
                            keyDrop={'boards-private-key'}
                            onDragEnd={onDragEndPrivate}
                        />
                    </Box>
                </Box>
            </VStack>
            <VStack
                w={'full'}
                h={'full'}
                sx={{ flex: '1' }}
                py={'2'}
                overflow={'hidden'}
            >
                {children}
            </VStack>
        </HStack>
    );
};

export default DefaultLayout;
