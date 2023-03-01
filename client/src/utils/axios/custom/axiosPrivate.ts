import { setValue } from '@/redux/auth.slice';
import { store } from '@/redux/store';
import refresh from '@/utils/helpers/refresh';
import axios, { AxiosError } from 'axios';

const axiosPrivate = axios.create({
    withCredentials: true,
});

axiosPrivate.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

axiosPrivate.interceptors.response.use(
    (response) => {
        return response;
    },
    async (err) => {
        const errT = err as AxiosError;
        const prevRequest = err.config;
        if (!errT.response) return Promise.reject(err);
        if (
            errT.response.status === 401 &&
            errT.response.statusText === 'Unauthorized' &&
            !prevRequest.send
        ) {
            try {
                await refresh();
                prevRequest.send = true;
                prevRequest.headers = { ...prevRequest.headers };
                return axiosPrivate(prevRequest);
            } catch (error) {
                store.dispatch(setValue({ forceLogout: true }));
                return Promise.reject(error);
            }
        }
        return Promise.reject(err);
    }
);

export default axiosPrivate;
