export type TResponse<T> = {
    errCode: number;
    msg: string;
    data: T;
};

export type Board = {
    id: number;
    boardId: string;
    userId: string;
    title: string;
    icon: string;
    description: string;
    position: number;
    isFavorite: boolean;
    favoritePosition: number;
    created_at: string;
    updated_at: string;
};

export type Task = {
    id: number;
    taskId: string;
    sectionId: string;
    boardId: string;
    userId: string;
    title: string;
    description: string;
    position: number;
    created_at: string;
    updated_at: string;
};

export type Section = {
    id: number;
    sectionId: string;
    boardId: string;
    userId: string;
    title: string;
    position: number;
    created_at: string;
    updated_at: string;
    tasks: Task[];
};
