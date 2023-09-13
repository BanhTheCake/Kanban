import {
    Button,
    Center,
    Checkbox,
    Container,
    Heading,
    HStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FunctionComponent, useState } from 'react';

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputForm from '@/components/globals/InputForm';
import { handleLogin } from '@/utils/axios/auth.axios';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setValue } from '@/redux/auth.slice';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type InputsLogin = {
    username: string,
    password: string,
};

const schema = yup
    .object({
        username: yup.string().required('Account is required !'),
        password: yup.string().required('Password is required !'),
    })
    .required();

interface LoginProps { }

const Login: FunctionComponent<LoginProps> = () => {
    const [isShowPass, setIsShowPass] = useState<boolean>(false);
    const router = useRouter()
    const dispatch = useDispatch()

    const {
        handleSubmit,
        control,
    } = useForm<InputsLogin>({
        resolver: yupResolver(schema),
        defaultValues: { username: '', password: '' }
    });

    const { mutate: login, isLoading } = useMutation({
        mutationKey: '/login',
        mutationFn: handleLogin
    })

    const onSubmit: SubmitHandler<InputsLogin> = async (data) => {
        login(data, {
            onSuccess: (data) => {
                dispatch(setValue({ token: data.token, user: data.data, forceLogout: false }))
                router.push({
                    pathname: '/dashboard'
                })
            }
        })
    };

    const handleToggle = () => {
        setIsShowPass(!isShowPass);
    };

    return (
        <Container
            maxW={'container.xl'}
            sx={{ height: '100vh', display: 'flex' }}
        >
            <Center
                w={'fit-content'}
                m={'auto'}
                flexDirection={'column'}
                bg={'white'}
                color={'gray.700'}
                p={'8'}
                rounded={'base'}
            >
                <Heading>Welcome to Kanban</Heading>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputForm
                        control={control}
                        name={'username'}
                        label={'Account'}
                        type={'text'}
                    />
                    <InputForm
                        control={control}
                        name={'password'}
                        label={'Password'}
                        type={isShowPass ? 'text' : 'password'}
                    />
                    <Checkbox
                        mt={'5'}
                        ml={'1'}
                        isChecked={isShowPass}
                        onChange={handleToggle}
                        iconColor="white"
                        _checked={{ '.chakra-checkbox__control': { bg: 'blue.500', borderColor: 'blue.500' } }}
                        borderColor={'blue.500'}
                    >
                        {isShowPass ? 'Hide password' : 'Show password'}
                    </Checkbox>
                    <Button
                        mt={'5'}
                        w={'full'}
                        bg={'blue.400'}
                        _hover={{ bg: 'blue.500' }}
                        color={'white'}
                        type={'submit'}
                        disabled={isLoading}
                    >
                        login
                    </Button>
                    <HStack
                        mt={'2'}
                        justify={'space-between'}
                        px={'1'}
                        fontWeight={'semibold'}
                        color={'blue.600'}
                    >
                        <Link href={'/register'}>Register</Link>
                        <Link href={'/'}>Forgot password?</Link>
                    </HStack>
                </form>
            </Center>
        </Container>
    );
};

export default Login;
