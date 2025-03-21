"use client";

import SynSelect, { components } from "react-select";
import dynamic from "next/dynamic";
import AsyncSelect from "react-select/async";
import { mdiCheck } from "@mdi/js";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

const CustomOption = ({ children, isSelected, isFocused, ...props }) => {
  return (
    <components.Option {...props}>
      <div
        className={`${isFocused && "bg-gray-100 active:bg-gray-200 dark:bg-gray-600 dark:active:bg-gray-700"} flex items-center justify-between rounded px-3 py-2 text-gray-500 hover:cursor-pointer dark:text-gray-400`}
      >
        <div className="flex flex-col">
          <span>{children}</span>
        </div>
        {isSelected && (
          <Icon path={mdiCheck} size={0.8} className="text-green-500" />
        )}
      </div>
    </components.Option>
  );
};

export default function Select({
  async = false,
  color = "gray",
  helperText,
  ...props
}) {
  let SelectComponent = async ? AsyncSelect : SynSelect;

  return (
    <div>
      <SelectComponent
        unstyled
        components={{ Option: CustomOption }}
        styles={{
          input: (base) => ({
            ...base,
            "input:focus": {
              boxShadow: "none",
            },
          }),
          multiValueLabel: (base) => ({
            ...base,
            whiteSpace: "normal",
            overflow: "visible",
          }),
          control: (base) => ({
            ...base,
            transition: "none",
          }),
          menu: (base) => ({
            ...base,
            maxHeight: "200px",
            overflowY: "auto",
          }),
        }}
        classNames={{
          control: ({ isFocused }) => {
            if (color === "failure") {
              return `border-red-500 bg-red-100 ${isFocused && "border-amber-600 ring-1 ring-amber-500"} border rounded-lg hover:cursor-pointer`;
            } else {
              return `border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-700 ${isFocused && "border-amber-600 ring-1 ring-amber-500"} border rounded-lg hover:cursor-pointer`;
            }
          },
          placeholder: () =>
            `${color === "failure" ? "text-red-500" : "text-gray-500"} pl-1 py-0.5`,
          input: () => "pl-1 py-0.5",
          valueContainer: () => "p-1 gap-1",
          singleValue: () => "leading-7 ml-1 text-gray-500 dark:text-gray-300",
          multiValue: () =>
            "bg-gray-100 rounded items-center py-0.5 pl-2 pr-1 gap-1.5",
          multiValueLabel: () => "leading-6 py-0.5",
          multiValueRemove: () =>
            "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md",
          indicatorsContainer: () => "p-1 gap-1",
          clearIndicator: () =>
            "text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800",
          indicatorSeparator: () => "bg-gray-300",
          dropdownIndicator: () =>
            "p-1 hover:bg-gray-100 text-gray-500 rounded-md hover:text-black",
          menu: () =>
            "p-1 mt-2 border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800 rounded-lg",
          groupHeading: () => "ml-3 mt-2 mb-1 text-gray-500 text-sm",
          noOptionsMessage: () =>
            "text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm",
        }}
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
