import {createFullEvent} from "@/app/lib/eventsApi";

//todo  use db

export async function GET(request: Request) {

    return Response.json(global.events)
}

export async function POST(request: Request) {
    const rawEvent = await request.json()

    const fullEvent = createFullEvent(rawEvent)

    global.events[fullEvent.id] = fullEvent

    return Response.json({status: 200})
}
