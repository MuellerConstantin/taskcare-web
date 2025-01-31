import Image from "next/image";
import { Button, Modal } from "flowbite-react";
import useSWR from "swr";
import IdentIcon from "@/components/atoms/IdentIcon";
import useApi from "@/hooks/useApi";

const customButtonTheme = {
  "color": {
    "amber": "border border-transparent bg-amber-500 text-white focus:ring-4 focus:ring-amber-300 enabled:hover:bg-amber-600 dark:focus:ring-amber-900"
  }
};

function BoardInfoDialogLogo({boardName, boardId}) {
  const api = useApi();

  const {
    data
  } = useSWR(boardId ? `/boards/${boardId}/logo-image` : null,
    (url) => api.get(url, {responseType: "arraybuffer"})
      .then((res) => URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }))));

  if (data) {
    return (
      <div className="rounded-full w-20 h-20">
        <Image
          src={data}
          alt={boardName}
          width={64}
          height={64}
          className="object-cover"
          {...props}
        />
      </div>
    )
  } else {
    return (
      <div className="rounded-full w-20 h-20 overflow-hidden">
        <IdentIcon value={boardName} />
      </div>
    );
  }
}

export default function BoardInfoDialog({show, onClose, boardId}) {
  const api = useApi();

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(boardId ? `/boards/${boardId}` : null,
    (url) => api.get(url).then((res) => res.data));

  const {
    data: memberData,
    error: memberError,
    isLoading: memberLoading
  } = useSWR(boardId ? `/boards/${boardId}/members` : null,
    (url) => api.get(url).then((res) => res.data));

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>Board Information</Modal.Header>
      <Modal.Body className="p-0 pb-4 space-y-4 flex flex-col">
        <div className="shrink-0 relative h-24 bg-amber-500 mb-6">
          <div className="absolute top-12 m-auto left-0 right-0 bg-gray-100 dark:bg-gray-800 rounded-full w-fit">
            <BoardInfoDialogLogo boardName={data?.name} userId={boardId} />
          </div>
        </div>
        <div className="flex flex-col px-4 space-y-6 text-gray-900 dark:text-white">
          <div className="w-full flex justify-center">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-800 w-32" />
              </div>
            ) : error ? (
              <div className="h-3 bg-red-200 dark:bg-red-400 rounded-full w-32" />
            ) : (
              <h1 className="font-semibold max-w-[50%]">
                {data?.name}
              </h1>
            )}
          </div>
          {loading ? (
            <div className="space-y-1">
              <div className="flex flex-col space-y-1">
                <span className="font-semibold">Description:</span>
                <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-48" />
                <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-48" />
                <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-48" />
              </div>
            </div>
          ) : error ? (
            <div className="space-y-1">
              <div className="flex flex-col space-y-1">
                <span className="font-semibold">Description:</span>
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-48" />
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-48" />
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-48" />
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="flex flex-col space-y-1">
                <span className="font-semibold">Description:</span>
                <span className="line-clamp-3">{data?.description || '-'}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between space-x-1">
                  <span className="font-semibold">Member Count:</span>
                  <span className="truncate">{memberData?.info.totalElements || '-'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button theme={customButtonTheme} color="amber" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
