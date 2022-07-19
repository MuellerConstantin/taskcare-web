import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/solid";
import BoardList from "../components/molecules/BoardList";
import CreateBoardModal from "../components/organisms/CreateBoardModal";
import StackTemplate from "../components/templates/StackTemplate";
import { fetchBoardsByMembership } from "../api/boards";

export default function Overview() {
  const navigate = useNavigate();

  const principal = useSelector((state) => state.auth.principal);

  const [boardsError, setBoardsError] = useState(null);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [boards, setBoards] = useState([]);
  const [boardsPageable, setBoardsPageable] = useState(null);

  const onFetchBoards = useCallback(
    async (_page) => {
      setBoardsError(null);

      try {
        const res = await fetchBoardsByMembership(principal.username, _page);

        setBoards(res.data.content);
        setBoardsPageable(res.data.info);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/logout");
        } else {
          setBoardsError("The list of available boards could not be loaded.");
        }

        throw err;
      }
    },
    [navigate, principal]
  );

  useEffect(() => {
    document.title = "TaskCare | Overview";
  }, []);

  useEffect(() => {
    setBoardsLoading(true);

    onFetchBoards(0).finally(() => setBoardsLoading(false));
  }, [onFetchBoards]);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="xl:container mx-auto p-4">
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <h1 className="text-xl text-gray-800 dark:text-white">
                  Your Boards
                </h1>
                <CreateBoardModal onSubmit={() => onFetchBoards(0)}>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center bg-transparent text-amber-500"
                  >
                    <PlusIcon className="h-6 w-6" aria-hidden="true" />
                    <div className="ml-2">Add board</div>
                  </button>
                </CreateBoardModal>
              </div>
              <hr className="border-gray-300 dark:border-gray-400" />
            </div>
            <BoardList
              boards={boards}
              pageable={boardsPageable}
              error={boardsError}
              loading={boardsLoading}
              onPageChange={onFetchBoards}
            />
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
