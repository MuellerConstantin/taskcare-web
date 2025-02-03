"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, Pagination } from "flowbite-react";
import useSWR from "swr";
import IdentIcon from "@/components/atoms/IdentIcon";
import useApi from "@/hooks/useApi";

const customCardTheme = {
  "root": {
    "children": "flex h-full flex-col justify-center gap-2 p-4",
  },
};

const customPaginationTheme = {
  "pages": {
    "selector": {
      "active": "bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
    }
  }
};

function BoardCardLogo({ board }) {
  const api = useApi();

  const {
    data
  } = useSWR(board?.id ? `/boards/${board.id}/logo-image` : null,
    (url) => api.get(url, {responseType: "arraybuffer"})
      .then((res) => URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }))));

  if(data) {
    return (
      <div className="bg-gray-200 dark:bg-gray-900 h-full w-full relative overflow-hidden">
        <Image
          src={data}
          alt={board?.name}
          fill
          objectFit="cover"
        />
      </div>
    );
  } else {
    return (
      <div className="bg-gray-200 dark:bg-gray-900 h-full w-full overflow-hidden">
        <IdentIcon value={board.name} />
      </div>
    );
  }
}

function BoardCard({ board }) {
  return (
    <Card
      theme={customCardTheme}
      className="w-52 h-[15rem] flex flex-col overflow-hidden hover:cursor-pointer"
      renderImage={() => (
        <div className="min-h-[7rem]">
          <BoardCardLogo board={board} />
        </div>
      )}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <h5 className="shrink-0 font-semibold tracking-tight text-gray-900 dark:text-white truncate">
          {board.name}
        </h5>
        <div className="flex-1 min-h-0">
          <p className="w-full text-sm font-normal text-gray-700 dark:text-gray-400 line-clamp-3 overflow-hidden">
            {board.description}
          </p>
        </div>
      </div>
    </Card>
  );
}

function BoardCardSkeleton({ error }) {
  return (
    <Card
      theme={customCardTheme}
      className="w-52 h-[15rem] flex flex-col overflow-hidden hover:cursor-pointer"
      renderImage={() => (
        <div className={`min-h-[7rem] bg-gray-200 dark:bg-gray-800 ${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"}`}>
        </div>
      )}
    >
      <div className="flex flex-col flex-1 overflow-hidden space-y-4">
        <div>
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-4 bg-gray-200 rounded-full dark:bg-gray-800 w-32`} />
        </div>
        <div className="flex-1 min-h-0 space-y-2">
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32`} />
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32`} />
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32`} />
        </div>
      </div>
    </Card>
  );
}

export default function Home() {
  const api = useApi();

  const [page, setPage] = useState(1);
  const [perPage,] = useState(25);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(`/user/me/boards?page=${page - 1}&perPage=${perPage}`,
    (url) => api.get(url).then((res) => res.data));

  return (
    <div className="grow flex flex-col">
      <div className="flex flex-col grow w-full max-w-screen-2xl mx-auto p-4 space-y-4">
        <div className="w-full space-y-2">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Your Boards</h1>
          <hr />
        </div>
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          {loading ? (
            Array.from(Array(6).keys()).map((key) => (
              <BoardCardSkeleton key={key} />
            ))
          ) : error ? (
            Array.from(Array(6).keys()).map((key) => (
              <BoardCardSkeleton key={key} error />
            ))
          ) : (
            <>
              {data?.info.totalElements > 0 ? (
                data?.content.map((board) => <BoardCard key={board.id} board={board} />)
              ) : (
                <div className="w-full text-center">
                  It seems like you are not a member of a board yet.
                </div>
              )}
            </>
          )}
        </div>
        {data?.info.totalElements > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination
              theme={customPaginationTheme}
              layout="pagination"
              showIcons
              currentPage={page}
              totalPages={data?.info?.totalPages ? data.info.totalPages : 1}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
