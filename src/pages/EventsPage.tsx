import {IAppState} from "../types";
import {useSelector} from "react-redux";
import {Card, Descriptions} from "antd";


const EventsPage = () => {
    const events = useSelector((state: IAppState) => state.events)

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
};

export {EventsPage};
