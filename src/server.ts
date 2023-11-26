import fs from "fs"
import path from "path"
import express from "express"
import vite from "vite";
import chalk from "chalk";
import "./bot"
import {createFullEvent, getDataByRoute} from "./getDataByRoute";
import {configureStore} from "@reduxjs/toolkit";
import {routeMap} from "./routeMap";
import {render} from "./entryServer";


const initApp = async () => {
    const app = express()
    app.use(express.json())


    const devServer = await vite.createServer({
        server: {middlewareMode: true},
        appType: "custom",
    })
    app.use(devServer.middlewares)

    app.use(routeMap.apiCreateEventRoute, (req, res) => {
        createFullEvent(req.body)

        res.sendStatus(200)
    })

    app.use("/favicon.ico", (req, res) => {

        res.sendStatus(200)
    })

    app.use("*", async (req, res, next) => {
        const route = req.originalUrl

        try {
            const htmlFile = fs.readFileSync(path.resolve("./index.html"), "utf-8")

            const template = await devServer.transformIndexHtml(route, htmlFile)

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
                devServer.ssrFixStacktrace(error)
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
