import {hydrateRoot} from "react-dom/client"
import {BrowserRouter} from "react-router-dom"
import {App} from "./App";
import {Provider} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import "../dist/antd.min.css"

const data = window.__SSR_DATA__
delete window.__SSR_DATA__

const store = configureStore({
    preloadedState: data ?? {events: {}},
    devTools: true,
    reducer: (state, action) => {
        switch (action.type) {
            default:
                return state
        }

    }
})

hydrateRoot(
    document.getElementById("root") as HTMLElement,
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
)
