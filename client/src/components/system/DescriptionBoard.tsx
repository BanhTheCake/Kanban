import { Textarea } from "@chakra-ui/react";
import { ChangeEvent, FunctionComponent, useEffect, useMemo, useState } from "react";
import reactTextareaAutosize from 'react-textarea-autosize';

interface DescriptionBoardProps {
    maxRows: number,
    minRows: number,
    initValue: string,
    handleUpdate: (value: any) => void,
}

const DescriptionBoard: FunctionComponent<DescriptionBoardProps> = ({ maxRows, minRows, initValue, handleUpdate }) => {

    const [value, setValue] = useState(initValue || 'Add description here...');

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value)
        handleUpdate(e.target.value)
    }

    useEffect(() => {
        setValue(initValue || 'Add description here...')
    }, [initValue])

    return <Textarea
        as={reactTextareaAutosize}
        maxRows={maxRows}
        minRows={minRows}
        value={value}
        onChange={onChange}
        resize={'none'}
        p={'1'}
        lineHeight={'tall'}
        spellCheck={false}
        variant={'unstyled'}
        sx={
            {
                '::-webkit-scrollbar': {
                    display: 'none'
                },
            }}
    ></Textarea>;
}

export default DescriptionBoard;