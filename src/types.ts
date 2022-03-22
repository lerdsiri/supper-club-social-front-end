import { store } from 'store';

//custom types
type Location = {
    city: string
    postCode: string
    country: string
};

export type User = {
    _id: string
    username: string
    email: string
    firstName: string
    lastName: string
    profilePic: string
    isAdmin: boolean
    isBanned: boolean
    location: Location
    eventsAsOrganizer: string[]
    eventsAsAttendee: string[]
    cart: string[]
    unreadConversations: string[]
};


//States and RootState
export type UserReducerState = {
    user: User
    isLoggedin: boolean
    token: string
}

export type RootState = ReturnType<typeof store.getState>;