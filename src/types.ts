import { store } from 'store';

//User and UserReducerState
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

export type UserReducerState = {
    user: User
    isLoggedin: boolean
    token: string
}

//Event and EventReducerState
type EventLocDocument = {
    address: string
    city: string
    postCode: string
    country: string
};

export type Review = {
    reviewer: string
    content: string
    score: number
};

export type Event = {
    _id: string
    eventName: string
    eventDateTime: Date
    status: 'ongoing' | 'cancelled' | 'over'
    eventLoc: EventLocDocument
    mainPic: string
    cuisine: string
    description: string
    responseDateline: Date
    contributionAmt: number
    contributionCurrency: string
    numOfAttendeesAllowed: number
    reviews: Review[]
};

export type EventReducerState = {
    events: Event[]
    eventsByCity: Event[]
};


// Conversation and ConversationReducerState
type Author = {
    _id: string
    username: string
    profilePic: string
}

export type Message = {
    _id: string
    author: Author
    content: string
    messageDateTime: Date
}
  
export type Conversation = {
    _id: string
    event: string
    messages: Message[]
}

export type ConversationReducerState = {
    conversations: Conversation[]
}

// RootState
export type RootState = ReturnType<typeof store.getState>;