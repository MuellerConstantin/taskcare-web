import Image from "next/image";
import { Button, Modal, Avatar } from "flowbite-react";
import useSWR from "swr";
import useApi from "@/hooks/useApi";

const customButtonTheme = {
  "color": {
    "amber": "border border-transparent bg-amber-500 text-white focus:ring-4 focus:ring-amber-300 enabled:hover:bg-amber-600 dark:focus:ring-amber-900"
  }
};

function UserInfoDialogAvatar({username, userId}) {
  const api = useApi();

  const {
    data,
    isLoading: loading
  } = useSWR(userId ? `/users/${userId}/profile-image` : null,
    (url) => api.get(url, {responseType: "arraybuffer"})
      .then((res) => URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }))));

  if(loading || !username) {
    return (
      <div className="animate-pulse">
        <Avatar size="lg" rounded />
      </div>
    );
  } else {
    if (data) {
      return (
        <Avatar
          size="lg"
          className="bg-gray-200 dark:bg-gray-900 rounded-full"
          rounded
          img={({className, ...props}) => (
            <Image
              src={data}
              alt={username}
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
        <Avatar size="lg" placeholderInitials={username.slice(0, 2).toUpperCase()} rounded />
      );
    }
  }
}

export default function UserInfoDialog({show, onClose, userId}) {
  const api = useApi();

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(userId ? `/users/${userId}` : null,
    (url) => api.get(url).then((res) => res.data));

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>User Information</Modal.Header>
      <Modal.Body className="p-0 pb-4 space-y-4 flex flex-col">
        <div className="shrink-0 relative h-24 bg-amber-500 mb-6">
          <div className="absolute top-12 m-auto left-0 right-0 bg-gray-100 dark:bg-gray-800 rounded-full w-fit">
            <UserInfoDialogAvatar username={data?.username} userId={userId} />
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
                {data?.username}
              </h1>
            )}
          </div>
          {loading ? (
            <div className="space-y-1 animate-pulse">
              <div className="flex justify-between items-center space-x-1">
                <span>Display Name:</span>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32" />
              </div>
              <div className="flex justify-between items-center space-x-1">
                <span>Identity Provider:</span>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32" />
              </div>
              <div className="flex justify-between items-center space-x-1">
                <span>System Role:</span>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32" />
              </div>
            </div>
          ) : error ? (
            <div className="space-y-1">
              <div className="flex justify-between items-center space-x-1">
                <span>Display Name:</span>
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-36" />
              </div>
              <div className="flex justify-between items-center space-x-1">
                <span>Identity Provider:</span>
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-36" />
              </div>
              <div className="flex justify-between items-center space-x-1">
                <span>System Role:</span>
                <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-36" />
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between space-x-1">
                <span>Display Name:</span>
                <span className="truncate">{data?.displayName || '-'}</span>
              </div>
              <div className="flex justify-between space-x-1">
                <span>Identity Provider:</span>
                <span>{data?.identityProvider}</span>
              </div>
              <div className="flex justify-between space-x-1">
                <span>System Role:</span>
                <span>{data?.role}</span>
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
