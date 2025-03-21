import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { StoreProvider } from "@/store";

import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskCare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
      </head>
      <body className={`${lato.variable} bg-white dark:bg-slate-800`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
