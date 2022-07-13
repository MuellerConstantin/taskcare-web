import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ExclamationIcon } from "@heroicons/react/solid";
import MemberThumbnail from "../molecules/MemberThumbnail";
import MemberThumbnailSkeleton from "../molecules/MemberThumbnailSkeleton";
import { fetchMembers } from "../../api/members";

export default function MemberList({ boardId }) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  const onFetchMembers = useCallback(
    async (id) => {
      setError(null);

      try {
        const membersRes = await fetchMembers(id);
        setMembers(membersRes.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/logout");
        } else if (err.response && err.response.status === 404) {
          navigate("/not-found");
        } else {
          setError("The board member's information could not be loaded.");
        }

        throw err;
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (boardId) {
      setLoading(true);

      onFetchMembers(boardId).finally(() => setLoading(false));
    }
  }, [boardId, onFetchMembers]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {error}
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
            <MemberThumbnail key={member.username} member={member} />
          ))}
      </div>
      {!loading && !error && members.length <= 0 && (
        <p className="text-center text-gray-800 dark:text-white">
          No members available.
        </p>
      )}
    </div>
  );
}
