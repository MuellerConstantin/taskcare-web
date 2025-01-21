"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Navbar as FlowbiteNavbar, useThemeMode } from "flowbite-react";
import { mdiMenu, mdiThemeLightDark } from "@mdi/js";

const Icon = dynamic(() => import("@mdi/react").then(module => module.Icon), { ssr: false });

const customNavbarTheme = {
  "root": {
    "base": "bg-gray-50 px-2 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-4",
  },
  "link": {
    "base": "block py-2 pl-3 pr-4 md:p-0 text-md font-medium",
    "active": {
      "on": "bg-amber-500 text-white dark:text-white md:bg-transparent md:text-amber-500 font-semibold",
      "off": "border-b border-gray-100 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-amber-500 md:dark:hover:bg-transparent md:dark:hover:text-white"
    }
  },
  "toggle": {
    "base": "inline-flex items-center rounded-lg p-0 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 md:hidden",
  }
}

export default function Navbar({ currentPath }) {
  const {toggleMode} = useThemeMode();

  const navigation = useMemo(() => {
    return [
      { name: "Home", path: "/", isCurrent: currentPath === "/" },
      { name: "About", path: "/about", isCurrent: currentPath === "/about" },
    ];
  }, [currentPath]);

  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      <FlowbiteNavbar theme={customNavbarTheme} fluid rounded className="max-w-screen-2xl mx-auto">
        <FlowbiteNavbar.Toggle
          barIcon={() => (
            <Icon path={mdiMenu}
              title="Menu Toggle"
              size={1}
            />
          )}
        />
        <FlowbiteNavbar.Brand as={Link} href="/">
          <Image
            src="/images/logo.svg"
            width={32}
            height={32}
            className="mr-3 h-6 sm:h-9"
            alt="TaskCare Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">TaskCare</span>
        </FlowbiteNavbar.Brand>
        <div className="flex md:order-2 space-x-4">
          <button
            className="inline-flex items-center rounded-lg p-0 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
            onClick={toggleMode}
          >
            <Icon path={mdiThemeLightDark}
              title="Theme Toggle"
              size={1}
            />
          </button>
        </div>
        <FlowbiteNavbar.Collapse>
          {navigation.map((item) => (
            <FlowbiteNavbar.Link
              key={item.name}
              as={Link}
              href={item.path}
              active={item.isCurrent}
            >
              {item.name}
            </FlowbiteNavbar.Link>
          ))}
        </FlowbiteNavbar.Collapse>
      </FlowbiteNavbar>
    </div>
  );
}
