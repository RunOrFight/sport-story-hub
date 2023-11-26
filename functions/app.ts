import serverless from "serverless-http"
import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/.netlify/functions/hello", (_req, res) => {
    res.status(200).set({"Content-Type": "text/html"}).end("<div>Hello World</div>")
})

exports.handler = serverless(app)
