import React from 'react';
import {IAppState} from "../types";
import {useSelector} from "react-redux";


const EventsPage = () => {
    const events = useSelector((state: IAppState) => state.events)

    return <div>
        <pre>{JSON.stringify(events, null, 2)}</pre>
    </div>;
};

export {EventsPage};
