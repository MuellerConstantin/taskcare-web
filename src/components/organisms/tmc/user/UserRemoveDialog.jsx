import { useState, useCallback } from "react";
import { Button, Modal, Spinner } from "flowbite-react";
import useApi from "@/hooks/useApi";

const customYesButtonTheme = {
  color: {
    amber:
      "border border-transparent bg-amber-500 text-white focus:ring-4 focus:ring-amber-300 enabled:hover:bg-amber-600 dark:focus:ring-amber-900",
  },
};

const customNoButtonTheme = {
  color: {
    light:
      "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  },
};

export default function UserRemoveDialog({ show, onRemove, onClose, userIds }) {
  const api = useApi();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const removeUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    Promise.all(userIds.map((id) => api.delete(`/users/${id}`)))
      .then(onRemove)
      .catch((err) => {
        if (
          err.response &&
          err.response.status === 409 &&
          err.response.data?.error === "IllegalDefaultAdminAlterationError"
        ) {
          setError("You cannot remove the default admin user!");
        } else {
          setError("An unexpected error occurred, please retry!");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api, userIds]);

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>
        {userIds.length > 1 ? "Remove Users" : "Remove User"}
      </Modal.Header>
      <Modal.Body className="flex flex-col space-y-4 text-gray-900 dark:text-white">
        {error && <p className="text-center text-red-500">{error}</p>}
        <p>
          Are you sure you want to remove
          {userIds.length > 1 ? (
            <span>
              <span className="font-semibold"> {userIds.length} </span>
              <span>users</span>
            </span>
          ) : (
            " this user"
          )}
          ?
        </p>
        <p className="text-xs">
          This action cannot be undone.{" "}
          {userIds.length > 1 ? "These users" : "This user"} will be permanently
          deleted all its resources and their data will be lost or transfered to
          another users.
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button
          theme={customYesButtonTheme}
          color="amber"
          disabled={loading}
          onClick={removeUsers}
        >
          {!loading && <span>Remove User</span>}
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
