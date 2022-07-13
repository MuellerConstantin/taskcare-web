import Avatar from "../atoms/Avatar";
import Link from "../atoms/Link";

export default function MemberThumbnail({ member }) {
  return (
    <div className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white p-4 flex items-center space-x-4">
      <div className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white p-1 rounded-lg">
        <div className="h-12 aspect-square">
          <Avatar value={member.username} />
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="overflow-hidden">
          <Link
            className="text-lg font-semibold truncate !text-gray-800 dark:!text-white"
            to="/"
          >
            {member.username}
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-ellipsis">
            {member.role}
          </p>
        </div>
      </div>
    </div>
  );
}
