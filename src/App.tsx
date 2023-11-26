import React from "react";
import {Route, Routes} from "react-router-dom";
import {routeMap} from "./routeMap";
import {EventsPage} from "./pages/EventsPage";
import {CreateEventPage} from "./pages/CreateEventPage";

const App = () => {
    return <div>
        <Routes>
            <Route index element={<div>{"Home"}</div>}/>
            <Route path={routeMap.wepAppEventsRoute} element={<EventsPage/>}/>
            <Route path={routeMap.webAppCreateEventRoute} element={<CreateEventPage/>}/>
        </Routes>
    </div>
}

export {App}
