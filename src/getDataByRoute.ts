import {routeMap} from "./routeMap";
import {IEventFull, IEventRaw} from "./types";
import {v4 as uuidv4} from "uuid";

//todo remove and use db
const events: Record<string, IEventFull> = {}

const getEventOrThrowError = (eventId: string) => {
    const event = events[eventId]

    if (!event) {
        throw `cannot find event with id: ${eventId}`
    }

    return event
}

const createFullEvent = (event: IEventRaw) => {

    const fullEvent: IEventFull = {...event, participants: [], id: uuidv4()}

    events[fullEvent.id] = fullEvent

    return fullEvent
}

const getDataByRoute = (route: string) => {
    switch (route) {
        case routeMap.wepAppEventsRoute:
            return {
                events
            }
        default:
            return {
                events: {}
            }
    }
}

export {getEventOrThrowError, createFullEvent, getDataByRoute}
