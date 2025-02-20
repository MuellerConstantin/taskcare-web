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

export default function StatusRemoveDialog({show, boardId, onRemove, onClose, statusIds}) {
  const api = useApi();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const removeStatuses = useCallback(async () => {
    setLoading(true);
    setError(null);

    Promise.all(statusIds.map((id) => api.delete(`/boards/${boardId}/statuses/${id}`)))
    .then(onRemove)
    .catch((err) => {
      setError("An unexpected error occurred, please retry!");
    })
    .finally(() => {
      setLoading(false);
    });
  }, [api, boardId, onRemove, statusIds]);

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>
        {statusIds.length > 1 ? "Remove Statuses" : "Remove Status"}
      </Modal.Header>
      <Modal.Body className="space-y-4 flex flex-col text-gray-900 dark:text-white">
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}
        <p>
          Are you sure you want to remove
          {statusIds.length > 1 ?
            (<span>
              <span className="font-semibold"> {statusIds.length} </span>
              <span>statuses</span>
            </span>) :
            " this status"
          }?
        </p>
        <p className="text-xs">
          This action cannot be undone. {statusIds.length > 1 ? "These statuses" : "This status"} will
          be permanently deleted all the related tasks will be moved to the default status. A possibly
          linked board layout column will also be deleted.
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button
          theme={customYesButtonTheme}
          color="amber"
          disabled={loading}
          onClick={removeStatuses}
        >
          {!loading && <span>Remove Status</span>}
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
