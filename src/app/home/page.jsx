"use client";

import MyBoardsGallery from "@/components/organisms/board/MyBoardsGallery";

export default function Home() {
  return (
    <div className="grow flex flex-col">
      <div className="flex flex-col grow w-full max-w-screen-2xl mx-auto p-4 space-y-4">
        <div className="w-full space-y-2">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Your Boards</h1>
          <hr />
        </div>
        <MyBoardsGallery />
      </div>
    </div>
  );
}
