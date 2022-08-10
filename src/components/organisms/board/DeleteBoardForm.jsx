import { useState } from "react";
import BoardDeletionModal from "./DeleteBoardModal";
import Button from "../../atoms/Button";

export default function DeleteBoardForm({ boardId, onChange, disabled }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="text-gray-800 dark:text-white space-y-4">
      <div>
        <h2 className="text-2xl text-red-500">Delete this board</h2>
        <hr className="border-red-500 mt-2" />
      </div>
      <p>
        This will permanently delete this board. Warning, this cannot be undone.
        All created tasks are irrevocably lost.
      </p>
      <div className="w-full">
        <BoardDeletionModal
          boardId={boardId}
          onSubmit={() => {
            setShowDeleteModal(false);
            if (onChange) onChange();
          }}
          onClose={() => setShowDeleteModal(false)}
          isOpen={showDeleteModal}
        />
        <Button
          type="button"
          disabled={disabled}
          className="bg-red-500 focus:outline-red-500"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete this board
        </Button>
      </div>
    </div>
  );
}
