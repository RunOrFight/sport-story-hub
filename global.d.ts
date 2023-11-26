import {IEventFull} from "@/app/lib/types";
import {TelegramWebApps} from "telegram-webapps-types-new";
import TelegramBot from "node-telegram-bot-api";

export declare global {
    var telegramBotInstance: TelegramBot;
    var Telegram: TelegramWebApps


    //todo remove
    var events: Record<string, IEventFull>;

}
