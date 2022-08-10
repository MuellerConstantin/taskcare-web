import { Fragment } from "react";
import { Popover, Transition, Switch } from "@headlessui/react";
import { DotsVerticalIcon, LogoutIcon } from "@heroicons/react/solid";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import themeSlice from "../../store/slices/theme";

import Logo from "../../assets/images/logo.svg";
import LogoTextLight from "../../assets/images/logo-text-light.svg";
import LogoTextDark from "../../assets/images/logo-text-dark.svg";

export default function Navbar() {
  const dispatch = useDispatch();

  const principal = useSelector((state) => state.auth.principal);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const onThemeToggle = (value) => {
    dispatch(themeSlice.actions.setDarkMode(value));
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="xl:container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <Link to={principal ? "/overview" : "/"}>
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="block lg:hidden h-8 w-auto"
                  src={Logo}
                  alt="Logo"
                />
                <img
                  className="hidden lg:block lg:dark:hidden h-8 w-auto"
                  src={LogoTextDark}
                  alt="Logo"
                />
                <img
                  className="hidden lg:dark:block h-8 w-auto"
                  src={LogoTextLight}
                  alt="Logo"
                />
              </div>
            </Link>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-4">
            {!principal && (
              <div className="hidden md:flex bg-gray-100 dark:bg-gray-800 space-x-4 items-center justify-between">
                <Link
                  to="/login"
                  className="text-green-500 hover:brightness-110"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button className="w-full bg-green-500 focus:outline-green-500">
                    Register
                  </Button>
                </Link>
              </div>
            )}
            <Popover className="relative">
              {() => (
                <>
                  <Popover.Button className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white focus:outline-none">
                    {principal ? (
                      <div className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white p-2 rounded-full">
                        <div className="h-5 md:h-6 aspect-square rounded-md">
                          <Avatar value={principal.username} />
                        </div>
                      </div>
                    ) : (
                      <DotsVerticalIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute shadow-md border dark:border-gray-900 rounded-md z-10 mt-3 w-screen max-w-xs sm:max-w-sm right-0 bg-white dark:bg-gray-600 text-gray-800 dark:text-white">
                      {principal ? (
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 flex space-x-4 items-center justify-between">
                          <div className="flex space-x-4 items-center overflow-hidden">
                            <div className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white p-2 rounded-full">
                              <div className="h-10 aspect-square rounded-md">
                                <Avatar value={principal.username} />
                              </div>
                            </div>
                            <div className="space-y-1 overflow-hidden">
                              {(principal.firstName || principal.lastName) && (
                                <div className="truncate">
                                  {principal.firstName && (
                                    <span>{principal.firstName}&nbsp;</span>
                                  )}
                                  {principal.lastName && principal.lastName}
                                </div>
                              )}
                              <div
                                className={`truncate ${
                                  (principal.firstName || principal.lastName) &&
                                  "text-sm font-light"
                                }`}
                              >
                                {principal.username}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Link
                              to="/logout"
                              className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                            >
                              <LogoutIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="flex md:hidden flex-col">
                          <div className="p-4 bg-gray-100 dark:bg-gray-800 flex space-x-4 items-center justify-between">
                            <Link to="/login" className="block grow">
                              <Button className="w-full bg-green-500 focus:outline-green-500">
                                Login
                              </Button>
                            </Link>
                            <Link to="/register" className="bock grow">
                              <Button className="w-full bg-green-500 focus:outline-green-500">
                                Register
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                      <div className="p-2 text-gray-800 dark:text-white flex flex-col space-y-2">
                        {principal && (
                          <Link to="/settings">
                            <div className="flex justify-left items-center p-2 hover:bg-gray-100 hover:cursor-pointer hover:dark:bg-gray-700 rounded">
                              <div className="text-sm">Settings</div>
                            </div>
                          </Link>
                        )}
                        <div className="flex justify-between items-center p-2 rounded">
                          <div className="text-sm">Dark Mode</div>
                          <div>
                            <Switch
                              checked={darkMode}
                              onChange={onThemeToggle}
                              className={`relative inline-flex flex-shrink-0 h-[24px] w-[44px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 ${
                                darkMode
                                  ? "bg-green-500"
                                  : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              <span className="sr-only">Toggle dark mode</span>
                              <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${
                                  darkMode
                                    ? "translate-x-[20px]"
                                    : "translate-x-0"
                                }`}
                              />
                            </Switch>
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
