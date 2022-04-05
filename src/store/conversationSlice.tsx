import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Conversation, ConversationReducerState } from "types";

const initialState: ConversationReducerState = {
    conversations: []
}

export const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        getConversations(state: ConversationReducerState, action: PayloadAction<{conversations: Conversation[]}>): void {
            state.conversations = action.payload.conversations;
        },
        addConversation(state: ConversationReducerState, action: PayloadAction<{conversation: Conversation}>): void {
            state.conversations.push(action.payload.conversation);
        },
        updateConversation(state: ConversationReducerState, action: PayloadAction<{conversation: Conversation}>): void {
            state.conversations.forEach((conversation) => {
                if(conversation._id.toString() === action.payload.conversation._id.toString()) {
                    conversation = action.payload.conversation
                }
                return null;
            })
        },
        clearConversations(state: ConversationReducerState): void {
            state.conversations = initialState.conversations;
        }
    }
})

export const conversationActions = conversationSlice.actions;