import { Box, Button } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import DefaultLayout from '@/layouts/DefaultLayout';
import { createNewBoard } from '@/utils/axios/board.axios';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { GetServerSideProps } from 'next';
import { resetServerContext } from 'react-beautiful-dnd';

interface DashboardProps { }

const Dashboard: FunctionComponent<DashboardProps> = () => {

    const router = useRouter()
    const queryClient = useQueryClient()

    const { mutate: handleCreateQuery } = useMutation({
        mutationKey: '/boards/create',
        mutationFn: createNewBoard,
    })

    const handleCreateNew = async () => {
        handleCreateQuery(undefined, {
            onSuccess: (data) => {
                queryClient.refetchQueries({ queryKey: '/board/all' })
                router.push({
                    pathname: ['/dashboard', data?.boardId].join('/'),
                });
            },
            onError(error) {
                toast.error('Please try again !')
            },
        })
    };

    return (
        <DefaultLayout>
            <Box
                w={'full'}
                h={'full'}
                display={'flex'}
                alignItems={'center'}
                justifyContent="center"
            >
                <Button onClick={handleCreateNew} variant={'outline'} colorScheme="green" px={'6'}>
                    Click here to create new board !
                </Button>
            </Box>
        </DefaultLayout>
    );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    resetServerContext()
    return { props: {} }
}
