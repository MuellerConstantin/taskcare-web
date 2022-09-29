import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XIcon, UserAddIcon } from "@heroicons/react/solid";
import Avatar from "../../atoms/Avatar";
import UpdateTaskResponsibleModal from "./UpdateTaskResponsibleModal";
import { updateTask } from "../../../api/tasks";

export default function ChangeTaskResponsibleForm({
  boardId,
  taskId,
  currentResponsible,
  members,
  disabled,
  onChange,
}) {
  const navigate = useNavigate();

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const onClearResponsible = async () => {
    const update = {
      responsible: null,
    };

    try {
      await updateTask(boardId, taskId, update);
      if (onChange) onChange();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/logout");
      }

      throw err;
    }
  };

  if (currentResponsible) {
    return (
      <div className="flex flex-col items-center space-y-1">
        <button
          type="button"
          className="relative group bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white p-2 rounded-full disabled:opacity-50 hover:brightness-110 w-fit"
          disabled={disabled}
          onClick={() => onClearResponsible()}
        >
          <div className="h-5 aspect-square rounded-full">
            <Avatar value={currentResponsible} />
          </div>
          <div className="absolute flex justify-center items-center invisible group-hover:visible inset-0 w-full h-full bg-gray-600 text-white dark:bg-gray-200 dark:text-gray-800 rounded-full">
            <XIcon className="h-5 w-5" aria-label="Remove" />
          </div>
        </button>
        <div className="text-xs">{currentResponsible}</div>
      </div>
    );
  }

  return (
    <div>
      <UpdateTaskResponsibleModal
        boardId={boardId}
        taskId={taskId}
        currentResponsible={currentResponsible}
        members={members}
        onSubmit={() => {
          setShowUpdateModal(false);
          if (onChange) onChange();
        }}
        onClose={() => setShowUpdateModal(false)}
        isOpen={showUpdateModal}
      />
      <button
        type="button"
        className="relative group bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white p-2 rounded-full disabled:opacity-50 hover:brightness-110"
        onClick={() => setShowUpdateModal(true)}
        disabled={disabled}
      >
        <UserAddIcon className="h-5 w-5" aria-label="Remove" />
      </button>
    </div>
  );
}
