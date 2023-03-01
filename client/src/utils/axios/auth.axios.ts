import axios, { AxiosError } from 'axios';
import { TResponse } from '../type';
import axiosPrivate from './custom/axiosPrivate';

export type THandleLogin = {
    token: string;
    data: {
        id: string;
        username: string;
    };
};

export const handleLogin = (data: { username: string; password: string }) => {
    return new Promise<THandleLogin>(async (resolve, reject) => {
        try {
            const res = await axios({
                method: 'post',
                url: 'http://localhost:3003/v1/api/auth/login',
                data: data,
                withCredentials: true,
            });
            const resData = res.data as TResponse<THandleLogin>;
            if (resData.errCode !== 0) {
                return reject(resData.msg);
            }
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            if (!errT.response) {
                console.log(error);
                return reject('Something wrong with sever !');
            }
            reject(errT.message);
        }
    });
};

export const handleRegister = (data: {
    username: string;
    password: string;
}) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const res = await axios({
                method: 'post',
                url: 'http://localhost:3003/v1/api/auth/register',
                data: data,
            });
            const resData = res.data as TResponse<void>;
            if (resData.errCode !== 0) {
                return reject(resData.msg);
            }
            resolve();
        } catch (error) {
            const errT = error as AxiosError;
            if (!errT.response) {
                console.log(error);
                return reject('Something wrong with server !');
            }
            reject(errT.message);
        }
    });
};

export const handleLogout = (id: string) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            await axios({
                method: 'get',
                url: `http://localhost:3003/v1/api/auth/logout/${id}`,
                withCredentials: true,
            });
            resolve();
        } catch (error) {
            const errT = error as AxiosError;
            if (!errT.response) {
                console.log(error);
                return reject('Something wrong with server !');
            }
            reject(errT.message);
        }
    });
};

export type TRefreshToken = {
    token: string;
};

export const handleRefreshToken = () => {
    return new Promise<TRefreshToken>(async (resolve, reject) => {
        try {
            const res = await axios({
                method: 'get',
                url: 'http://localhost:3003/v1/api/auth/refresh',
                withCredentials: true,
            });
            const resData = res.data as TResponse<TRefreshToken>;
            resolve(resData.data);
        } catch (error) {
            const errT = error as AxiosError;
            if (!errT.response) {
                console.log(error);
                return reject('Something wrong with server !');
            }
            reject(errT.message);
        }
    });
};

export type TGetCurrentUser = {
    id: string;
    username: string;
};

export const handleGetCurrentUser = () => {
    return new Promise<TGetCurrentUser>(async (resolve, reject) => {
        try {
            const res = await axiosPrivate({
                method: 'get',
                url: 'http://localhost:3003/v1/api/auth/current',
            });
            resolve(res.data);
        } catch (error) {
            const errT = error as AxiosError;
            if (!errT.response) {
                console.log(error);
                return reject('Something wrong with server !');
            }
            reject(errT.message);
        }
    });
};
