import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusIcon, ExclamationIcon, XIcon } from "@heroicons/react/solid";
import BoardThumbnail from "../components/molecules/board/BoardThumbnail";
import BoardThumbnailSkeleton from "../components/molecules/board/BoardThumbnailSkeleton";
import SearchBoardForm from "../components/molecules/board/SearchBoardForm";
import Pagination from "../components/molecules/Pagination";
import CreateBoardModal from "../components/organisms/board/CreateBoardModal";
import StackTemplate from "../components/templates/StackTemplate";
import { fetchBoardsByMembership } from "../api/boards";

export default function Overview() {
  const navigate = useNavigate();

  const principal = useSelector((state) => state.auth.principal);

  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);

  const [boardsError, setBoardsError] = useState(null);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [boards, setBoards] = useState([]);
  const [boardsPageable, setBoardsPageable] = useState(null);
  const [boardPage, setBoardPage] = useState(0);
  const [boardFilter, setBoardFilter] = useState(null);

  const onFetchBoards = useCallback(
    async (_page, _filter) => {
      setBoardsError(null);

      try {
        const res = await fetchBoardsByMembership(
          principal.username,
          _page,
          _filter && `name==*${_filter}*`
        );

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

    onFetchBoards(boardPage, boardFilter).finally(() =>
      setBoardsLoading(false)
    );
  }, [onFetchBoards, boardPage, boardFilter]);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="2xl:container mx-auto p-4">
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <CreateBoardModal
                isOpen={showCreateBoardModal}
                onSubmit={() => {
                  setShowCreateBoardModal(false);
                  onFetchBoards(0);
                }}
                onClose={() => setShowCreateBoardModal(false)}
              />
              <div className="flex flex-col space-y-2 md:hidden">
                <div className="flex justify-between">
                  <h1 className="text-xl text-gray-800 dark:text-white">
                    Your Boards
                  </h1>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center bg-transparent text-amber-500 disabled:opacity-50 hover:brightness-110"
                    onClick={() => setShowCreateBoardModal(true)}
                  >
                    <PlusIcon className="h-6 w-6" aria-hidden="true" />
                    <div className="ml-2">Add board</div>
                  </button>
                </div>
                <div className="w-full">
                  <SearchBoardForm
                    disabled={
                      boardsLoading || boardsError || boards.length <= 0
                    }
                    onSearch={(query) => setBoardFilter(query)}
                  />
                </div>
              </div>
              <div className="hidden md:flex space-y-0 flex-row items-center justify-between">
                <h1 className="text-xl text-gray-800 dark:text-white">
                  Your Boards
                </h1>
                <div className="w-full md:w-1/2">
                  <SearchBoardForm
                    disabled={
                      boardsLoading || boardsError || boards.length <= 0
                    }
                    onSearch={(query) => setBoardFilter(query)}
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center bg-transparent text-amber-500 disabled:opacity-50 hover:brightness-110"
                  onClick={() => setShowCreateBoardModal(true)}
                >
                  <PlusIcon className="h-6 w-6" aria-hidden="true" />
                  <div className="ml-2">Add board</div>
                </button>
              </div>
              <hr className="border-gray-300 dark:border-gray-400" />
              {!(boardsLoading || boardsError || boards.length <= 0) &&
                boardFilter && (
                  <div className="flex max-w-full">
                    <div className="block max-w-full p-2 leading-none text-center whitespace-nowrap align-baseline font-bold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => setBoardFilter(null)}
                        className="rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white disabled:opacity-50"
                      >
                        <XIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <div className="truncate p-1">
                        <span className="font-normal">Filter:</span>
                        &nbsp;
                        {boardFilter}
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <div className="flex flex-col space-y-4">
              {(boardsLoading || boardsError) && (
                <div className="w-full relative">
                  {boardsError && (
                    <button
                      type="button"
                      className="group absolute top-2 left-2 flex items-start space-x-2 text-red-500"
                    >
                      <div className="rounded-full p-1 bg-gray-100 dark:bg-gray-700 opacity-80">
                        <ExclamationIcon className="h-6" />
                      </div>
                      <div className="invisible group-hover:visible group-focus:visible bg-gray-100 dark:bg-gray-700 rounded-md shadow-md text-xs p-2 opacity-80 max-w-xs line-clamp-4">
                        {boardsError}
                      </div>
                    </button>
                  )}
                  <div className="flex flex-wrap gap-4">
                    {[...Array(4).keys()].map((key) => (
                      <BoardThumbnailSkeleton key={key} error={boardsError} />
                    ))}
                  </div>
                </div>
              )}
              {!boardsLoading && !boardsError && boards.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {boards.map((board) => (
                    <BoardThumbnail key={board.id} board={board} />
                  ))}
                </div>
              )}
              {!boardsLoading && !boardsError && boards.length <= 0 && (
                <p className="text-center text-gray-800 dark:text-white">
                  No boards available.
                </p>
              )}
              {!boardsLoading && !boardsError && boards.length > 0 && (
                <Pagination
                  currentPage={boardsPageable.page}
                  perPage={boardsPageable.perPage}
                  totalElements={boardsPageable.totalElements}
                  onChange={(page) => setBoardPage(page)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
