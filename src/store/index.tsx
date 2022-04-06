import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';

import { userSlice } from 'store/userSlice';
import { eventSlice } from 'store/eventSlice';
import { conversationSlice } from 'store/conversationSlice';
import { RootState } from 'types';
import { userActions } from 'store/userSlice';

const key = "redux";

function saveToLocalStorage(state: RootState) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(key, serializedState);
    } catch(error) {
        console.log("Error saving to local storage", error);
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem(key);
        if (!serializedState) return undefined;
        return JSON.parse(serializedState);
    } catch(error) {
        console.log("Error loading from local storage", error);
    }
}

// middleware to remove token when expired
const removeExpiredToken = (store: any) => (next: any) => (action: any) => {
    const dispatch = useDispatch();
    const token = JSON.parse(useSelector((state: RootState) => state.user.token));
    const tokenExpiry = token && (jwt_decode(token) as any).exp
    if(token && tokenExpiry < Date.now() / 1000) {
        next(action);
        dispatch(userActions.clearUser());
    }
    next(action);
}

export const store = configureStore({
    devTools: true,
    reducer: {
        user: userSlice.reducer,
        event: eventSlice.reducer,
        conversation: conversationSlice.reducer,
    },
    //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(removeExpiredToken),
    preloadedState: loadFromLocalStorage()
});

store.subscribe(() => saveToLocalStorage(store.getState()));