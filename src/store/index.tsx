import { configureStore } from '@reduxjs/toolkit';

import { userSlice } from 'store/userSlice';
import { RootState } from 'types';

export const store = configureStore({
    devTools: true,
    reducer: {
        user: userSlice.reducer,
    },
    
});

