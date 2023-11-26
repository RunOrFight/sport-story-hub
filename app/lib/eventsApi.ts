import {IEventFull, IEventRaw} from "./types";
import {v4 as uuidv4} from "uuid";

if (!global.events) {
    global.events = {}
}

const getEventOrThrowError = (eventId: string) => {

    const event = global.events[eventId]

    if (!event) {
        throw `cannot find event with id: ${eventId}`
    }

    return event
}

const createFullEvent = (event: IEventRaw) => {

    const fullEvent: IEventFull = {...event, participants: [], id: uuidv4()}

    global.events[fullEvent.id] = fullEvent
    
    return fullEvent
}


export {getEventOrThrowError, createFullEvent}
