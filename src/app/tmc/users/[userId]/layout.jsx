import { Button } from "flowbite-react";
import Icon from "@mdi/react";
import { mdiChevronLeft } from "@mdi/js";

const customButtonTheme = {
  base: "",
  size: {
    xs: "px-2 py-1 text-xs",
  },
  color: {
    light:
      "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  },
};

export const metadata = {
  title: "TaskCare | TMC - User",
};

export default function TmcUserLayout({ children }) {
  return (
    <div className="h-full">
      <div className="flex items-center space-x-4">
        <Button
          theme={customButtonTheme}
          size="xs"
          color="light"
          href="/tmc/users"
        >
          <div className="flex items-center space-x-2">
            <Icon path={mdiChevronLeft} size={0.75} />
            <span>Back</span>
          </div>
        </Button>
        <h1 className="text-xl font-semibold">User Info</h1>
      </div>
      <hr className="my-4" />
      <div className="h-full">{children}</div>
    </div>
  );
}
