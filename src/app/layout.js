import { Lato } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";

import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "TaskCare | Home"
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
        <ThemeModeScript />
      </head>
      <body
        className={`${lato.variable} antialiased bg-white dark:bg-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
