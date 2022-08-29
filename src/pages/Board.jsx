import { useEffect, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  CollectionIcon,
  CogIcon,
  ExclamationIcon,
  UserGroupIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import { Tab } from "@headlessui/react";
import BoardHeader from "../components/molecules/board/BoardHeader";
import BoardHeaderSkeleton from "../components/molecules/board/BoardHeaderSkeleton";
import MemberThumbnail from "../components/molecules/member/MemberThumbnail";
import MemberThumbnailSkeleton from "../components/molecules/member/MemberThumbnailSkeleton";
import EditableMemberThumbnail from "../components/organisms/member/EditableMemberThumbnail";
import ChangeBoardNameForm from "../components/organisms/board/ChangeBoardNameForm";
import ChangeBoardDescriptionForm from "../components/organisms/board/ChangeBoardDescriptionForm";
import DeleteBoardForm from "../components/organisms/board/DeleteBoardForm";
import CreateMemberModal from "../components/organisms/member/CreateMemberModal";
import StackTemplate from "../components/templates/StackTemplate";
import TaskKanbanView from "../components/organisms/task/TaskKanbanView";
import {
  fetchBoard,
  fetchBoardInfo,
  fetchBoardMembers,
} from "../store/slices/board";
import { StompProvider } from "../contexts/stomp";

function Board() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showCreateMemberModal, setShowCreateMemberModal] = useState(false);

  const { board, currentMember, members, loading, error } = useSelector(
    (state) => state.board,
    shallowEqual
  );

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoard(boardId));
    }
  }, [boardId, dispatch]);

  useEffect(() => {
    if (error?.status === 401) {
      navigate("/logout");
    }
  }, [error, navigate]);

  useEffect(() => {
    if (board) {
      document.title = `TaskCare | ${board.name}`;
    } else {
      document.title = "TaskCare | Board";
    }
  }, [board]);

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
                  <BoardHeaderSkeleton
                    error={
                      error ? "Loading the board information failed." : null
                    }
                  />
                </div>
              )}
              {!loading && !error && board && <BoardHeader board={board} />}
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
                  <Tab.Panel>
                    <TaskKanbanView boardId={boardId} />
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="flex flex-col space-y-4">
                      {currentMember && currentMember.role === "ADMINISTRATOR" && (
                        <div className="flex justify-end">
                          <CreateMemberModal
                            boardId={boardId}
                            onSubmit={() => {
                              setShowCreateMemberModal(false);
                              dispatch(fetchBoardMembers(boardId));
                            }}
                            onClose={() => setShowCreateMemberModal(false)}
                            isOpen={showCreateMemberModal}
                          />
                          <button
                            type="button"
                            className="inline-flex items-center justify-center bg-transparent text-amber-500"
                            onClick={() => setShowCreateMemberModal(true)}
                          >
                            <PlusIcon className="h-6 w-6" aria-hidden="true" />
                            <div className="ml-2">Create member</div>
                          </button>
                        </div>
                      )}
                      <div className="flex flex-col space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(loading || error) &&
                            [...Array(4).keys()].map((key) => (
                              <div key={key} className="w-full relative">
                                {error && (
                                  <button
                                    type="button"
                                    className="group absolute top-2 left-2 flex items-start space-x-2 text-red-500"
                                  >
                                    <div className="rounded-full p-1 bg-gray-100 dark:bg-gray-700 opacity-80">
                                      <ExclamationIcon className="h-6" />
                                    </div>
                                    <div className="invisible group-hover:visible group-focus:visible bg-gray-100 dark:bg-gray-700 rounded-md shadow-md text-xs p-2 opacity-80 max-w-xs line-clamp-4">
                                      Loading the board information failed.
                                    </div>
                                  </button>
                                )}
                                <MemberThumbnailSkeleton
                                  error={
                                    error
                                      ? "Loading the board information failed."
                                      : null
                                  }
                                />
                              </div>
                            ))}
                          {!loading &&
                            !error &&
                            members.length > 0 &&
                            members.map((member) => (
                              <div className="flex" key={member.username}>
                                {currentMember &&
                                currentMember.role === "ADMINISTRATOR" ? (
                                  <EditableMemberThumbnail
                                    boardId={boardId}
                                    member={member}
                                    onSubmit={() =>
                                      dispatch(fetchBoardMembers(boardId))
                                    }
                                  />
                                ) : (
                                  <MemberThumbnail member={member} />
                                )}
                              </div>
                            ))}
                        </div>
                        {!loading && !error && members.length <= 0 && (
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
                        onChange={() => dispatch(fetchBoardInfo(boardId))}
                      />
                      <ChangeBoardDescriptionForm
                        boardId={boardId}
                        currentDescription={board?.description}
                        onChange={() => dispatch(fetchBoardInfo(boardId))}
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

export default function BoardWrapper() {
  return (
    <StompProvider url={process.env.REACT_APP_TASKCARE_WS_URI}>
      <Board />
    </StompProvider>
  );
}
