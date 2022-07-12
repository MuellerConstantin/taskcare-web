import DeleteAccountModal from "./DeleteAccountModal";
import Button from "../atoms/Button";

export default function DeleteAccountForm({ username, onChange, disabled }) {
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
        <DeleteAccountModal
          username={username}
          onSubmit={() => {
            if (onChange) onChange();
          }}
        >
          <Button
            type="button"
            disabled={disabled}
            className="bg-red-500 focus:outline-red-500"
          >
            Delete your account
          </Button>
        </DeleteAccountModal>
      </div>
    </div>
  );
}
