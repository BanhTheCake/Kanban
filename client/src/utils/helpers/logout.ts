import { setValue } from '@/redux/auth.slice';
import { store } from './../../redux/store';
import { handleLogout } from '../axios/auth.axios';

const logout = async (callback?: Function) => {
    try {
        const id = store.getState().auth.user.id;
        store.dispatch(setValue({ token: '' }));
        id && (await handleLogout(id));
        callback && callback();
    } catch (error) {
        throw error;
    }
};

export default logout;
