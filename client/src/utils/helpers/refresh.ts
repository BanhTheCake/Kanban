import { setValue } from '@/redux/auth.slice';
import { store } from '@/redux/store';
import { handleRefreshToken } from './../axios/auth.axios';
const refresh = async () => {
    try {
        const { token } = await handleRefreshToken();
        if (token) {
            store.dispatch(setValue({ token: token }));
        }
        return token;
    } catch (error) {
        throw error;
    }
};

export default refresh;
