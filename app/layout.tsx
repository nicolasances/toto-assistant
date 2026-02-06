'use client'

import "./fonts.css";
import "./globals.css";
import { HeaderProvider } from "@/context/HeaderContext";
import { AudioProvider } from "@/context/AudioContext";
import AppHeader from "@/components/AppHeader";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
        <meta name="theme-color" content="#00acc1" />
        <meta name="description" content="Toto Assistant" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <title>Toto Assistant</title>
      </head>
      <body
        style={{ fontFamily: "'Comfortaa', sans-serif" }}
        className="antialiased min-h-screen flex flex-row"
      >
        <div className="xl:w-[10vw] 2xl:w-[20vw] bg-black opacity-[0.3]">
        </div>
        <div className="w-full xl:w-[80vw] 2xl:w-[60vw] shadow-2xl xl:px-8 flex flex-col">
          <AudioProvider>
            <HeaderProvider>
              <AppHeader />
              {children}
            </HeaderProvider>
          </AudioProvider>
        </div>
        <div className="xl:w-[10vw] 2xl:w-[20vw] bg-black opacity-[0.3]">
        </div>
      </body>
    </html>
  );
}
