namespace NodeJS {
    interface ProcessEnv {
        TELEGRAM_BOT_ACCESS_TOKEN?: string;
        WEB_APP_URL?: string
        APP_PORT?: string
    }
}

export declare global {
    interface Window {
        __SSR_DATA__?: any
    }
}
