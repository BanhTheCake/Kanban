import { FunctionComponent, useEffect, useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Box, Heading } from '@chakra-ui/react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { TUpdateCurrentBoardProps } from '@/utils/axios/board.axios';

interface EmojiProps {
    initEmoji: string,
    handleUpdate: (value: any) => void,
    keyType: keyof TUpdateCurrentBoardProps;
}

const EmojiInput: FunctionComponent<EmojiProps> = ({ initEmoji, handleUpdate }) => {
    const [selectedEmoji, setSelectedEmoji] = useState(initEmoji || '😅');
    const [isShowModal, setIsShowModal] = useState(false);

    const ref = useDetectClickOutside({ onTriggered: () => { setIsShowModal(false) } });

    useEffect(() => {
        setSelectedEmoji(initEmoji || '😅')
    }, [initEmoji])

    const onClick = (emojiData: EmojiClickData) => {
        setSelectedEmoji(emojiData.emoji);
        handleUpdate(emojiData.emoji)
        setIsShowModal(false);
    };

    return (
        <Box position={'relative'} ref={ref}>
            <Heading
                variant={'h3'}
                onClick={() => {
                    setIsShowModal(!isShowModal);
                }}
                w={'fit-content'}
                px={'2'}
                cursor={'pointer'}
                userSelect={'none'}
            >
                {selectedEmoji}
            </Heading>
            {isShowModal && (
                <Box zIndex={'modal'} position={'absolute'} sx={{ top: '100%' }} mt={'2'}>
                    <EmojiPicker onEmojiClick={onClick} />
                </Box>
            )}
        </Box>
    );
};

export default EmojiInput;
