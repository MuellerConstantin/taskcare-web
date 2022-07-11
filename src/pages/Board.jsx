import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  CollectionIcon,
  CogIcon,
  ExclamationIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import { Tab } from "@headlessui/react";
import BoardHeader from "../components/molecules/BoardHeader";
import BoardHeaderSkeleton from "../components/molecules/BoardHeaderSkeleton";
import BoardSettings from "../components/organisms/BoardSettings";
import StackTemplate from "../components/templates/StackTemplate";
import { fetchBoard } from "../api/boards";
import { fetchMember } from "../api/members";

export default function Board() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const principal = useSelector((state) => state.auth.principal);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState(null);
  const [member, setMember] = useState(null);

  const onFetchBoard = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const boardRes = await fetchBoard(id);
      const memberRes = await fetchMember(id, principal.username);

      setBoard(boardRes.data);
      setMember(memberRes.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/logout");
      } else if (err.response && err.response.status === 404) {
        navigate("/not-found");
      } else {
        setError("The board information could not be loaded.");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (board) {
      document.title = `TaskCare | ${board.name}`;
    } else {
      document.title = "TaskCare | Board";
    }
  }, [board]);

  useEffect(() => {
    if (boardId) {
      onFetchBoard(boardId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="xl:container mx-auto p-4">
          <div className="flex flex-col space-y-4">
            <div className="space-y-4">
              {(loading || error) && (
                <div className="w-full relative">
                  {error && (
                    <button
                      type="button"
                      className="group absolute top-2 left-2 flex items-start space-x-2 text-red-500"
                    >
                      <div className="rounded-full p-1 bg-gray-100 dark:bg-gray-700 opacity-80">
                        <ExclamationIcon className="h-6" />
                      </div>
                      <div className="invisible group-hover:visible group-focus:visible bg-gray-100 dark:bg-gray-700 rounded-md shadow-md text-xs p-2 opacity-80 max-w-xs line-clamp-4">
                        {error}
                      </div>
                    </button>
                  )}
                  <BoardHeaderSkeleton error={error} />
                </div>
              )}
              {!loading && !error && <BoardHeader board={board} />}
              <Tab.Group as="div" className="space-y-6">
                <Tab.List className="flex rounded-xl space-x-2">
                  <Tab
                    disabled={loading}
                    className={({ selected }) =>
                      `max-w-full grow md:max-w-[10rem] flex items-center space-x-2 text-sm leading-5 font-medium outline-none pb-1
                      ${
                        selected
                          ? "border-b-4 border-b-amber-500"
                          : "border-b-4 border-transparent"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <div
                        className={`truncate w-full h-full flex justify-center items-center rounded-lg p-2 text-gray-800 dark:text-white ${
                          selected
                            ? "bg-gray-100 dark:bg-gray-700"
                            : "hover:bg-gray-100 hover:dark:bg-gray-700"
                        }`}
                      >
                        <CollectionIcon className="h-4" />
                        <div className="ml-2 truncate">Tasks</div>
                      </div>
                    )}
                  </Tab>
                  <Tab
                    disabled={loading}
                    className={({ selected }) =>
                      `max-w-full grow md:max-w-[10rem] flex items-center space-x-2 text-sm leading-5 font-medium outline-none pb-1
                        ${
                          selected
                            ? "border-b-4 border-b-amber-500"
                            : "border-b-4 border-transparent"
                        }`
                    }
                  >
                    {({ selected }) => (
                      <div
                        className={`truncate w-full h-full flex justify-center items-center rounded-lg p-2 text-gray-800 dark:text-white ${
                          selected
                            ? "bg-gray-100 dark:bg-gray-700"
                            : "hover:bg-gray-100 hover:dark:bg-gray-700"
                        }`}
                      >
                        <UserGroupIcon className="h-4" />
                        <div className="ml-2 truncate">Members</div>
                      </div>
                    )}
                  </Tab>
                  {member && member.role === "ADMINISTRATOR" && (
                    <Tab
                      disabled={loading}
                      className={({ selected }) =>
                        `max-w-full grow md:max-w-[10rem] flex items-center space-x-2 text-sm leading-5 font-medium outline-none pb-1
                        ${
                          selected
                            ? "border-b-4 border-b-amber-500"
                            : "border-b-4 border-transparent"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <div
                          className={`truncate w-full h-full flex justify-center items-center rounded-lg p-2 text-gray-800 dark:text-white ${
                            selected
                              ? "bg-gray-100 dark:bg-gray-700"
                              : "hover:bg-gray-100 hover:dark:bg-gray-700"
                          }`}
                        >
                          <CogIcon className="h-4" />
                          <div className="ml-2 truncate">Settings</div>
                        </div>
                      )}
                    </Tab>
                  )}
                </Tab.List>
                <hr className="border-gray-300 dark:border-gray-400 !m-0 !p-0" />
                <Tab.Panels as="div">
                  <Tab.Panel />
                  <Tab.Panel />
                  <Tab.Panel>
                    <BoardSettings
                      board={board}
                      onSuccess={() => onFetchBoard(board.id)}
                    />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
