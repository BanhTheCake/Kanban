import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Box,
} from '@chakra-ui/react';
import { ChangeEvent, FC, useEffect, useState } from 'react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';

import MenuBar from '../globals/Menubar';
import { Task } from '@/utils/type';
import { dataUpdateTask } from '@/utils/axios/tasks.axios';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null,
    onUpdateData: (key: keyof dataUpdateTask, value: string, taskId: string) => void
}

const TaskModal: FC<TaskModalProps> = ({ isOpen, onClose, task, onUpdateData }) => {
    const [data, setData] = useState({
        header: task?.title || 'No Name',
        description: task?.description || '',
        taskId: task?.taskId
    })

    const editor = useEditor({
        extensions: [
            Typography,
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
        ],
        onUpdate({ editor }) {
            setData(prev => {
                prev.taskId && onUpdateData('description', editor.getHTML(), prev.taskId)
                return {
                    ...prev,
                    description: editor.getHTML()
                }
            })
        },
    });

    const onChangeHeader = (e: ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, header: e.target.value }))
        task && onUpdateData('title', e.target.value, task.taskId)
    }

    useEffect(() => {
        setData({
            header: task?.title || 'No Name',
            description: task?.description || '',
            taskId: task?.taskId
        })
        editor && editor.commands?.setContent(task?.description || '');
    }, [task?.taskId, task?.title, task?.description, editor])
    return (
        <>
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay onClick={onClose} />
                <ModalContent my={'auto'} mx={'8'} maxHeight={'80%'} display={'flex'} flexDirection='column' overflow={'hidden'}>
                    <ModalHeader>
                        <Input
                            value={data.header}
                            onChange={onChangeHeader}
                            variant={'unstyled'}
                            textOverflow={'ellipsis'}
                            fontWeight="semibold"
                            fontSize={'1xl'}
                            pr="10"
                        />
                    </ModalHeader>
                    <ModalCloseButton onClick={onClose} />
                    <ModalBody sx={{ flex: '1' }} h={'full'} display='flex' flexDirection={'column'} height={'full'} overflow="hidden">
                        <MenuBar editor={editor} />
                        <Box
                            p={'3'}
                            pr={'2'}
                            sx={{ flex: '1' }}
                            border={'2px'}
                            borderColor={'whiteAlpha.700'}
                            borderTop={'0'}
                            borderBottom={'sm'}
                            minH={'200px'}
                            h={'full'}
                            display='flex'
                        >
                            <EditorContent spellCheck={false} editor={editor} style={{ width: '100%', overflow: 'auto', paddingRight: '4px' }} />
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TaskModal;
