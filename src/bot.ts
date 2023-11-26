import TelegramBot from "node-telegram-bot-api";
import {isRawEvent} from "./typeGuards";
import {TKeysMap} from "./tKeysMap";
import {createEventMessage} from "./createEventMessage";
import {registerBotEventHandler} from "./logger";
import dotenv from "dotenv";
import {createFullEvent, getEventOrThrowError} from "./getDataByRoute";

dotenv.config()

const bot = new TelegramBot(process.env.TELEGRAM_BOT_ACCESS_TOKEN!, {polling: true});


bot.on(...registerBotEventHandler('message', async (msg) => {
    const chatId = msg.chat.id;


    await bot.sendMessage(chatId, TKeysMap.useButtonsHint, {
        reply_markup: {
            keyboard: [
                [{text: TKeysMap.webAppButton, web_app: {url: process.env.WEB_APP_URL!}}]
            ],
            inline_keyboard: [
                [{text: "Hi", web_app: {url: process.env.WEB_APP_URL!},}]
            ]
        }
    })


}));

bot.on(...registerBotEventHandler("web_app_data", async (msg) => {
    const dataString = msg.web_app_data?.data

    if (!dataString) {
        throw "dataString is not received"
    }

    const parsedData = JSON.parse(dataString)
    if (!isRawEvent(parsedData)) {
        throw `parsedData from ${dataString} doesn't match to IEvent interface`
    }

    //todo write to db
    const fullEvent = createFullEvent(parsedData)

    await bot.sendMessage(msg.chat.id, createEventMessage(fullEvent), {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [{switch_inline_query: fullEvent.id, text: TKeysMap.botMessageShare}]
            ]
        }
    })
}))

const createQueryReplyMarkup = (eventId: string) => ({
    inline_keyboard: [
        [
            {text: TKeysMap.eventMessageJoin, callback_data: `join_${eventId}`},
            {
                text: TKeysMap.eventMessageLeave, callback_data: `leave_${eventId}`
            }]
    ]
})

bot.on(...registerBotEventHandler("inline_query", async (msg) => {
    const eventId = msg.query

    //todo read from db
    const event = getEventOrThrowError(eventId)

    await bot.answerInlineQuery(msg.id, [{
        title: "Event", id: event.id,
        type: "article",
        input_message_content: {
            parse_mode: "HTML",
            message_text: createEventMessage(event)
        },
        reply_markup: createQueryReplyMarkup(event.id)

    }])
}))

bot.on(...registerBotEventHandler("callback_query", async (msg) => {
    if (!msg.from.username) {
        throw "message without username received"
    }

    const eventId = msg.data?.split("_")[1] ?? ""

    //todo read from db
    const event = getEventOrThrowError(eventId)

    if (msg.data?.startsWith("join")) {
        if (event.participants.includes(msg.from.username)) {
            throw `username: ${msg.from.username} already in participants`
        }
        event.participants.push(msg.from.username)

    } else if (msg.data?.startsWith("leave")) {
        if (!(event.participants.includes(msg.from.username))) {
            throw `username: ${msg.from.username} not in participants`
        }
        event.participants = event.participants.filter((it: string) => it !== msg.from.username)

    }

    await bot.editMessageText(createEventMessage(event), {
        parse_mode: "HTML",
        inline_message_id: msg.inline_message_id,
        reply_markup: createQueryReplyMarkup(eventId),
    })
}))
