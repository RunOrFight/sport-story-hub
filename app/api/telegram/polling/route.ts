import {createTelegramBotInstance} from "@/app/lib/bot";

export async function GET(req: Request) {
    
    const bot = createTelegramBotInstance()
    await bot.stopPolling()
    console.log("Poling Stopped")
    await bot.startPolling()
    console.log("Poling Started")

    return Response.json("ji")
}
