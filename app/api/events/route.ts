import {createFullEvent} from "@/app/lib/eventsApi";
import {IEventFull} from "@/app/lib/types";

//todo remove and use db
const events: Record<string, IEventFull> = {}

export async function GET(request: Request) {

    return Response.json(events)
}

export async function POST(request: Request) {
    const rawEvent = await request.json()

    const fullEvent = createFullEvent(rawEvent)

    events[fullEvent.id] = fullEvent

    return Response.json({status: 200})
}
