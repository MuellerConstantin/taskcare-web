"use client";

import React, { useMemo } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Menu as MenuIcon, EllipsisVertical, LogOut } from "lucide-react";
import { MenuTrigger } from "react-aria-components";
import useSWR from "swr";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { Switch } from "@/components/atoms/Switch";
import { Menu, MenuItem } from "@/components/molecules/Menu";
import { Popover } from "@/components/atoms/Popover";
import { Avatar } from "@/components/atoms/Avatar";
import { ListBox, ListBoxItem } from "@/components/atoms/ListBox";
import { useAppSelector, useAppDispatch } from "@/store";
import themeSlice from "@/store/slices/theme";
import useApi from "@/hooks/useApi";

interface NavbarProps {}

export function Navbar(props: NavbarProps) {
  const navigation = useMemo(() => {
    return [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ];
  }, []);

  return (
    <nav className="relative border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="flex items-center justify-between space-x-10 p-4">
        <div className="md:hidden">
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
            <span className="hidden self-center text-xl font-semibold whitespace-nowrap text-slate-700 md:block dark:text-white">
              TaskCare
            </span>
          </div>
        </NextLink>
        <div className="flex items-center space-x-4">
          <div className="hidden space-x-4 md:flex">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </div>
          <div className="self-end">
            <NavbarOptionsMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

interface NavbarUnauthenticatedOptionsMenuProps {}

function NavbarUnauthenticatedOptionsMenu(
  props: NavbarUnauthenticatedOptionsMenuProps,
) {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  return (
    <Popover className="entering:animate-in entering:fade-in entering:placement-bottom:slide-in-from-top-1 entering:placement-top:slide-in-from-bottom-1 exiting:animate-out exiting:fade-out exiting:placement-bottom:slide-out-to-top-1 exiting:placement-top:slide-out-to-bottom-1 fill-mode-forwards origin-top-left overflow-auto rounded-lg bg-white p-2 shadow-lg ring-1 ring-black/10 outline-hidden dark:bg-slate-950 dark:ring-white/15">
      <Switch
        isSelected={darkMode}
        onChange={(newDarkMode) =>
          dispatch(themeSlice.actions.setDarkMode(newDarkMode))
        }
      >
        Dark Mode
      </Switch>
    </Popover>
  );
}

interface NavbarAuthenticatedOptionsMenuProps {}

function NavbarAuthenticatedOptionsMenu(
  props: NavbarAuthenticatedOptionsMenuProps,
) {
  const api = useApi();
  const dispatch = useAppDispatch();

  const darkMode = useAppSelector((state) => state.theme.darkMode);

  const { data, isLoading, error } = useSWR(
    "/user/me",
    (url) => api.get(url).then((res) => res.data),
    {
      keepPreviousData: true,
    },
  );

  return (
    <Popover className="entering:animate-in entering:fade-in entering:placement-bottom:slide-in-from-top-1 entering:placement-top:slide-in-from-bottom-1 exiting:animate-out exiting:fade-out exiting:placement-bottom:slide-out-to-top-1 exiting:placement-top:slide-out-to-bottom-1 fill-mode-forwards origin-top-left overflow-auto rounded-lg bg-white p-2 shadow-lg ring-1 ring-black/10 outline-hidden dark:bg-zinc-950 dark:ring-white/15">
      <div className="flex w-[15rem] flex-col gap-4 overflow-hidden p-2">
        <div className="flex gap-4 overflow-hidden">
          <NavbarAvatar size="md" />
          <div className="flex flex-col gap-2 overflow-hidden">
            <div className="flex flex-col gap-1">
              {isLoading ? (
                <div className="h-3 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              ) : error ? (
                <div className="h-3 w-full rounded-full bg-red-300 dark:bg-red-800" />
              ) : (
                <div className="truncate text-[1rem] font-bold text-slate-900 dark:text-slate-100">
                  {data.displayName || data.username}
                </div>
              )}
              {isLoading ? (
                <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              ) : error ? (
                <div className="h-2.5 w-1/2 rounded-full bg-red-300 dark:bg-red-800" />
              ) : (
                <div className="mb-1 truncate text-sm text-slate-900 dark:text-slate-100">
                  {data.displayName && data.username}
                </div>
              )}
            </div>
            <Switch
              isSelected={darkMode}
              onChange={(newDarkMode) =>
                dispatch(themeSlice.actions.setDarkMode(newDarkMode))
              }
            >
              Dark Mode
            </Switch>
          </div>
        </div>
        <ListBox>
          <ListBoxItem href="/login?logout=true">
            <div className="flex w-full items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </div>
          </ListBoxItem>
        </ListBox>
      </div>
    </Popover>
  );
}

interface NavbarAvatarProps {
  size?: "xs" | "sm" | "md" | "lg";
}

function NavbarAvatar(props: NavbarAvatarProps) {
  const api = useApi();

  const { data: userData } = useSWR(
    "/user/me",
    (url) => api.get(url).then((res) => res.data),
    {
      keepPreviousData: true,
    },
  );

  const {
    data: imageData,
    error: imageError,
    isLoading: imageIsLoading,
  } = useSWR(
    "/user/me/profile-image",
    (url) =>
      api
        .get(url, { responseType: "arraybuffer" })
        .then((res) =>
          URL.createObjectURL(
            new Blob([res.data], { type: res.headers["content-type"] }),
          ),
        ),
    { keepPreviousData: true },
  );

  const isMissing = useMemo(
    () => !!imageError && imageError.status === 404,
    [imageError],
  );

  const isInitialLoading = useMemo(
    () => imageIsLoading && !imageData && !isMissing,
    [imageIsLoading, imageData, isMissing],
  );

  const isRefreshLoading = useMemo(
    () => imageIsLoading && (!!imageData || isMissing),
    [imageIsLoading, imageData, isMissing],
  );

  const hasErrored = useMemo(
    () => !imageIsLoading && !!imageError && !isMissing,
    [imageIsLoading, imageError, isMissing],
  );

  return (
    <div className="relative flex h-fit items-center">
      <Avatar
        size="sm"
        alt={userData?.displayName || userData?.username || ""}
        src={imageData}
        {...props}
      />
      {isInitialLoading || isRefreshLoading ? (
        <div className="absolute inset-0 h-full w-full animate-pulse rounded-full bg-slate-400/50 dark:bg-slate-700/50" />
      ) : hasErrored ? (
        <div className="absolute inset-0 rounded-full bg-red-400/50 dark:bg-red-700/50" />
      ) : null}
    </div>
  );
}

interface NavbarOptionsMenuProps {}

export function NavbarOptionsMenu(props: NavbarOptionsMenuProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <MenuTrigger>
      <Button variant="icon">
        {isAuthenticated ? (
          <NavbarAvatar />
        ) : (
          <EllipsisVertical className="h-6 w-6" />
        )}
      </Button>
      {isAuthenticated ? (
        <NavbarAuthenticatedOptionsMenu />
      ) : (
        <NavbarUnauthenticatedOptionsMenu />
      )}
    </MenuTrigger>
  );
}
