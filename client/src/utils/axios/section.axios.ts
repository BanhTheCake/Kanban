import { AxiosError } from 'axios';
import { Section, TResponse } from '../type';
import axiosPrivate from './custom/axiosPrivate';

export const createNewSection = (boardId: string) => {
    return new Promise<Section>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'Post',
                url: 'http://localhost:3003/v1/api/sections/create',
                data: { boardId },
            });
            const resData = res.data as TResponse<Section>;
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            console.log(error);
            if (!errT.response) return reject('Something wrong with server');
            reject(errT.message);
        }
    });
};

export const deleteCurrentSection = (sectionId: string) => {
    return new Promise<Omit<Section, 'tasks'>>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'delete',
                url: [
                    'http://localhost:3003/v1/api/sections/delete/',
                    sectionId,
                ].join(''),
            });
            const resData = res.data as TResponse<Omit<Section, 'tasks'>>;
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            console.log(error);
            if (!errT.response) return reject('Something wrong with server');
            reject(errT.message);
        }
    });
};

export const updateCurrentSection = ({
    sectionId,
    title,
}: {
    sectionId: string;
    title: string;
}) => {
    return new Promise<Section>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'patch',
                url: [
                    'http://localhost:3003/v1/api/sections/update/',
                    sectionId,
                ].join(''),
                data: { title },
            });
            const resData = res.data as TResponse<Section>;
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            console.log(error);
            if (!errT.response) return reject('Something wrong with server');
            reject(errT.message);
        }
    });
};

export const updatePositionSections = (data: Section[]) => {
    return new Promise<Section[]>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'patch',
                url: 'http://localhost:3003/v1/api/sections/updatePosition',
                data: { newSections: data },
            });
            const resData = res.data as TResponse<Section[]>;
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
