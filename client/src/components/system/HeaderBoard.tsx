import { Input } from '@chakra-ui/react';
import { ChangeEvent, FunctionComponent, useEffect, useMemo, useState } from 'react';

interface HeaderBoardProps {
    initValue: string,
    deps?: any[];
    handleUpdate: (value: any) => void,
}

const HeaderBoard: FunctionComponent<HeaderBoardProps> = ({ initValue, handleUpdate, deps = [] }) => {
    const [value, setValue] = useState(initValue || 'No name')

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        handleUpdate(e.target.value)
    }

    useEffect(() => {
        setValue(initValue || 'No name')
    }, [initValue, ...deps])

    return (
        <Input
            value={value}
            variant={'unstyled'}
            fontSize={'4xl'}
            spellCheck={false}
            fontWeight={'semibold'}
            onChange={onChange}
        />
    );
};

export default HeaderBoard;
