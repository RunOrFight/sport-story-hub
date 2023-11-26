type TUnknownObject = Record<string, unknown>

type TAnyPromiseFunction = (...args: any[]) => Promise<any>

interface IWithId {
    id: string
}

interface IEventRaw {
    date: string;
    price: string;
    place: string;
    participantsCount: number
}

interface IEventFull extends IEventRaw, IWithId {
    participants: string[]
}

interface IAppState {
    events: Record<string, IEventFull>
}

export type {IEventRaw, IEventFull, TUnknownObject, TAnyPromiseFunction, IAppState}
