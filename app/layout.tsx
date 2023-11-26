import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'
import StyledComponentsRegistry from "@/app/lib/AntdRegistry";
import "@/app/lib/bot"

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}


export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (

        <html lang="en">
        <StyledComponentsRegistry>
            <body className={inter.className}>{children}</body>
        </StyledComponentsRegistry>
        </html>
    )
}
