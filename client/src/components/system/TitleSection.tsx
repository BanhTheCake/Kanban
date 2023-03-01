import { Input } from '@chakra-ui/react';
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';

interface TitleSectionProps {
    initValue: string;
    handleUpdate: Function;
}

const TitleSection: FunctionComponent<TitleSectionProps> = ({
    initValue,
    handleUpdate,
}) => {
    const [value, setValue] = useState(initValue || 'No name');

    useEffect(() => {
        setValue(initValue || 'No name');
    }, [initValue]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        handleUpdate(e.target.value);
    };

    return (
        <Input
            value={value}
            variant={'unstyled'}
            fontWeight={'semibold'}
            textOverflow={'ellipsis'}
            onChange={onChange}
        />
    );
};

export default TitleSection;
