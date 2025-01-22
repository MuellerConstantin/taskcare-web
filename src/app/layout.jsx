import { Lato } from "next/font/google";
import { Flowbite } from "flowbite-react";
import { StoreProvider } from "@/store";

import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "TaskCare"
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
      </head>
      <body
        className={`${lato.variable} antialiased bg-white dark:bg-gray-900`}
      >
        <Flowbite>
          <StoreProvider>
            {children}
          </StoreProvider>
        </Flowbite>
      </body>
    </html>
  );
}
