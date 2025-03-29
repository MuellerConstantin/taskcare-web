"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { useSWRConfig } from "swr";
import { Plus } from "lucide-react";
import { DialogTrigger } from "react-aria-components";
import { BoardCard } from "@/components/organisms/board/BoardCard";
import { BoardCardSkeleton } from "@/components/organisms/board/BoardCardSkeleton";
import { Pagination } from "@/components/molecules/Pagination";
import { SearchBar } from "@/components/molecules/SearchBar";
import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/atoms/Modal";
import { AddBoardDialog } from "./AddBoardDialog";
import useApi from "@/hooks/useApi";

interface PrincipalBoardGalleryProps {}

export function PrincipalBoardGallery(props: PrincipalBoardGalleryProps) {
  const api = useApi();
  const { mutate } = useSWRConfig();

  const [page, setPage] = useState(1);
  const [perPage] = useState(25);

  const [searchProperty, setSearchProperty] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const searchQuery = useMemo(() => {
    if (searchProperty && searchTerm && searchTerm.length > 0) {
      return encodeURIComponent(`${searchProperty}=like="%${searchTerm}%"`);
    } else {
      return null;
    }
  }, [searchProperty, searchTerm]);

  const { data, error, isLoading } = useSWR<{
    info: {
      totalElements: number;
      totalPages: number;
      page: number;
      perPage: number;
    };
    content: {
      id: string;
      name: string;
      description: string;
    }[];
  }>(
    `/user/me/boards?page=${page - 1}&perPage=${perPage}${searchQuery ? `&search=${searchQuery}` : ""}`,
    (url) => api.get(url).then((res) => res.data),
    { keepPreviousData: true },
  );

  const isInitialLoading = useMemo(
    () => isLoading && (!data || data.info.totalElements === 0),
    [isLoading, data],
  );

  const isRefreshLoading = useMemo(
    () => isLoading && data && data.info.totalElements > 0,
    [isLoading, data],
  );

  const hasErrored = useMemo(() => !isLoading && error, [isLoading, error]);

  const hasSucceeded = useMemo(
    () => !isLoading && !error && data,
    [isLoading, error, data],
  );

  const hasData = useMemo(
    () => hasSucceeded && data && data.info.totalElements > 0,
    [hasSucceeded, data],
  );

  const isFiltered = useMemo(
    () => hasSucceeded && searchQuery,
    [hasSucceeded, searchQuery],
  );

  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar
          isDisabled={isLoading || hasErrored}
          onSearch={(property, searchTerm) => {
            setSearchProperty(property);
            setSearchTerm(searchTerm);
          }}
          properties={[
            { label: "ID", value: "id" },
            { label: "Name", value: "name" },
            { label: "Description", value: "description" },
          ]}
        />
        <DialogTrigger>
          <Button
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <div>Add Board</div>
          </Button>
          <Modal>
            <AddBoardDialog
              onAdd={() => {
                mutate(
                  (key: string) => /^.*\/user\/me\/boards.*$/.test(key),
                  null,
                );
              }}
            />
          </Modal>
        </DialogTrigger>
      </div>
      <div className="relative flex flex-col flex-wrap gap-4 md:flex-row">
        {isInitialLoading &&
          Array.from(Array(6).keys()).map((key) => (
            <BoardCardSkeleton key={key} />
          ))}

        {isRefreshLoading && (
          <>
            {data!.content.map((board) => (
              <div key={board.id} className="relative">
                <BoardCard board={board} />
                <div className="bg-opacity-50 dark:bg-opacity-50 absolute inset-0 z-50 h-full w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
              </div>
            ))}
          </>
        )}

        {hasErrored &&
          Array.from(Array(6).keys()).map((key) => (
            <BoardCardSkeleton key={key} error={error} />
          ))}

        {hasSucceeded && (
          <>
            {hasData &&
              data!.content.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}

            {!hasData && !isFiltered && (
              <div className="w-full text-center">
                It seems like you are not a member of a board yet.
              </div>
            )}

            {!hasData && isFiltered && (
              <div className="w-full text-center">
                It seems like no results were found.
              </div>
            )}
          </>
        )}
      </div>
      {hasSucceeded && hasData && (
        <div className="flex flex-wrap items-center justify-start gap-4">
          <Pagination
            totalPages={data!.info.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Viewing{" "}
            <span className="font-semibold text-slate-800 dark:text-white">
              {data!.info.page * data!.info.perPage + 1}-
              {Math.min(
                data!.info.page * data!.info.perPage + data!.info.perPage,
                data!.info.totalElements,
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800 dark:text-white">
              {data!.info.totalElements}
            </span>{" "}
            elements
          </div>
        </div>
      )}
    </div>
  );
}
