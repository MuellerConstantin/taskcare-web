"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button, Select, TextInput } from "flowbite-react";
import { mdiMagnify } from "@mdi/js";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

const customTextInputThemeMd = {
  field: {
    input: {
      colors: {
        gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500",
      },
      withAddon: {
        off: "rounded-lg rounded-l-none rounded-r-none",
      },
    },
  },
};

const customTextInputThemeSm = {
  field: {
    input: {
      colors: {
        gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500",
      },
      withAddon: {
        off: "rounded-lg rounded-r-none",
      },
    },
  },
};

const customButtonTheme = {
  color: {
    light:
      "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  },
  pill: {
    off: "rounded-lg rounded-l-none border-l-0",
  },
};

const customSelectThemeSm = {
  field: {
    select: {
      withAddon: {
        off: "rounded-lg",
      },
      colors: {
        gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500",
      },
    },
  },
};

const customSelectThemeMd = {
  field: {
    select: {
      withAddon: {
        off: "rounded-lg rounded-r-none border-r-0",
      },
      colors: {
        gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500",
      },
    },
  },
};

export default function SearchBar({ onSearch, properties }) {
  const [selectedProperty, setSelectedProperty] = useState("id");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="grow">
      <div className="block space-y-2 rounded border p-2 lg:hidden">
        <Select
          theme={customSelectThemeSm}
          sizing="sm"
          required
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
        >
          {properties instanceof Map
            ? Array.from(properties.entries()).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))
            : properties.map((property) => (
                <option key={property} value={property}>
                  {property}
                </option>
              ))}
        </Select>
        <div className="flex w-full">
          <TextInput
            theme={customTextInputThemeSm}
            sizing="sm"
            placeholder="Search"
            className="grow"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(selectedProperty, e.target.value);
            }}
          />
          <Button
            theme={customButtonTheme}
            color="light"
            size="xs"
            onClick={() => onSearch(selectedProperty, searchTerm)}
          >
            <div className="flex items-center justify-center">
              <Icon path={mdiMagnify} size={0.75} />
            </div>
          </Button>
        </div>
      </div>
      <div className="hidden lg:flex">
        <Select
          theme={customSelectThemeMd}
          sizing="sm"
          required
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
        >
          {properties instanceof Map
            ? Array.from(properties.entries()).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))
            : properties.map((property) => (
                <option key={property} value={property}>
                  {property}
                </option>
              ))}
        </Select>
        <TextInput
          theme={customTextInputThemeMd}
          sizing="sm"
          placeholder="Search"
          className="max-w-xs grow"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(selectedProperty, e.target.value);
          }}
        />
        <Button
          theme={customButtonTheme}
          color="light"
          size="xs"
          onClick={() => onSearch(selectedProperty, searchTerm)}
        >
          <div className="flex items-center justify-center">
            <Icon path={mdiMagnify} size={0.75} />
          </div>
        </Button>
      </div>
    </div>
  );
}
