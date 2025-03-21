import React, { useMemo } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Menu as MenuIcon } from "lucide-react";
import { MenuTrigger } from "react-aria-components";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { Menu, MenuItem } from "@/components/molecules/Menu";

interface NavbarProps<T> {}

export function Navbar<T extends object>(props: NavbarProps<T>) {
  const navigation = useMemo(() => {
    return [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ];
  }, []);

  return (
    <nav className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-center p-4 md:justify-between md:space-x-10">
        <div className="absolute left-6 md:hidden">
          <MenuTrigger>
            <Button variant="icon">
              <MenuIcon className="h-6 w-6" />
            </Button>
            <Menu>
              {navigation.map((item) => (
                <MenuItem
                  key={item.name}
                  id={`nav-${item.name}`}
                  href={item.href}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Menu>
          </MenuTrigger>
        </div>
        <NextLink href="/">
          <div className="flex w-fit items-center justify-center md:space-x-4">
            <Image
              src="/images/logo.svg"
              width={32}
              height={32}
              className="h-6 sm:h-9"
              alt="TaskCare"
            />
            <span className="hidden self-center text-xl font-semibold whitespace-nowrap md:block dark:text-white">
              TaskCare
            </span>
          </div>
        </NextLink>
        <div className="hidden space-x-4 md:flex">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
