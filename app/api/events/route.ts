import {IEventFull} from "@/app/lib/types";
import {createFullEvent} from "@/app/lib/eventsApi";

//todo remove and use db
const events: Record<string, IEventFull> = {
    "123": {
        id: "123",
        participants: [],
        date: "Today",
        participantsCount: 10,
        price: "5 BYN",
        place: "BOX  365"
    }
}

export async function GET(request: Request) {

    return Response.json(events)
}

export async function POST(request: Request) {
    const rawEvent = await request.json()

    const fullEvent = createFullEvent(rawEvent)

    events[fullEvent.id] = fullEvent

    return Response.json({status: 200})
}
