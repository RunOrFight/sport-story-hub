import {hydrateRoot} from "react-dom/client"
import {BrowserRouter} from "react-router-dom"
import React from "react";
import {App} from "./App";
import {Provider} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";

const data = window.__SSR_DATA__
delete window.__SSR_DATA__

const store = configureStore({
    preloadedState: data,
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
