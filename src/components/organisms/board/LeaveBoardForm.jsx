import { useState } from "react";
import LeaveBoardModal from "./LeaveBoardModal";
import Button from "../../atoms/Button";

export default function LeaveBoardForm({ boardId, onChange, disabled }) {
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  return (
    <div className="text-gray-800 dark:text-white space-y-4">
      <div>
        <h2 className="text-2xl text-red-500">Leave this board</h2>
        <hr className="border-red-500 mt-2" />
      </div>
      <p>
        This action will remove you as a member of this board. This will remove
        all read and write permissions for this board and you will no longer be
        able to see it.
      </p>
      <div className="w-full">
        <LeaveBoardModal
          boardId={boardId}
          onSubmit={() => {
            setShowLeaveModal(false);
            if (onChange) onChange();
          }}
          onClose={() => setShowLeaveModal(false)}
          isOpen={showLeaveModal}
        />
        <Button
          type="button"
          disabled={disabled}
          className="bg-red-500 focus:outline-red-500"
          onClick={() => setShowLeaveModal(true)}
        >
          Leave this board
        </Button>
      </div>
    </div>
  );
}
