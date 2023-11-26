import * as fs from "fs"
import * as path from "path"
import express from "express"
import chalk from "chalk";
import {createFullEvent, getDataByRoute} from "./getDataByRoute";
import redux from "@reduxjs/toolkit";
import {routeMap} from "./routeMap";
import {config} from "dotenv";
import {extractStyle} from '@ant-design/static-style-extract';
import serverless from "serverless-http";

config()

const style = extractStyle()

const app = express()
app.use(express.json())

let devServer: any;

if (process.env.APP_MODE === "DEV") {
    devServer = await (
        await import("vite")
    ).createServer({
        server: {middlewareMode: true},
        appType: "custom",
    })
    app.use(devServer.middlewares)
} else {
    app.use((await import("compression")).default())
    app.use(
        (await import("serve-static")).default(path.resolve("dist/client"), {
            index: false,
        }),
    )
}

app.use(routeMap.apiCreateEventRoute, (req, res) => {
    createFullEvent(req.body)

    res.sendStatus(200)
})

app.use("/favicon.ico", (_req, res) => {

    res.sendStatus(200)
})

app.use('/.netlify/functions/server/*', async (req, res, next) => {
    const route = req.originalUrl
    let template, render

    try {
        if (process.env.APP_MODE === "DEV") {
            template = fs.readFileSync(path.resolve("./index.html"), "utf-8")

            template = await devServer.transformIndexHtml(route, template)

            render = (await devServer.ssrLoadModule("src/entryServer.tsx")).render
        } else {
            template = fs.readFileSync(
                path.resolve("dist/client/index.html"),
                "utf-8"
            )
            // @ts-ignore
            render = (await import("../dist/server/entryServer.js")).render
        }

        const data = getDataByRoute(route)

        const store = redux.configureStore({reducer: state => state, preloadedState: data})

        const appHtml = await render({route, store})

        const dataString = `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`

        const styleString = `<style>${style}</style>`

        const html = template
            .replace(`<!--style-outlet-->`, styleString)
            .replace(`<!--ssr-outlet-->`, appHtml)
            .replace(`<!--ssr-data-->`, dataString)

        res.status(200).set({"Content-Type": "text/html"}).end(html)
    } catch (error) {

        if (process.env.APP_MODE === "DEV" && error instanceof Error) {
            devServer.ssrFixStacktrace(error)
        }
        next(error)
    }
})

const expressAppPort = process.env.APP_PORT!


if (process.env.APP_MODE === "DEV") {
    app.listen(expressAppPort, () => {
        console.log(chalk.bgBlue("EXPRESS STARTED"), chalk.blue(`port -> "${expressAppPort}"`))
    })
}

module.exports = app;
module.exports.handler = serverless(app);
