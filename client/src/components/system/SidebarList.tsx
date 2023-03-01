import { Board } from '@/utils/type';
import { List, ListItem, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from 'react-beautiful-dnd';

interface SidebarListProps {
    boards: Board[] | undefined;
    onDragEnd: (result: DropResult) => void;
    keyDrop: string;
    droppableId: string;
}

const SidebarList: FunctionComponent<SidebarListProps> = ({
    onDragEnd,
    boards,
    keyDrop,
    droppableId,
}) => {

    const router = useRouter()
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable key={keyDrop} droppableId={droppableId}>
                {(provided) => (
                    <List
                        ref={provided.innerRef}
                        mt={'2'}
                        w={'full'}
                        spacing={'1'}
                        {...provided.droppableProps}
                    >
                        {boards &&
                            boards.map((board, index) => {
                                return (
                                    <Draggable
                                        key={board.boardId}
                                        draggableId={board.boardId}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <ListItem
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                as={Link}
                                                href={['/dashboard', board.boardId].join('/')}
                                                display={'flex'}
                                                gap={'2'}
                                                p={'1.5'}
                                                px={'2'}
                                                bg={router.asPath ===
                                                    ['/dashboard', board.boardId].join('/')
                                                    ? 'whiteAlpha.100'
                                                    : 'unset'
                                                }
                                                _hover={{
                                                    bg: 'whiteAlpha.100',
                                                }}
                                                rounded={'base'}
                                                cursor={'pointer'}
                                                transition={'all'}
                                                sx={snapshot.isDragging ? { bg: 'blue.400' } : {}}
                                            >
                                                <Text>{board.icon || '❤'}</Text>
                                                <Text
                                                    w={'full'}
                                                    whiteSpace="nowrap"
                                                    textOverflow="ellipsis"
                                                    overflow="hidden"
                                                >
                                                    {board.title || 'No Name'}
                                                </Text>
                                            </ListItem>
                                        )}
                                    </Draggable>
                                );
                            })}
                        {provided.placeholder}
                    </List>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default SidebarList;
