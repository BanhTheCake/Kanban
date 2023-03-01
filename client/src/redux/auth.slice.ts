import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AuthSlice {
    token: string;
    user: {
        id: string;
        username: string;
    };
    forceLogout: boolean;
}

const initialState: AuthSlice = {
    token: '',
    user: {
        id: '',
        username: '',
    },
    forceLogout: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setValue: (state, action: PayloadAction<Partial<AuthSlice>>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setValue } = authSlice.actions;

export default authSlice.reducer;
