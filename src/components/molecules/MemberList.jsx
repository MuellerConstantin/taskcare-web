import { ExclamationIcon } from "@heroicons/react/solid";
import MemberThumbnail from "./MemberThumbnail";
import MemberThumbnailSkeleton from "./MemberThumbnailSkeleton";

export default function MemberList({ members, error, loading }) {
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
