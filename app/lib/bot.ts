import TelegramBot from "node-telegram-bot-api";
import {registerBotEventHandler} from "@/app/lib/logger";
import {tKeysMap} from "@/app/lib/tKeysMap";
import {isRawEvent} from "@/app/lib/typeGuards";
import {createFullEvent, getEventOrThrowError} from "@/app/lib/eventsApi";
import {createEventMessage} from "@/app/lib/createEventMessage";
import {PHASE_PRODUCTION_BUILD} from "next/constants";


let telegramBotInstance: TelegramBot = null!

const createTelegramBotInstance = () => {
    if (telegramBotInstance || globalThis.telegramBotInstance) {
        return telegramBotInstance ?? globalThis.telegramBotInstance
    }

    telegramBotInstance = new TelegramBot(process.env.TELEGRAM_BOT_ACCESS_TOKEN!, {polling: true})
    globalThis.telegramBotInstance = telegramBotInstance
    console.log("Telegram Bot Instance Created")

    telegramBotInstance.on(...registerBotEventHandler('message', async (msg) => {
        const chatId = msg.chat.id;

        await telegramBotInstance.sendMessage(chatId, tKeysMap.useButtonsHint, {
            reply_markup: {
                keyboard: [
                    [{text: "Create Event", web_app: {url: `${process.env.WEB_APP_URL}/events/create`},}]
                ]
            }
        })


    }));

    telegramBotInstance.on(...registerBotEventHandler("web_app_data", async (msg) => {
        const dataString = msg.web_app_data?.data

        if (!dataString) {
            throw "dataString is not received"
        }

        const parsedData = JSON.parse(dataString)
        if (!isRawEvent(parsedData)) {
            throw `parsedData from ${dataString} doesn't match to IEventRaw interface`
        }

        //todo write to db
        const fullEvent = createFullEvent(parsedData)

        await telegramBotInstance.sendMessage(msg.chat.id, createEventMessage(fullEvent), {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{switch_inline_query: fullEvent.id, text: tKeysMap.botMessageShare}]
                ]
            }
        })
    }))

    const createQueryReplyMarkup = (eventId: string) => ({
        inline_keyboard: [
            [
                {text: tKeysMap.eventMessageJoin, callback_data: `join_${eventId}`},
                {
                    text: tKeysMap.eventMessageLeave, callback_data: `leave_${eventId}`
                }]
        ]
    })

    telegramBotInstance.on(...registerBotEventHandler("inline_query", async (msg) => {
        const eventId = msg.query

        //todo read from db
        const event = getEventOrThrowError(eventId)

        await telegramBotInstance.answerInlineQuery(msg.id, [{
            title: "Event", id: event.id,
            type: "article",
            input_message_content: {
                parse_mode: "HTML",
                message_text: createEventMessage(event)
            },
            reply_markup: createQueryReplyMarkup(event.id)

        }])
    }))

    telegramBotInstance.on(...registerBotEventHandler("callback_query", async (msg) => {
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
            event.participants = event.participants.filter((it) => it !== msg.from.username)

        }

        await telegramBotInstance.editMessageText(createEventMessage(event), {
            parse_mode: "HTML",
            inline_message_id: msg.inline_message_id,
            reply_markup: createQueryReplyMarkup(eventId),
        })
    }))

    return telegramBotInstance
}

if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
    createTelegramBotInstance()
}
