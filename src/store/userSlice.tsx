import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User, UserReducerState } from 'types';

const initialState: UserReducerState = {
    user: {
        _id: "",
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        profilePic: "",
        isAdmin: false,
        isBanned: false,
        location: {
            city: "",
            postCode: "",
            country: ""
        },
        eventsAsOrganizer: [],
        eventsAsAttendee: [],
        cart: [],
        unreadConversations: []
    },
    isLoggedin: false,
    token: ""
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUser(state: UserReducerState, action: PayloadAction<{user: User, token: string}>): void {
            state.user = action.payload.user
            state.isLoggedin = true
            state.token = action.payload.token
            console.log("user after login: ", state.user)
            console.log("isLoggedin after login: ", state.isLoggedin)
            console.log("token after login: ", state.token)
        },
        removeUser(state: UserReducerState): void {
            state.user = initialState.user
            state.isLoggedin = initialState.isLoggedin
            state.token = initialState.token
        }
    }
})

export const userActions = userSlice.actions;