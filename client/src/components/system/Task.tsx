import { Box, ListItem } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { Task as TaskType } from '@/utils/type';
import { Draggable } from 'react-beautiful-dnd';

interface TaskProps {
    data: TaskType;
    index: number;
    onDoubleClick: (...arg: any) => any;
}

const Task: FunctionComponent<TaskProps> = ({ data, index, onDoubleClick }) => {
    return (
        <Draggable draggableId={data.taskId} index={index}>
            {(provided, snapshot) => <ListItem>
                <Box
                    w="full"
                    bg="whiteAlpha.100"
                    rounded={'md'}
                    p={'1.5'}
                    px={'2'}
                    cursor={'pointer'}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    onDoubleClick={() => onDoubleClick(data)}
                >
                    {data.title || 'Undefine'}
                </Box>
            </ListItem>}
        </Draggable>
    );
};

export default Task;
