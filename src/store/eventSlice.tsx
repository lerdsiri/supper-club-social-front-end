import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Event, EventReducerState } from "types";

const initialState: EventReducerState = {
    events: [],
    eventsByCity: [],
};

export const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        getEvents(state: EventReducerState, action: PayloadAction<{events: Event[]}>): void {
            state.events = action.payload.events;
        },
        addEvent(state: EventReducerState, action: PayloadAction<{event: Event}>): void {
            state.events.push(action.payload.event);
        },
        filterEventsByCity(state: EventReducerState, action: PayloadAction<{searchTerm: string}>): void {
            state.eventsByCity = state.events.filter((oneEvent) => {
                return (oneEvent.eventLoc.city.toLowerCase().search(action.payload.searchTerm.toLowerCase()) !== -1)
            })
        },
        getEventsByCity(state: EventReducerState, action: PayloadAction<{events: Event[]}>): void {
            state.eventsByCity = action.payload.events;
        },
        clearEvents(state: EventReducerState): void {
            state.events = initialState.events;
            state.eventsByCity = initialState.eventsByCity;
        }
    }
})

export const eventActions = eventSlice.actions;