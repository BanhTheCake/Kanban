import { TGetDetailsBoard } from '@/utils/axios/board.axios';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { FunctionComponent, memo } from 'react';
import Section from './Section';
import { Section as SectionType } from '@/utils/type'
import {
    createNewSection,
    deleteCurrentSection,
    updatePositionSections,
} from '@/utils/axios/section.axios';
import _ from 'lodash';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useMutation, useQueryClient } from 'react-query';
import { updatePositionTasks } from '@/utils/axios/tasks.axios';

interface Props {
    sections: SectionType[];
    boardId: string;
}

const SectionsBoards: FunctionComponent<Props> = ({ sections, boardId }) => {
    const queryClient = useQueryClient();

    const { mutate: handleCreateQuery } = useMutation({
        mutationKey: '/sections/create',
        mutationFn: createNewSection,
    });

    const { mutate: handleDeleteQuery } = useMutation({
        mutationKey: '/sections/delete',
        mutationFn: deleteCurrentSection,
    });

    const { mutate: handleUpdateQuery } = useMutation({
        mutationKey: '/sections/updatePosition',
        mutationFn: updatePositionSections,
    });

    const { mutate: handleUpdateTasks } = useMutation({
        mutationKey: '/tasks/updatePosition',
        mutationFn: updatePositionTasks,
    });

    const onCreateNewSection = () => {
        const currentBoard = queryClient.getQueryData([
            '/boards/current',
            boardId,
        ]);
        if (!boardId || !currentBoard) return;

        handleCreateQuery(boardId, {
            onError: (error) => {
                console.log('error: ', error);
            },
            onSettled: () => {
                queryClient.refetchQueries(['/boards/current', boardId]);
            },
        });
    };

    const onDeleteSection = (sectionId: string) => {
        const currentBoard = queryClient.getQueryData([
            '/boards/current',
            boardId,
        ]);
        if (!boardId || !currentBoard) return;

        const copySections = _.cloneDeep(sections);
        const sectionDeleteIndex = sections.findIndex(
            (section) => section.sectionId === sectionId
        );
        copySections.splice(sectionDeleteIndex, 1);
        queryClient.setQueryData(['/boards/current', boardId], {
            ...currentBoard,
            sections: [...copySections],
        });

        handleDeleteQuery(sectionId, {
            onError: (error) => {
                queryClient.refetchQueries(['/boards/current', boardId]);
                console.log('error: ', error);
            },
        });
    };

    const onDragEnd = (result: DropResult) => {
        console.log('result: ', result);
        const currentBoard = queryClient.getQueryData<TGetDetailsBoard>([
            '/boards/current',
            boardId,
        ]);
        const { source, destination, type } = result;

        const notAllow =
            !destination ||
            (destination.droppableId === source.droppableId &&
                destination.index === source.index) ||
            !currentBoard;

        if (notAllow) return;
        if (type === 'tasks') {
            const copyCurrentBoard = _.cloneDeep(currentBoard);
            const allSections = _.cloneDeep(sections);

            const sourceSection = _.cloneDeep(
                sections.find(
                    (section) => section.sectionId === source.droppableId
                )
            )!;
            const destinationSection = _.cloneDeep(
                sections.find(
                    (section) => section.sectionId === destination.droppableId
                )
            )!;
            const sourceTasks = sourceSection.tasks;
            const destinationTasks = destinationSection.tasks;

            if (destination.droppableId === source.droppableId) {
                const [currentTask] = sourceTasks.splice(source.index, 1);
                sourceTasks.splice(destination.index, 0, currentTask);
                const newSections = allSections.map((section) => {
                    if (section.sectionId === sourceSection.sectionId) {
                        return sourceSection;
                    }
                    return section;
                });
                queryClient.setQueryData<TGetDetailsBoard>(
                    ['/boards/current', boardId],
                    {
                        ...copyCurrentBoard,
                        sections: [...newSections],
                    }
                );
                handleUpdateTasks(
                    { sourceTasks: sourceTasks },
                    {
                        onError: () => {
                            queryClient.refetchQueries([
                                '/boards/current',
                                boardId,
                            ]);
                        },
                    }
                );
            }

            if (destination.droppableId !== source.droppableId) {
                const [currentTask] = sourceTasks.splice(source.index, 1);
                currentTask.sectionId = destination.droppableId;
                destinationTasks.splice(destination.index, 0, currentTask);
                const newSections = allSections.map((section) => {
                    if (section.sectionId === sourceSection.sectionId) {
                        return sourceSection;
                    }
                    if (section.sectionId === destinationSection.sectionId) {
                        return destinationSection;
                    }
                    return section;
                });
                queryClient.setQueryData(['/boards/current', boardId], {
                    ...copyCurrentBoard,
                    sections: [...newSections],
                });
                handleUpdateTasks(
                    {
                        sourceTasks: sourceTasks,
                        destinationTasks: destinationTasks,
                    },
                    {
                        onError: () => {
                            queryClient.refetchQueries([
                                '/boards/current',
                                boardId,
                            ]);
                        },
                    }
                );
            }
        }

        if (type === 'sections') {
            const copySections = _.cloneDeep(sections);
            const [currentSection] = copySections.splice(source.index, 1);
            copySections.splice(destination.index, 0, currentSection);

            queryClient.setQueryData(['/boards/current', boardId], {
                ...currentBoard,
                sections: [...copySections],
            });
            handleUpdateQuery(copySections, {
                onError(error) {
                    queryClient.refetchQueries(['/boards/current', boardId]);
                    console.log('error: ', error);
                },
            });
        }
    };

    return (
        <Box
            w={'full'}
            sx={{ flex: '1' }}
            overflow={'hidden'}
            h={'full'}
            display={'flex'}
            flexDirection={'column'}
        >
            <HStack
                w={'full'}
                justifyContent={'space-between'}
                pb={'2'}
                px={'1'}
                borderBottom={'1px'}
                borderColor={'whiteAlpha.400'}
            >
                <Button
                    variant={'ghost'}
                    size={'sm'}
                    onClick={onCreateNewSection}
                >
                    ADD SECTION
                </Button>
                <Text fontWeight={'semibold'}>
                    {sections?.length || 0} Sections
                </Text>
            </HStack>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="all-sections"
                    direction="horizontal"
                    type="sections"
                >
                    {(provided) => (
                        <HStack
                            w={'full'}
                            h={'full'}
                            overflowX="auto"
                            py={'2'}
                            flexWrap="nowrap"
                            gap={'2'}
                            alignItems={'start'}
                            sx={{
                                '::-webkit-scrollbar': {
                                    width: '6px',
                                    height: '10px',
                                },
                            }}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {sections.length > 0 &&
                                sections.map((section, index) => {
                                    return (
                                        <Section
                                            data={section}
                                            key={section.sectionId}
                                            onDelete={onDeleteSection}
                                            boardId={boardId}
                                            index={index}
                                        />
                                    );
                                })}
                            {provided.placeholder}
                        </HStack>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};

export default memo(SectionsBoards);
