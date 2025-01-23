"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Navbar as FlowbiteNavbar, Dropdown, Avatar } from "flowbite-react";
import { mdiMenu, mdiDotsVertical, mdiApplicationCog, mdiLogout } from "@mdi/js";
import authSlice from "@/store/slices/auth";
import ToggleSwitch from "@/components/atoms/ToggleSwitch";
import useTheme from "@/hooks/useTheme";
import useApi from "@/hooks/useApi";

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

function NavbarAvatar({principalName, ...props}) {
  const api = useApi();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [, setError] = useState(null);

  const fetchProfileImage = useCallback(async () => {
    setLoading(true);
    setError(null);

    api.get("/user/me/profile-image", {responseType: "arraybuffer"})
    .then((res) => {
      setData(URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] })));
    })
    .catch((err) => {
      setError("An unexpected error occurred, please retry!");
    })
    .finally(() => {
      setLoading(false);
    });
  }, [api]);

  useEffect(() => {
    fetchProfileImage();
  }, [fetchProfileImage]);

  if(loading) {
    return (
      <div className="animate-pulse">
        <Avatar size="sm" rounded />
      </div>
    );
  } else {
    if (data) {
      return (
        <Avatar
          size="sm"
          className="bg-gray-200 dark:bg-gray-900 rounded-full"
          rounded
          img={({className, ...props}) => (
            <Image
              src={data}
              alt={principalName}
              width={64}
              height={64}
              className={`${className} object-cover`}
              {...props}
            />
          )}
        />
      )
    } else {
      return (
        <Avatar size="sm" placeholderInitials={principalName.slice(0, 2).toUpperCase()} rounded />
      );
    }
  }
}

function NavbarMenu() {
  const api = useApi();
  const dispatch = useDispatch();
  const router = useRouter();
  const {darkMode, toggleTheme} = useTheme();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const principalName = useSelector((state) => state.auth.principalName);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const logout = useCallback(async () => {
    dispatch(authSlice.actions.clearAuthentication());
    router.push("/login");
  }, [api]);

  const fetchPrincipal = useCallback(async () => {
    setLoading(true);
    setError(null);

    api.get("/user/me")
    .then((res) => {
      setData(res.data);
    })
    .catch((err) => {
      setError("An unexpected error occurred, please retry!");
    })
    .finally(() => {
      setLoading(false);
    });
  }, [api]);

  useEffect(() => {
    if(isAuthenticated) {
      fetchPrincipal();
    }
  }, [isAuthenticated, fetchPrincipal]);

  return isAuthenticated ? (
    <Dropdown
      placement="left-end"
      dismissOnClick={false}
      className="w-64"
      renderTrigger={() => (
        <button>
          <NavbarAvatar principalName={principalName} />
        </button>
      )}
    >
      <Dropdown.Header className="w-full flex pr-2">
        <div className="max-w-full flex items-center space-x-4">
          <div className="shrink-0">
            <NavbarAvatar principalName={principalName} />
          </div>
          <div className="overflow-hidden">
            {loading ? (
              <div className="animate-pulse flex flex-col space-y-2">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-36" />
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-36" />
              </div>
            ) : error ? (
              <div className="flex flex-col space-y-2">
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-36" />
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-36" />
              </div>
            ) : (
              <div className="flex grow space-y-1">
                {data.displayName ? (
                  <div className="grow overflow-hidden">
                    <span className="block w-full truncate">{data.displayName}</span>
                    <span className="block text-xs">@{data.username}</span>
                  </div>
                ) : (
                  <div className="grow overflow-hidden">
                    <span className="block w-full truncate">@{data.username}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Dropdown.Header>
      {data?.role === "ADMINISTRATOR" && (
        <Dropdown.Item onClick={() =>router.push("/tmc")}>
          <div className="flex items-center space-x-4 w-full justify-between">
            <span>Management Console</span>
            <Icon path={mdiApplicationCog} size={0.75} />
          </div>
        </Dropdown.Item>
      )}
      <Dropdown.Item onClick={logout}>
        <div className="flex items-center space-x-4 w-full justify-between">
          <span>Logout</span>
          <Icon path={mdiLogout} size={0.75} />
        </div>
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item>
        <div className="flex items-center space-x-4 w-full justify-between">
          <span>Dark Mode</span>
          <ToggleSwitch checked={darkMode} onChange={toggleTheme} />
        </div>
      </Dropdown.Item>
    </Dropdown>
  ) : (
    <Dropdown
      placement="left-end"
      dismissOnClick={false}
      renderTrigger={() => (
        <button
          className="inline-flex items-center rounded-lg p-0 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <Icon path={mdiDotsVertical}
            title="Theme Toggle"
            size={1}
          />
        </button>
      )}
    >
      <Dropdown.Item>
        <div className="flex items-center space-x-4">
          <span>Dark Mode</span>
          <ToggleSwitch checked={darkMode} onChange={toggleTheme} />
        </div>
      </Dropdown.Item>
    </Dropdown>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const navigation = useMemo(() => {
    return [
      { name: "Home", path: "/home", isCurrent: pathname === "/home" },
      { name: "About", path: "/about", isCurrent: pathname === "/about" },
    ];
  }, [pathname]);

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
          <NavbarMenu />
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
