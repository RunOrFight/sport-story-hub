import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'
import StyledComponentsRegistry from "@/app/lib/AntdRegistry";
import {PropsWithChildren} from "react";
import "@/app/lib/bot"

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

//todo remove and use db
global.events = {}


export default function RootLayout({children,}: PropsWithChildren) {
    return (
        <html lang="en">

        <StyledComponentsRegistry>
            <body className={inter.className}>{children}</body>
        </StyledComponentsRegistry>
        </html>
    )
}
