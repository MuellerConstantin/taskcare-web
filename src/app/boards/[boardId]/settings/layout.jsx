import Sidebar from "@/components/organisms/board/settings/Sidebar";
import BoardRoleGuard from "@/components/organisms/BoardRoleGuard";

export const metadata = {
  title: "TaskCare | Board - Settings",
};

export default function BoardSettingsLayout({ children }) {
  return (
    <BoardRoleGuard roles={["ADMINISTRATOR", "MAINTAINER"]}>
      <div className="flex grow flex-col">
        <div className="mx-auto flex w-full max-w-screen-2xl grow flex-col md:flex-row">
          <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
            <Sidebar />
          </div>
          <div className="flex w-full flex-col space-y-4 p-4 md:w-2/3 lg:w-3/4 xl:w-4/5">
            {children}
          </div>
        </div>
      </div>
    </BoardRoleGuard>
  );
}
