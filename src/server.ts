import fs from "fs"
import path from "path"
import express from "express"
import {ViteDevServer} from "vite";
import chalk from "chalk";
import "./bot"
import {createFullEvent, getDataByRoute} from "./getDataByRoute";
import {configureStore} from "@reduxjs/toolkit";
import {routeMap} from "./routeMap";


const initApp = async () => {
    const app = express()
    app.use(express.json())

    let vite: ViteDevServer

    vite = await (await import("vite")).createServer({
        server: {middlewareMode: true},
        appType: "custom",
    })
    app.use(vite.middlewares)

    app.use(routeMap.apiCreateEventRoute, (req, res) => {
        createFullEvent(req.body)

        res.sendStatus(200)
    })

    app.use("*", async (req, res, next) => {
        const route = req.originalUrl

        try {
            const htmlFile = fs.readFileSync(path.resolve("./index.html"), "utf-8")

            const template = await vite.transformIndexHtml(route, htmlFile)

            const render = (await vite.ssrLoadModule("/src/entryServer.tsx")).render

            const data = getDataByRoute(route)

            const store = configureStore({reducer: state => state, preloadedState: data})

            const appHtml = await render({route, store})
            const dataString = `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`

            const html = template
                .replace(`<!--ssr-outlet-->`, appHtml)
                .replace(`<!--ssr-data-->`, dataString)

            res.status(200).set({"Content-Type": "text/html"}).end(html)
        } catch (error) {

            if (process.env.NODE_ENV === "development" && error instanceof Error) {
                vite.ssrFixStacktrace(error)
            }
            next(error)
        }
    })

    const expressAppPort = process.env.APP_PORT!

    app.listen(expressAppPort, () => {
        console.log(chalk.bgBlue("EXPRESS STARTED"), chalk.blue(`port -> "${expressAppPort}"`))
    })
}

initApp()
