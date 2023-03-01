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

import { handleRegister } from '@/utils/axios/auth.axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';

type InputsRegister = {
    username: string;
    password: string;
    cfPassword: string;
};

const schema = yup
    .object({
        username: yup.string().required('Account is required !'),
        password: yup.string().required('Password is required !'),
        cfPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords must match !')
            .required('Confirm password is required !'),
    })
    .required();

interface RegisterProps { }

const Register: FunctionComponent<RegisterProps> = () => {
    const [isShowPass, setIsShowPass] = useState<boolean>(false);
    const router = useRouter();

    const { handleSubmit, control, reset } = useForm<InputsRegister>({
        resolver: yupResolver(schema),
        defaultValues: { cfPassword: '', password: '', username: '' }
    });

    const { mutate: register, isLoading } = useMutation({
        mutationKey: '/register',
        mutationFn: handleRegister
    })

    const onSubmit: SubmitHandler<InputsRegister> = (data) => {
        register(data, {
            onSuccess: () => {
                toast.success('Create account success !')
                router.push({ pathname: '/login' })
            },
            onError: (err) => {
                toast.error(err as string)
                reset({})
            }
        })
    };

    const handleToggle = () => {
        setIsShowPass(!isShowPass);
    };

    return (
        <Container
            maxW={'container.xl'}
            sx={{ minHeight: '100vh', display: 'flex' }}
            p={'4'}
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
                <Heading>Register Account</Heading>
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
                    <InputForm
                        control={control}
                        name={'cfPassword'}
                        label={'Confirm password'}
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
                        Register
                    </Button>
                    <HStack
                        mt={'2'}
                        justify={'space-between'}
                        px={'1'}
                        fontWeight={'semibold'}
                        color={'blue.600'}
                    >
                        <Link href={'/login'}>Login</Link>
                        <Link href={'/'}>Forgot password?</Link>
                    </HStack>
                </form>
            </Center>
        </Container>
    );
};

export default Register;
