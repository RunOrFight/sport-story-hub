import {registerBotEventHandler} from "./app/lib/logger";
import {tKeysMap} from "./app/lib/tKeysMap";
import {isRawEvent} from "./app/lib/typeGuards";
import {createFullEvent, getEventOrThrowError} from "./app/lib/eventsApi";
import {createEventMessage} from "./app/lib/createEventMessage";

export async function register() {
    const TelegramBot = (await import("node-telegram-bot-api")).default
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_ACCESS_TOKEN, {polling: true});

    if (bot) {
        bot.on(...registerBotEventHandler('message', async (msg) => {
            const chatId = msg.chat.id;


            await bot.sendMessage(chatId, tKeysMap.useButtonsHint, {
                reply_markup: {
                    keyboard: [
                        [{text: "Create Event", web_app: {url: `${process.env.WEB_APP_URL}/events/create`},}]
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
                throw `parsedData from ${dataString} doesn't match to IEventRaw interface`
            }

            //todo write to db
            const fullEvent = createFullEvent(parsedData)

            await bot.sendMessage(msg.chat.id, createEventMessage(fullEvent), {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [{switch_inline_query: fullEvent.id, text: tKeysMap.botMessageShare}]
                    ]
                }
            })
        }))

        const createQueryReplyMarkup = (eventId) => ({
            inline_keyboard: [
                [
                    {text: tKeysMap.eventMessageJoin, callback_data: `join_${eventId}`},
                    {
                        text: tKeysMap.eventMessageLeave, callback_data: `leave_${eventId}`
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
                event.participants = event.participants.filter((it) => it !== msg.from.username)

            }

            await bot.editMessageText(createEventMessage(event), {
                parse_mode: "HTML",
                inline_message_id: msg.inline_message_id,
                reply_markup: createQueryReplyMarkup(eventId),
            })
        }))

        console.log("Telegram Bot Instance Created")
    }
}
