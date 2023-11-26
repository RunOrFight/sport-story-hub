import {TAnyPromiseFunction} from "./types";
import {TelegramEvents} from "node-telegram-bot-api";
import chalk from "chalk";

enum EErrorTypes {
    tgBotEventHandler = "TG_BOT_EVENT_HANDLER_ERROR"
}

const Logger = {
    error: (type: EErrorTypes, entity: string, err: any) => {
        console.log(chalk.bgRed(type), chalk.red(`${entity} -> ${JSON.stringify(err)}`))
    }
}

const withLogger = (clb: TAnyPromiseFunction, name: string) => (...args: any[]) => {
    clb(...args).catch((err) => {
        Logger.error(EErrorTypes.tgBotEventHandler, `bot.on("${name}")`, err)
        return
    })
}


const registerBotEventHandler = <E extends keyof TelegramEvents>(event: E, clb: TelegramEvents[E]) => [event, withLogger(clb, event)] as const

export {registerBotEventHandler}
