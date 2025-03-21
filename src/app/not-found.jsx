import { Button } from "flowbite-react";
import RootLayout from "./layout";
import StackTemplate from "@/components/templates/StackTemplate";

export const metadata = {
  title: "TaskCare | Not Found",
};

const customButtonTheme = {
  color: {
    amber:
      "border border-transparent bg-amber-500 text-white focus:ring-4 focus:ring-amber-300 enabled:hover:bg-amber-600 dark:focus:ring-amber-900",
  },
};

export default function NotFound() {
  return (
    <RootLayout>
      <StackTemplate>
        <div className="relative isolate flex grow items-center justify-center overflow-hidden px-4 py-12">
          <section className="bg-white dark:bg-gray-900">
            <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
              <div className="flex max-w-screen-sm flex-col items-center">
                <h1 className="mb-4 text-center text-7xl font-extrabold tracking-tight text-amber-500 dark:text-amber-500 lg:text-9xl">
                  404
                </h1>
                <p className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
                  Something's missing.
                </p>
                <p className="mb-4 text-center text-lg font-light text-gray-500 dark:text-gray-400">
                  Sorry, we can't find that page. You'll find lots to explore on
                  the home page.
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
