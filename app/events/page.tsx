'use client'

import {Card, Descriptions} from "antd";
import {useEffect, useState} from "react";
import {IEventFull} from "@/app/lib/types";

export default function Events() {
    const [events, setEvents] = useState<Record<string, IEventFull>>({})


    useEffect(() => {
        const fetchEvents = async () => {
            const res = await fetch("/api/events")
            const events = await res.json()
            setEvents(events)
        }

        fetchEvents()
    }, [])

    return <div>
        {Object.values(events).map((event) => <Card key={event.id} hoverable title={event.place} style={{width: 300}}>
            <Descriptions layout={"vertical"}>
                <Descriptions.Item label="Date">{event.date}</Descriptions.Item>
                <Descriptions.Item label="Price">{event.price}</Descriptions.Item>
                <Descriptions.Item
                    label="Participants">{`${event.participants.length}/${event.participantsCount}`}</Descriptions.Item>
            </Descriptions>
        </Card>)}
    </div>;
}
