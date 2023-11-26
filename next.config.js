const TelegramBot = require("node-telegram-bot-api");

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        instrumentationHook: true
    }
}

module.exports = nextConfig
