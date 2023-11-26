import {renderToString} from "react-dom/server"
import {StaticRouter} from "react-router-dom/server"
import {App} from "./App"
import {Provider} from "react-redux";
import {Store} from "@reduxjs/toolkit";
import {IAppState} from "./types";

interface Props {
    route: string
    store: Store<IAppState>
}

const render = ({route, store}: Props) => {

    return renderToString(
        <Provider store={store}>
            <StaticRouter location={route}>
                <App/>
            </StaticRouter>
        </Provider>
    )
}

export {render}
