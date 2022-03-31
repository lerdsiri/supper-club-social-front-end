import { configureStore } from '@reduxjs/toolkit';

import { userSlice } from 'store/userSlice';
import { eventSlice } from 'store/eventSlice';
import { RootState } from 'types';

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

export const store = configureStore({
    devTools: true,
    reducer: {
        user: userSlice.reducer,
        event: eventSlice.reducer
    },
    preloadedState: loadFromLocalStorage()
});

store.subscribe(() => saveToLocalStorage(store.getState()));