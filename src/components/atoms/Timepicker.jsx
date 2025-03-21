import dynamic from "next/dynamic";
import { mdiClock } from "@mdi/js";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

export default function Timepicker({ color = "gray", helperText, ...props }) {
  return (
    <div className="relative w-fit">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon
          path={mdiClock}
          size={0.75}
          className="text-gray-500 dark:text-gray-400"
        />
      </div>
      <input
        type="time"
        className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm leading-none text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500 ${color === "failure" && "border-red-500 bg-red-100 text-red-500"}`}
        {...props}
      />
      {helperText && (
        <p
          className={`${color === "failure" ? "text-red-500" : "text-gray-500"} mt-1`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
