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

export default function MemberRemoveDialog({show, boardId, onRemove, onClose, memberIds}) {
  const api = useApi();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const removeMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    Promise.all(memberIds.map((id) => api.delete(`/boards/${boardId}/members/${id}`)))
    .then(onRemove)
    .catch((err) => {
      if(err.response &&
        err.response.status === 409 &&
        err.response.data?.error === "BoardMustBeAdministrableError") {
        setError("You cannot remove the only admin from the board!");
      } else {
        setError("An unexpected error occurred, please retry!");
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [api, boardId, onRemove, memberIds]);

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>
        {memberIds.length > 1 ? "Remove Members" : "Remove Member"}
      </Modal.Header>
      <Modal.Body className="space-y-4 flex flex-col text-gray-900 dark:text-white">
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}
        <p>
          Are you sure you want to remove
          {memberIds.length > 1 ?
            (<span>
              <span className="font-semibold"> {memberIds.length} </span>
              <span>members</span>
            </span>) :
            " this member"
          }?
        </p>
        <p className="text-xs">
          This action cannot be undone. {memberIds.length > 1 ? "These members" : "This member"} will
          be permanently removed from the board. Please be certain before proceeding.
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button
          theme={customYesButtonTheme}
          color="amber"
          disabled={loading}
          onClick={removeMembers}
        >
          {!loading && <span>Remove Member</span>}
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
