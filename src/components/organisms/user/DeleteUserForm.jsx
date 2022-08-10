import { useState } from "react";
import DeleteUserModal from "./DeleteUserModal";
import Button from "../../atoms/Button";

export default function DeleteUserForm({ username, onChange, disabled }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="text-gray-800 dark:text-white space-y-4">
      <div>
        <h2 className="text-2xl text-red-500">Delete your account</h2>
        <hr className="border-red-500 mt-2" />
      </div>
      <p>
        This will permanently delete your account. Attention all your chats will
        be deleted and the use of your username will be released for other
        users.
      </p>
      <div className="w-full">
        <DeleteUserModal
          username={username}
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
          Delete your account
        </Button>
      </div>
    </div>
  );
}
