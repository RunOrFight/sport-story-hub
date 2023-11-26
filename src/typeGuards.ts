import {IEventRaw, TUnknownObject} from "./types";

const isObject = (candidate: unknown): candidate is TUnknownObject => candidate !== null && typeof candidate === "object"

const isRawEvent = (maybeEvent: unknown): maybeEvent is IEventRaw => {
    return isObject(maybeEvent) &&
        "date" in maybeEvent && "price" in maybeEvent &&
        "place" in maybeEvent && "participantsCount" in maybeEvent
}

export {isRawEvent, isObject}
