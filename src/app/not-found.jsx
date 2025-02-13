import { Button } from "flowbite-react";
import RootLayout from "./layout";
import StackTemplate from "@/components/templates/StackTemplate";

export const metadata = {
  title: "TaskCare | Not Found"
};

const customButtonTheme = {
  "color": {
    "amber": "border border-transparent bg-amber-500 text-white focus:ring-4 focus:ring-amber-300 enabled:hover:bg-amber-600 dark:focus:ring-amber-900"
  }
};

export default function NotFound() {
  return (
    <RootLayout>
      <StackTemplate>
        <div className="grow flex items-center justify-center px-4 py-12 relative isolate overflow-hidden">
          <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
              <div className="flex flex-col items-center max-w-screen-sm">
                <h1 className="text-center mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-amber-500 dark:text-amber-500">
                  404
                </h1>
                <p className="text-center mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                  Something's missing.
                </p>
                <p className="text-center mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                  Sorry, we can't find that page. You'll find lots to explore on the home page.
                </p>
                <Button
                  href="/"
                  theme={customButtonTheme}
                  color="amber"
                  className="w-fit"
                >
                  Back to Homepage
                </Button>
              </div>
            </div>
          </section>
        </div>
      </StackTemplate>
    </RootLayout>
  );
}
