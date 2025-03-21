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

export default function ComponentRemoveDialog({
  show,
  boardId,
  onRemove,
  onClose,
  componentIds,
}) {
  const api = useApi();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const removeComponentes = useCallback(async () => {
    setLoading(true);
    setError(null);

    Promise.all(
      componentIds.map((id) =>
        api.delete(`/boards/${boardId}/components/${id}`),
      ),
    )
      .then(onRemove)
      .catch((err) => {
        setError("An unexpected error occurred, please retry!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api, boardId, onRemove, componentIds]);

  return (
    <Modal size="md" show={show} onClose={onClose}>
      <Modal.Header>
        {componentIds.length > 1 ? "Remove Componentes" : "Remove Component"}
      </Modal.Header>
      <Modal.Body className="flex flex-col space-y-4 text-gray-900 dark:text-white">
        {error && <p className="text-center text-red-500">{error}</p>}
        <p>
          Are you sure you want to remove
          {componentIds.length > 1 ? (
            <span>
              <span className="font-semibold"> {componentIds.length} </span>
              <span>components</span>
            </span>
          ) : (
            " this component"
          )}
          ?
        </p>
        <p className="text-xs">
          This action cannot be undone.{" "}
          {componentIds.length > 1 ? "These components" : "This component"} will
          be permanently deleted all the related tasks will be moved to the
          default component. A possibly linked board layout column will also be
          deleted.
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button
          theme={customYesButtonTheme}
          color="amber"
          disabled={loading}
          onClick={removeComponentes}
        >
          {!loading && <span>Remove Component</span>}
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
