import {
    Box,
    Button,
    ButtonGroup,
    HStack,
    List,
} from '@chakra-ui/react';
import { FunctionComponent, useMemo, useState } from 'react';
import Task from './Task';
import { Section as SectionType, Task as TaskType } from '@/utils/type';

import { AiOutlinePlus } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';

import { updateCurrentSection } from '@/utils/axios/section.axios';
import TitleSection from './TitleSection';
import _ from 'lodash';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useMutation, useQueryClient } from 'react-query';
import { createNewTask, dataUpdateTask, updateDataTask } from '@/utils/axios/tasks.axios';
import TaskModal from './TaskModal';
import { toast } from 'react-toastify';

interface SectionProps {
    data: SectionType;
    onDelete: (section: string) => void;
    boardId: string;
    index: number;
}

const Section: FunctionComponent<SectionProps> = ({
    data,
    onDelete,
    boardId,
    index,
}) => {
    const queryClient = useQueryClient();
    const [isShowModal, setIsShowModal] = useState(false)
    const [currentTask, setCurrentTask] = useState<TaskType | null>(null);

    const { mutate: handleUpdateQuery } = useMutation({
        mutationKey: '/sections/update',
        mutationFn: updateCurrentSection,
    });

    const { mutate: handleCreateTask } = useMutation({
        mutationKey: '/tasks/create',
        mutationFn: createNewTask,
    });

    const { mutate: handleUpdateData } = useMutation({
        mutationKey: '/tasks/updateData',
        mutationFn: updateDataTask
    })

    const debounceUpdate = useMemo(() => {
        const func = async (value: string) => {
            handleUpdateQuery(
                { title: value, sectionId: data.sectionId },
                {
                    onError: (error) => {
                        queryClient.refetchQueries([
                            '/boards/current',
                            boardId,
                        ]);
                        console.log('error: ', error);
                    },
                }
            );
        };
        return _.debounce(func, 500);
    }, [boardId, handleUpdateQuery, queryClient, data.sectionId]);

    const onCreateTask = () => {
        handleCreateTask(data.sectionId, {
            onSuccess: () => {
                queryClient.refetchQueries(['/boards/current', boardId]);
            },
        });
    };

    const onCloseModal = () => {
        setIsShowModal(false)
    }

    const onClickDouble = (task: TaskType) => {
        setIsShowModal(true)
        setCurrentTask(task)
    }

    const debounceUpdateData = useMemo(() => {
        const func = (key: keyof dataUpdateTask, value: string, taskId: string) => {
            handleUpdateData({ data: { [key]: value }, taskId: taskId }, {
                onSettled: () => {
                    queryClient.refetchQueries(['/boards/current', boardId])
                },
                onError: () => {
                    setIsShowModal(false)
                    setCurrentTask(null)
                    toast.error('Please try again !')
                }
            })
        }
        return _.debounce(func, 500)
    }, [boardId, handleUpdateData, queryClient])
    return (
        <Draggable draggableId={data.sectionId} index={index}>
            {(provided, snapshot) => (
                <Box
                    p={'2'}
                    pt={'0'}
                    w={'60'}
                    flexShrink={'0'}
                    bg={'gray.900'}
                    rounded={'sm'}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <HStack justifyContent={'space-between'} gap={'4'} {...provided.dragHandleProps}>
                        <TitleSection
                            initValue={data.title}
                            handleUpdate={debounceUpdate}
                        />
                        <ButtonGroup>
                            <Button
                                size={'sm'}
                                variant={'unstyled'}
                                px={'1'}
                                onClick={onCreateTask}
                            >
                                <AiOutlinePlus size={24} />
                            </Button>
                            <Button
                                size={'sm'}
                                variant={'unstyled'}
                                px={'1'}
                                onClick={() => onDelete(data.sectionId)}
                            >
                                <RiDeleteBinLine size={22} />
                            </Button>
                        </ButtonGroup>
                    </HStack>
                    <Droppable droppableId={data.sectionId} type='tasks'>
                        {(provided) => (
                            <Box
                                minH={'2'}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {data.tasks && data.tasks.length > 0 && (
                                    <List spacing={'2.5'} mt={'2'}>
                                        {data.tasks.map((task, index) => {
                                            return (
                                                <Task
                                                    data={task}
                                                    key={task.taskId}
                                                    index={index}
                                                    onDoubleClick={onClickDouble}
                                                />
                                            );
                                        })}
                                    </List>
                                )}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                    <TaskModal isOpen={isShowModal} onClose={onCloseModal} task={currentTask} onUpdateData={debounceUpdateData} />
                </Box>
            )}
        </Draggable>
    );
};

export default Section;
