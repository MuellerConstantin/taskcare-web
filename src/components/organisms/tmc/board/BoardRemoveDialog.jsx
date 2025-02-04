import { useState, useCallback } from "react";
import { Button, Modal, Spinner } from "flowbite-react";
import useApi from "@/hooks/useApi";

const customYesButtonTheme = {
  "color": {
    "amber": "border border-transparent bg-amber-500 text-white focus:ring-4 focus:ring-amber-300 enabled:hover:bg-amber-600 dark:focus:ring-amber-900"
  }
};

const customNoButtonTheme = {
  "color": {
    "light": "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  }
};

export default function BoardRemoveDialog({show, onRemove, onClose, boardIds}) {
  const api = useApi();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const removeBoards = useCallback(async () => {
    setLoading(true);
    setError(null);

    Promise.all(boardIds.map((id) => api.delete(`/boards/${id}`)))
    .then(onRemove)
    .catch((err) => {
      setError("An unexpected error occurred, please retry!");
    })
    .finally(() => {
      setLoading(false);
    });
  }, [api, boardIds]);

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>
        {boardIds.length > 1 ? "Remove Boards" : "Remove Board"}
      </Modal.Header>
      <Modal.Body className="space-y-4 flex flex-col text-gray-900 dark:text-white">
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}
        <p>
          Are you sure you want to remove
          {boardIds.length > 1 ?
            (<span>
              <span className="font-semibold"> {boardIds.length} </span>
              <span>boards</span>
            </span>) :
            " this board"
          }?
        </p>
        <p className="text-xs">
          This action cannot be undone. {boardIds.length > 1 ? "These boards" : "This board"} will
          be permanently deleted all its resources and their data will be lost.
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button
          theme={customYesButtonTheme}
          color="amber"
          disabled={loading}
          onClick={removeBoards}
        >
          {!loading && <span>Remove Board</span>}
          {loading && <Spinner size="sm" className="fill-white" />}
        </Button>
        <Button
          theme={customNoButtonTheme}
          color="light"
          onClick={onClose}
          disabled={loading}
        >
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
