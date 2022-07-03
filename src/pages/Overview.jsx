import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";
import Button from "../components/atoms/Button";
import BoardThumbnail from "../components/molecules/BoardThumbnail";
import BoardThumbnailSkeleton from "../components/molecules/BoardThumbnailSkeleton";
import StackTemplate from "../components/templates/StackTemplate";
import { fetchBoardsByMembership } from "../api/boards";

export default function Overview() {
  const navigate = useNavigate();

  const principal = useSelector((state) => state.auth.principal);

  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState([]);
  const [pageable, setPageable] = useState(null);

  const onFetchBoards = async (_page) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchBoardsByMembership(principal.username, _page);

      setBoards(res.data.content);
      setPageable({
        perPage: res.data.perPage,
        page: res.data.page,
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
      });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/logout");
      } else {
        setError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "TaskCare | Overview";
  }, []);

  useEffect(() => {
    if (!loading) {
      onFetchBoards(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="xl:container mx-auto p-4">
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <h1 className="text-xl text-gray-800 dark:text-white">
                Your Boards
              </h1>
              <hr className="border-gray-300 dark:border-gray-400" />
            </div>
            {loading && (
              <div className="flex flex-wrap gap-4">
                {[...Array(4).keys()].map((key) => (
                  <BoardThumbnailSkeleton key={key} />
                ))}
              </div>
            )}
            {!loading && error && (
              <p className="text-center text-red-500">{error}</p>
            )}
            {!loading && !error && boards.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {boards.map((board) => (
                  <BoardThumbnail
                    key={board.id}
                    id={board.id}
                    name={board.name}
                    description={board.description}
                  />
                ))}
              </div>
            )}
            {!loading && !error && boards.length <= 0 && (
              <p className="text-center text-gray-800 dark:text-white">
                No boards available.
              </p>
            )}
            {!loading && boards.length > 0 && (
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  Showing&nbsp;
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pageable.page * pageable.perPage + 1}
                  </span>
                  &nbsp;to&nbsp;
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.min(
                      pageable.page * pageable.perPage + pageable.perPage,
                      pageable.totalElements
                    )}
                  </span>
                  &nbsp;of&nbsp;
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pageable.totalElements}
                  </span>
                  &nbsp;Boards
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <Button
                    disabled={pageable.page * pageable.perPage + 1 <= 1}
                    className="border-r-0 rounded-r-none inline-flex bg-green-500 focus:outline-green-500"
                    onClick={() => setCurrentPage(pageable.page - 1)}
                  >
                    <ArrowLeftIcon
                      className="h-6 w-6 mr-2"
                      aria-hidden="true"
                    />
                    Prev
                  </Button>
                  <Button
                    disabled={
                      Math.min(
                        pageable.page * pageable.perPage + pageable.perPage,
                        pageable.totalElements
                      ) >= pageable.totalElements
                    }
                    className="border-l-0 rounded-l-none inline-flex bg-green-500 focus:outline-green-500"
                    onClick={() => setCurrentPage(pageable.page + 1)}
                  >
                    Next
                    <ArrowRightIcon
                      className="h-6 w-6 ml-2"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
