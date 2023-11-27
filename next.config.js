const TelegramBot = require("node-telegram-bot-api");
const {PHASE_DEVELOPMENT_SERVER} = require("next/constants");

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = () => {
    return {

        compiler: {
            removeConsole: false,
        },
    }
}
