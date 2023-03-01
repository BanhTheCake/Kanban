import { AxiosError } from 'axios';
import { Board, Section, TResponse } from '../type';
import axiosPrivate from './custom/axiosPrivate';

export const getPrivateBoards = () => {
    return new Promise<Board[]>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'get',
                url: 'http://localhost:3003/v1/api/boards/all',
            });
            const resData = res.data as TResponse<Board[]>;
            if (resData.errCode !== 0) {
                return reject(resData.msg);
            }
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            if (!errT.response) {
                return reject('Something wrong with server !');
            }
            reject(errT.message);
        }
    });
};

export const getFavoriteBoards = () => {
    return new Promise<Board[]>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'get',
                url: 'http://localhost:3003/v1/api/boards/all/favorite',
            });
            const resData = res.data as TResponse<Board[]>;
            if (resData.errCode !== 0) {
                return reject(resData.msg);
            }
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            if (!errT.response) {
                return reject('Something wrong with server !');
            }
            reject(errT.message);
        }
    });
};

export type TCreateNewBoard = {
    userId: string;
    position: number;
    id: number;
    boardId: string;
    created_at: string;
    updated_at: string;
};

export const createNewBoard = () => {
    return new Promise<TCreateNewBoard>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'post',
                url: 'http://localhost:3003/v1/api/boards/create',
            });
            const resData = res.data as TResponse<TCreateNewBoard>;
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            if (!errT.response) {
                return reject('Something wrong with server !');
            }
            reject(errT.message);
        }
    });
};

export const updatePositionBoard = ({
    data,
    type = 'private',
}: {
    data: Board[];
    type: 'favorite' | 'private';
}) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'patch',
                url: 'http://localhost:3003/v1/api/boards/updatePosition',
                data: { newBoards: data, type: type },
            });
            const resData = res.data as TResponse<void>;
            resolve();
        } catch (error) {
            const errT = error as AxiosError;
            if (!errT.response) {
                return reject('Something wrong with server !');
            }
            reject(errT.message);
        }
    });
};

export type TGetDetailsBoard = {
    boards: Board;
    sections: Section[];
};

export const getDetailsBoard = (id: string) => {
    return new Promise<TGetDetailsBoard>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'get',
                url: ['http://localhost:3003/v1/api/boards/current', id].join(
                    '/'
                ),
            });
            const resData = res.data as TResponse<TGetDetailsBoard>;
            if (resData.errCode !== 0) {
                return reject(resData.msg);
            }
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            if (!errT.response) {
                return reject('Something wrong with server !');
            }
            reject(errT.message);
        }
    });
};

export type TUpdateCurrentBoardProps = Partial<
    Pick<Board, 'description' | 'icon' | 'title' | 'isFavorite'>
>;

export const updateCurrentBoard = ({
    data,
    id,
}: {
    data: TUpdateCurrentBoardProps;
    id: string;
}) => {
    return new Promise<Board>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'patch',
                url: ['http://localhost:3003/v1/api/boards/update', id].join(
                    '/'
                ),
                data: data,
            });
            const resData = res.data as TResponse<Board>;
            if (resData.errCode !== 0) {
                return reject(resData.msg);
            }
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            if (!errT.response) {
                return reject('Something wrong with server !');
            }
            reject(errT.message);
        }
    });
};

export const deleteBoardById = (boardId: string) => {
    return new Promise<Board>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'delete',
                url: [
                    'http://localhost:3003/v1/api/boards/delete/',
                    boardId,
                ].join(''),
            });
            const resData = res.data as TResponse<Board>;
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            console.log(error);
            if (!errT.response) return reject('Something wrong with sever !');
            reject(errT.message);
        }
    });
};
