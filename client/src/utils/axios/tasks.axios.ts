import { AxiosError } from 'axios';
import { Task, TResponse } from '../type';
import axiosPrivate from './custom/axiosPrivate';

export const createNewTask = (sectionId: string) => {
    return new Promise<Task>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'Post',
                url: 'http://localhost:3003/v1/api/tasks/create',
                data: { sectionId: sectionId },
            });
            const resData = res.data as TResponse<Task>;
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            console.log(error);
            if (!errT.response) return reject('Something wrong with server !');
            reject(errT.message);
        }
    });
};

export const updatePositionTasks = (data: {
    sourceTasks: Task[];
    destinationTasks?: Task[];
}) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'patch',
                url: 'http://localhost:3003/v1/api/tasks/updatePosition',
                data: { ...data },
            });
            const resData = res.data as TResponse<void>;
            resolve();
        } catch (error) {
            const errT = error as AxiosError;
            console.log(error);
            if (!errT.response) return reject('Something wrong with server !');
            reject(errT.message);
        }
    });
};

export type dataUpdateTask = Partial<Pick<Task, 'title' | 'description'>>;

export const updateDataTask = ({
    data,
    taskId,
}: {
    data: dataUpdateTask;
    taskId: string;
}) => {
    return new Promise<Task>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'patch',
                url: [
                    'http://localhost:3003/v1/api/tasks/update/',
                    taskId,
                ].join(''),
                data: { ...data },
            });
            const resData = res.data as TResponse<Task>;
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            console.log(error);
            if (!errT.response) return reject('Something wrong with server !');
            reject(errT.message);
        }
    });
};
