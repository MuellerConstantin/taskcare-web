import { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CollectionIcon, CogIcon, UserGroupIcon } from "@heroicons/react/solid";
import { Tab } from "@headlessui/react";
import StackTemplate from "../components/templates/StackTemplate";
import BoardHeaderView from "../components/organisms/board/BoardHeaderView";
import MemberListView from "../components/organisms/member/MemberListView";
import TaskKanbanView from "../components/organisms/task/TaskKanbanView";
import BoardSettingsView from "../components/organisms/board/BoardSettingsView";
import { fetchBoard } from "../store/slices/board";
import { fetchTasks } from "../store/slices/tasks";
import { fetchMembers } from "../store/slices/members";
import { StompProvider, useStomp } from "../contexts/stomp";

function Board() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    board,
    currentMember,
    error: boardError,
  } = useSelector((state) => state.board, shallowEqual);

  const { error: tasksError } = useSelector(
    (state) => state.members,
    shallowEqual
  );

  const { error: membersError } = useSelector(
    (state) => state.members,
    shallowEqual
  );

  const { client } = useStomp();

  useEffect(() => {
    // Initially loads all information of a board

    if (boardId) {
      dispatch(fetchBoard(boardId));
      dispatch(fetchTasks(boardId));
      dispatch(fetchMembers(boardId));
    }
  }, [boardId, dispatch]);

  useEffect(() => {
    // Provides a logout in the event of authenticated access

    if (
      boardError?.status === 401 ||
      tasksError?.status === 401 ||
      membersError?.status === 401
    ) {
      navigate("/logout");
    }
  }, [boardError, tasksError, membersError, navigate]);

  useEffect(() => {
    // Adjusts the page title individually to the loaded board

    if (board) {
      document.title = `TaskCare | ${board.name}`;
    } else {
      document.title = "TaskCare | Board";
    }
  }, [board]);

  useEffect(() => {
    if (client && boardId) {
      // Monitors update events to keep the board up to date
      client.subscribe(`/topic/board.${boardId}.board-updated`, () => {
        dispatch(fetchBoard(boardId));
      });

      // Monitors delete events to redirect the user to the main screen if the board no longer exists
      client.subscribe(`/topic/board.${boardId}.board-deleted`, () => {
        navigate("/overview");
      });
    }
  }, [client, boardId, dispatch, navigate]);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="space-y-4">
              <BoardHeaderView />
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
                  <Tab
                    className={({ selected }) =>
                      `max-w-full grow md:max-w-[10rem] flex items-center space-x-2 text-sm leading-5 font-medium outline-none pb-1 disabled:opacity-50
                        ${
                          selected
                            ? "border-b-4 border-b-amber-500"
                            : "border-b-4 border-transparent"
                        }`
                    }
                    disabled={currentMember?.role !== "ADMINISTRATOR"}
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
                </Tab.List>
                <hr className="border-gray-300 dark:border-gray-400 !m-0 !p-0" />
                <Tab.Panels as="div">
                  <Tab.Panel>
                    <TaskKanbanView />
                  </Tab.Panel>
                  <Tab.Panel>
                    <MemberListView />
                  </Tab.Panel>
                  <Tab.Panel>
                    <BoardSettingsView />
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
