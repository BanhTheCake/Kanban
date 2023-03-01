import DefaultLayout from "@/layouts/DefaultLayout";
import { Box, Grid, GridItem, Skeleton, Stack, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { IoTrashBin } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";

interface BoardDetailsLoadingProps {

}

const BoardDetailsLoading: FC<BoardDetailsLoadingProps> = () => {
    return <DefaultLayout>
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
            />
            <Text
                as={IoTrashBin}
                fontSize={'2xl'}
                cursor={'pointer'}
                position={'absolute'}
                zIndex={'modal'}
                sx={{ top: '0', right: '8px' }}
                color={'red.400'}
            />
            <Box
                w={'full'}
                gap={'1'}
                display="flex"
                flexDirection={'column'}
                pb={'2'}
            >
                <Stack spacing={'3'}>
                    <Skeleton height={'20px'} width={'20px'} />
                    <Skeleton height={'20px'} width={'200px'} />
                    <Skeleton height={'20px'} width={'full'} />
                    <Skeleton height={'20px'} width={'full'} />
                    <Skeleton height={'20px'} width={'full'} />
                </Stack>
            </Box>
            <Box w={'full'} sx={{ flex: '1' }}>
                <Grid templateColumns={'repeat(3, 1fr)'} gap={'6'} mt={'8'}>
                    <GridItem w={'100%'}>
                        <Stack spacing='4'>
                            <Skeleton height={'30px'} width='full' />
                            <Skeleton height={'20px'} width='full' />
                            <Skeleton height={'20px'} width='full' />
                        </Stack>
                    </GridItem>
                    <GridItem w={'100%'}>
                        <Stack spacing='4'>
                            <Skeleton height={'30px'} width='full' />
                            <Skeleton height={'20px'} width='full' />
                            <Skeleton height={'20px'} width='full' />
                        </Stack>
                    </GridItem>
                    <GridItem w={'100%'}>
                        <Stack spacing='4'>
                            <Skeleton height={'30px'} width='full' />
                            <Skeleton height={'20px'} width='full' />
                            <Skeleton height={'20px'} width='full' />
                        </Stack>
                    </GridItem>
                </Grid>
            </Box>
        </VStack>
    </DefaultLayout>;
}

export default BoardDetailsLoading;