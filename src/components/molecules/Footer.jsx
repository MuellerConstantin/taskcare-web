"use client";

import { useMemo } from "react";
import { Footer as FlowbiteFooter } from "flowbite-react";

const customFooterTheme = {
  root: {
    base: "w-full px-2 py-3 sm:px-4 bg-gray-50 dark:bg-gray-800 md:flex md:items-center md:justify-between",
  },
};

export default function Footer() {
  const navigation = useMemo(() => {
    return [
      { name: "About", path: "/about" },
      { name: "Privacy Policy", path: "/privacy-policy" },
      { name: "Imprint", path: "/imprint" },
    ];
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      <FlowbiteFooter theme={customFooterTheme}>
        <div className="w-full text-center">
          <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
            <FlowbiteFooter.Brand
              href="/"
              src="/images/logo.svg"
              alt="TaskCare Logo"
              name="TaskCare"
            />
            <FlowbiteFooter.LinkGroup>
              {navigation.map((item) => (
                <FlowbiteFooter.Link key={item.name} href={item.path}>
                  {item.name}
                </FlowbiteFooter.Link>
              ))}
            </FlowbiteFooter.LinkGroup>
          </div>
          <FlowbiteFooter.Divider />
          <FlowbiteFooter.Copyright
            href="https://github.com/MuellerConstantin"
            by="Constantin Müller"
            year={new Date().getFullYear()}
          />
        </div>
      </FlowbiteFooter>
    </div>
  );
}
