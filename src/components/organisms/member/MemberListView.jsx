import { useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { ExclamationIcon, PlusIcon } from "@heroicons/react/solid";
import MemberThumbnail from "../../molecules/member/MemberThumbnail";
import MemberThumbnailSkeleton from "../../molecules/member/MemberThumbnailSkeleton";
import CreateMemberModal from "./CreateMemberModal";
import EditableMemberThumbnail from "./EditableMemberThumbnail";
import { fetchMembers } from "../../../store/slices/members";

export default function MemberListView() {
  const dispatch = useDispatch();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const { currentMember, board } = useSelector(
    (state) => state.board,
    shallowEqual
  );

  const { loading, error, members } = useSelector(
    (state) => state.members,
    shallowEqual
  );

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-end">
        <CreateMemberModal
          boardId={board.id}
          onSubmit={() => {
            setShowCreateModal(false);
            dispatch(fetchMembers(board.id));
          }}
          onClose={() => setShowCreateModal(false)}
          isOpen={showCreateModal}
        />
        <button
          type="button"
          className="inline-flex items-center justify-center bg-transparent text-amber-500 disabled:opacity-50"
          onClick={() => setShowCreateModal(true)}
          disabled={currentMember?.role !== "ADMINISTRATOR"}
        >
          <PlusIcon className="h-6 w-6" aria-hidden="true" />
          <div className="ml-2">Create member</div>
        </button>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
          {(loading || error) &&
            [...Array(4).keys()].map((key) => (
              <div key={key} className="w-full relative">
                {error && (
                  <button
                    type="button"
                    className="group absolute top-2 left-2 flex items-start space-x-2 text-red-500"
                  >
                    <div className="rounded-full p-1 bg-gray-100 dark:bg-gray-700 opacity-80">
                      <ExclamationIcon className="h-6" />
                    </div>
                    <div className="invisible group-hover:visible group-focus:visible bg-gray-100 dark:bg-gray-700 rounded-md shadow-md text-xs p-2 opacity-80 max-w-xs line-clamp-4">
                      Loading the board members failed.
                    </div>
                  </button>
                )}
                <MemberThumbnailSkeleton error={error} />
              </div>
            ))}
          {!loading &&
            !error &&
            members.length > 0 &&
            members.map((member) => (
              <div className="flex" key={member.username}>
                {currentMember && currentMember.role === "ADMINISTRATOR" ? (
                  <EditableMemberThumbnail
                    boardId={board.id}
                    member={member}
                    onSubmit={() => dispatch(fetchMembers(board.id))}
                  />
                ) : (
                  <MemberThumbnail member={member} />
                )}
              </div>
            ))}
        </div>
        {!loading && !error && members.length <= 0 && (
          <p className="text-center text-gray-800 dark:text-white">
            No members available.
          </p>
        )}
      </div>
    </div>
  );
}
