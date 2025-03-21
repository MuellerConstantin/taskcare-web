import { Lato } from "next/font/google";
import { SWRConfig } from "swr";
import { StoreProvider } from "@/store";
import { ApiLogoutInterceptor } from "@/hooks/useApi";

import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "TaskCare",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
      </head>
      <body
        className={`${lato.variable} bg-white antialiased dark:bg-gray-900`}
      >
        <SWRConfig>
          <StoreProvider>
            <ApiLogoutInterceptor>{children}</ApiLogoutInterceptor>
          </StoreProvider>
        </SWRConfig>
      </body>
    </html>
  );
}
