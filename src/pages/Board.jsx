import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  CollectionIcon,
  CogIcon,
  ExclamationIcon,
  UserGroupIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/solid";
import { Tab } from "@headlessui/react";
import BoardHeader from "../components/molecules/BoardHeader";
import BoardHeaderSkeleton from "../components/molecules/BoardHeaderSkeleton";
import MemberThumbnail from "../components/molecules/MemberThumbnail";
import MemberThumbnailSkeleton from "../components/molecules/MemberThumbnailSkeleton";
import UpdateMemberModal from "../components/organisms/UpdateMemberModal";
import RemoveMemberModal from "../components/organisms/RemoveMemberModal";
import ChangeBoardNameForm from "../components/organisms/ChangeBoardNameForm";
import ChangeBoardDescriptionForm from "../components/organisms/ChangeBoardDescriptionForm";
import DeleteBoardForm from "../components/organisms/DeleteBoardForm";
import AddMemberModal from "../components/organisms/AddMemberModal";
import StackTemplate from "../components/templates/StackTemplate";
import { fetchBoard } from "../api/boards";
import { fetchMember, fetchMembers } from "../api/members";

export default function Board() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const principal = useSelector((state) => state.auth.principal);

  const [boardError, setBoardError] = useState(null);
  const [boardLoading, setBoardLoading] = useState(true);
  const [board, setBoard] = useState(null);
  const [currentMember, setCurrentMember] = useState(null);

  const [membersError, setMembersError] = useState(null);
  const [membersLoading, setMembersLoading] = useState(false);
  const [members, setMembers] = useState([]);

  const onFetchBoard = useCallback(
    async (id) => {
      setBoardError(null);

      try {
        const boardRes = await fetchBoard(id);
        setBoard(boardRes.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/logout");
        } else if (err.response && err.response.status === 404) {
          navigate("/not-found");
        } else {
          setBoardError("The board information could not be loaded.");
        }

        throw err;
      }
    },
    [navigate]
  );

  const onFetchCurrentMember = useCallback(
    async (id, currentUsername) => {
      setBoardError(null);

      try {
        const currentMemberRes = await fetchMember(id, currentUsername);

        setCurrentMember(currentMemberRes.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/logout");
        } else if (err.response && err.response.status === 404) {
          navigate("/not-found");
        } else {
          setBoardError("The board information could not be loaded.");
        }

        throw err;
      }
    },
    [navigate]
  );

  const onFetchMembers = useCallback(
    async (id) => {
      setMembersError(null);

      try {
        const membersRes = await fetchMembers(id);
        setMembers(membersRes.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/logout");
        } else if (err.response && err.response.status === 404) {
          navigate("/not-found");
        } else {
          setMembersError(
            "The board member's information could not be loaded."
          );
        }

        throw err;
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (board) {
      document.title = `TaskCare | ${board.name}`;
    } else {
      document.title = "TaskCare | Board";
    }
  }, [board]);

  useEffect(() => {
    if (boardId && principal) {
      setBoardLoading(true);

      onFetchBoard(boardId)
        .then(() => onFetchCurrentMember(boardId, principal.username))
        .finally(() => setBoardLoading(false));
    }
  }, [boardId, onFetchBoard, onFetchCurrentMember, principal]);

  useEffect(() => {
    if (boardId && principal) {
      setMembersLoading(true);

      onFetchMembers(boardId).finally(() => setMembersLoading(false));
    }
  }, [boardId, onFetchMembers, principal]);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="xl:container mx-auto p-4">
          <div className="flex flex-col space-y-4">
            <div className="space-y-4">
              {(boardLoading || boardError) && (
                <div className="w-full relative">
                  {boardError && (
                    <button
                      type="button"
                      className="group absolute top-2 left-2 flex items-start space-x-2 text-red-500"
                    >
                      <div className="rounded-full p-1 bg-gray-100 dark:bg-gray-700 opacity-80">
                        <ExclamationIcon className="h-6" />
                      </div>
                      <div className="invisible group-hover:visible group-focus:visible bg-gray-100 dark:bg-gray-700 rounded-md shadow-md text-xs p-2 opacity-80 max-w-xs line-clamp-4">
                        {boardError}
                      </div>
                    </button>
                  )}
                  <BoardHeaderSkeleton error={boardError} />
                </div>
              )}
              {!boardLoading && !boardError && <BoardHeader board={board} />}
              <Tab.Group as="div" className="space-y-6">
                <Tab.List className="flex rounded-xl space-x-2">
                  <Tab
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
                  {currentMember && currentMember.role === "ADMINISTRATOR" && (
                    <Tab
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
                  <Tab.Panel>
                    <div className="flex flex-col space-y-4">
                      {currentMember && currentMember.role === "ADMINISTRATOR" && (
                        <div className="flex justify-end">
                          <AddMemberModal
                            boardId={boardId}
                            onSubmit={() => onFetchMembers(boardId)}
                          >
                            <button
                              type="button"
                              className="inline-flex items-center justify-center bg-transparent text-amber-500"
                            >
                              <PlusIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                              <div className="ml-2">Add member</div>
                            </button>
                          </AddMemberModal>
                        </div>
                      )}
                      <div className="flex flex-col space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(membersLoading || membersError) &&
                            [...Array(4).keys()].map((key) => (
                              <div key={key} className="w-full relative">
                                {membersError && (
                                  <button
                                    type="button"
                                    className="group absolute top-2 left-2 flex items-start space-x-2 text-red-500"
                                  >
                                    <div className="rounded-full p-1 bg-gray-100 dark:bg-gray-700 opacity-80">
                                      <ExclamationIcon className="h-6" />
                                    </div>
                                    <div className="invisible group-hover:visible group-focus:visible bg-gray-100 dark:bg-gray-700 rounded-md shadow-md text-xs p-2 opacity-80 max-w-xs line-clamp-4">
                                      {membersError}
                                    </div>
                                  </button>
                                )}
                                <MemberThumbnailSkeleton error={membersError} />
                              </div>
                            ))}
                          {!membersLoading &&
                            !membersError &&
                            members.length > 0 &&
                            members.map((member) => (
                              <div className="flex" key={member.username}>
                                <MemberThumbnail member={member} />
                                {currentMember &&
                                  currentMember.role === "ADMINISTRATOR" && (
                                    <div className="flex flex-col p-1 place-content-between">
                                      <UpdateMemberModal
                                        boardId={boardId}
                                        username={member.username}
                                        currentRole={member.role}
                                        onSubmit={() => onFetchMembers(boardId)}
                                      >
                                        <button
                                          type="button"
                                          className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                                        >
                                          <PencilIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                          />
                                        </button>
                                      </UpdateMemberModal>
                                      <RemoveMemberModal
                                        boardId={boardId}
                                        username={member.username}
                                        onSubmit={() => onFetchMembers(boardId)}
                                      >
                                        <button
                                          type="button"
                                          className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                                        >
                                          <TrashIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                          />
                                        </button>
                                      </RemoveMemberModal>
                                    </div>
                                  )}
                              </div>
                            ))}
                        </div>
                        {!membersLoading &&
                          !membersError &&
                          members.length <= 0 && (
                            <p className="text-center text-gray-800 dark:text-white">
                              No members available.
                            </p>
                          )}
                      </div>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="space-y-8">
                      <ChangeBoardNameForm
                        boardId={boardId}
                        currentName={board?.name}
                        onChange={() => onFetchBoard(boardId)}
                      />
                      <ChangeBoardDescriptionForm
                        boardId={boardId}
                        currentDescription={board?.description}
                        onChange={() => onFetchBoard(boardId)}
                      />
                      <DeleteBoardForm
                        boardId={boardId}
                        onChange={() => navigate("/overview")}
                      />
                    </div>
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
