import { Box, HStack, Skeleton, Stack, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";

interface DefaultLayoutLoadingProps {
    children: React.ReactNode
}

const DefaultLayoutLoading: FC<DefaultLayoutLoadingProps> = ({ children }) => {
    return <HStack sx={{ width: '100vw', height: '100vh' }}>
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
                <Skeleton height='20px' w={'full'} />
                <Text cursor={'pointer'} display={'flex'}>
                    <FiLogOut size={24} />
                </Text>
            </Box>
            <Box pt={'6'} w={'full'}>
                <Text>Favorites</Text>
                <Stack mt='4' spacing={'3'}>
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                </Stack>
            </Box>
            <Box pt={'6'} w={'full'} sx={{ flex: '1' }} display={'flex'} flexDirection={'column'} overflow={'hidden'}>
                <Box
                    w={'full'}
                    alignItems={'center'}
                    display={'flex'}
                    justifyContent={'space-between'}
                    gap={'4'}
                >
                    <Text pb={'2'} >Privates</Text>
                    <Text
                        cursor={'pointer'}
                        display={'flex'}
                    >
                        <AiOutlinePlusSquare size={22} />
                    </Text>
                </Box>
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    overflowY={'auto'}
                >
                    <Stack mt='4' spacing={'3'}>
                        <Skeleton height='20px' />
                        <Skeleton height='20px' />
                        <Skeleton height='20px' />
                    </Stack>
                </Box>
            </Box>
        </VStack>
        <VStack w={'full'} h={'full'} sx={{ flex: '1' }} py={'2'} overflow={'hidden'}>
            {children}
        </VStack>
    </HStack>;
}

export default DefaultLayoutLoading;