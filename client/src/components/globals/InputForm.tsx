import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from '@chakra-ui/react';
import { HTMLInputTypeAttribute } from 'react';
import {
    Control,
    FieldPath,
    FieldValues,
    useController,
} from 'react-hook-form';

interface InputFormProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    name: TName;
    control: Control<TFieldValues>;
    label: string;
    type: HTMLInputTypeAttribute | undefined;
}

const InputForm = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    name,
    control,
    label,
    type,
}: InputFormProps<TFieldValues, TName>) => {
    const { field, fieldState } = useController({ control, name });
    return (
        <FormControl mt={'6'} isInvalid={!!fieldState.error}>
            <FormLabel>{label}</FormLabel>
            <Input
                type={type}
                w={'96'}
                borderColor={'gray.500'}
                borderWidth={'1.5px'}
                rounded={'base'}
                _hover={{ borderColor: 'blue.400' }}
                {...field}
            />
            <FormErrorMessage fontWeight={'semibold'}>
                {fieldState.error && <p>{fieldState.error.message}</p>}
            </FormErrorMessage>
        </FormControl>
    );
};

export default InputForm;
