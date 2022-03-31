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
            state.user = action.payload.user;
            state.isLoggedin = true;
            state.token = action.payload.token;
            /*
            console.log("user after login: ", state.user)
            console.log("isLoggedin after login: ", state.isLoggedin)
            console.log("token after login: ", state.token)
            */
        },
        updateUser(state: UserReducerState, action: PayloadAction<{updatedUser: User}>): void {
            console.log("now updating user in redux store...")
            console.log("payload.updatedUser: ", action.payload.updatedUser)
            state.user = action.payload.updatedUser;
            console.log("state.user after update: ", state.user);
        },
        clearUser(state: UserReducerState): void {
            state.user = initialState.user;
            state.isLoggedin = initialState.isLoggedin;
            state.token = initialState.token;
        },
        addToCart(state: UserReducerState, action: PayloadAction<{eventId: string}>): void {
            state.user.cart.push(action.payload.eventId);
        },
        addToEventsAsOrganizer(state: UserReducerState, action: PayloadAction<{eventId: string}>): void {
            state.user.eventsAsOrganizer.push(action.payload.eventId);
        },
        addToEventsAsAttendee(state: UserReducerState, action: PayloadAction<{eventId: string}>): void {
            state.user.eventsAsAttendee.push(action.payload.eventId);
        }
    }
})

export const userActions = userSlice.actions;