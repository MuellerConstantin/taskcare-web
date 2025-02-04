"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button } from "flowbite-react";
import { mdiPlus } from "@mdi/js";
import SearchBar from "@/components/molecules/SearchBar";
import MyBoardsGallery from "@/components/organisms/board/MyBoardsGallery";

const Icon = dynamic(() => import("@mdi/react").then(module => module.Icon), { ssr: false });

const customButtonTheme = {
  "color": {
    "light": "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  }
};

export default function Home() {
  const [searchProperty, setSearchProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);

  const [showBoardAddDialog, setShowBoardAddDialog] = useState(false);

  const searchQuery = useMemo(() => {
    if(searchProperty && searchTerm && searchTerm.length > 0) {
      return encodeURIComponent(`${searchProperty}=like="%${searchTerm}%"`)
    } else {
      return null;
    }
  }, [searchProperty, searchTerm]);

  return (
    <div className="grow flex flex-col">
      <div className="flex flex-col grow w-full max-w-screen-2xl mx-auto p-4 space-y-4">
        <div className="w-full space-y-2">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Your Boards</h1>
          <hr />
        </div>
        <div className="flex flex-col gap-2 md:gap-x-12 md:flex-row md:flex-wrap md:justify-between md:items-center">
          <SearchBar
            onSearch={(property, term) => {
              setSearchProperty(property);
              setSearchTerm(term);
            }}
            properties={new Map([["id", "ID"], ["name", "Name"], ["description", "Description"]])}
          />
          <Button
            theme={customButtonTheme}
            color="light"
            size="xs"
            onClick={() => setShowBoardAddDialog(true)}
            className="w-fit"
          >
            <div className="flex items-center space-x-2 justify-center">
              <Icon path={mdiPlus} size={0.75} />
              <span>Add Board</span>
            </div>
          </Button>
        </div>
        <MyBoardsGallery searchQuery={searchQuery} />
      </div>
    </div>
  );
}
