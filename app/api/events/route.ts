import {IEventFull} from "@/app/lib/types";
import {v4 as uuid} from "uuid"

//todo remove and use db
const events: Record<string, IEventFull> = {}

export async function GET(request: Request) {

    return Response.json(events)
}

export async function POST(request: Request) {
    const rawEvent = await request.json()

    const fullEvent: IEventFull = {
        ...rawEvent,
        participants: [],
        id: uuid()
    }

    events[fullEvent.id] = fullEvent

    return Response.json({status: 200})
}
