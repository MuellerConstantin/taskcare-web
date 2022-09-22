import { useState } from "react";
import { Popover } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { usePopper } from "react-popper";
import MemberThumbnail from "../../molecules/member/MemberThumbnail";
import UpdateMemberModal from "./UpdateMemberModal";
import DeleteMemberModal from "./DeleteMemberModal";

export default function EditableMemberThumbnail({ boardId, member, onSubmit }) {
  const [popupButtonElement, setPopupButtonElement] = useState();
  const [popupDialogElement, setPopupDialogElement] = useState();
  const { styles, attributes } = usePopper(
    popupButtonElement,
    popupDialogElement,
    {
      placement: "bottom-start",
      modifiers: [
        {
          name: "flip",
          options: {
            fallbackPlacements: [
              "bottom-end",
              "top-start",
              "top-end",
              "left",
              "right",
            ],
          },
        },
      ],
    }
  );

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  return (
    <div className="flex w-full" key={member.username}>
      <MemberThumbnail member={member} />
      <DeleteMemberModal
        boardId={boardId}
        username={member.username}
        isOpen={showRemoveModal}
        onSubmit={() => {
          setShowRemoveModal(false);
          if (onSubmit) onSubmit();
        }}
        onClose={() => {
          setShowRemoveModal(false);
        }}
      />
      <UpdateMemberModal
        boardId={boardId}
        member={member}
        isOpen={showUpdateModal}
        onSubmit={() => {
          setShowUpdateModal(false);
          if (onSubmit) onSubmit();
        }}
        onClose={() => {
          setShowUpdateModal(false);
        }}
      />
      <Popover className="relative">
        {() => (
          <>
            <Popover.Button
              ref={setPopupButtonElement}
              className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              <DotsVerticalIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
            <Popover.Panel
              ref={setPopupDialogElement}
              className="shadow-md border dark:border-gray-900 rounded-md z-10 w-screen max-w-xs sm:max-w-sm bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
              style={styles.popper}
              {...attributes.popper}
            >
              <div className="p-2 text-gray-800 dark:text-white flex flex-col space-y-2">
                <button
                  type="button"
                  className="flex justify-left items-center p-2 hover:bg-gray-100 hover:cursor-pointer hover:dark:bg-gray-700 rounded"
                  onClick={() => setShowUpdateModal(true)}
                >
                  <div className="text-sm">Update</div>
                </button>
                <button
                  type="button"
                  className="flex justify-left items-center p-2 hover:bg-gray-100 hover:cursor-pointer hover:dark:bg-gray-700 rounded"
                  onClick={() => setShowRemoveModal(true)}
                >
                  <div className="text-sm">Remove</div>
                </button>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
}
