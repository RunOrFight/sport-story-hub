const next = require('next');
const express = require('express');
const nextConfig = require('../next.config');
const TelegramBot = require("node-telegram-bot-api");

const isDev = process.env.NODE_ENV !== 'production';
const app = next({dev: isDev, conf: nextConfig});
const handle = app.getRequestHandler();
const port = process.env.PORT || 3005;


(async () => {
    try {
        await app.prepare();
        // For Datadog or any integration requiring custom server setup
        const server = express();
        server.all('*', (req, res) => {
            return handle(req, res);
        });
        server.listen(port, (err) => {
            if (err) throw err;
            console.log(`> Ready on localhost: ${port} - env ${process.env.NODE_ENV}`)
        });

        const bot = new TelegramBot(process.env.TELEGRAM_BOT_ACCESS_TOKEN, {polling: true})
        console.log("Telegram Bot Instance Created")
        bot.on("message", (msg) => {
            bot.sendMessage(msg.chat.id, "Hello World")
        })
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
})();
