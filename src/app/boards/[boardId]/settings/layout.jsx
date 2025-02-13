import Sidebar from "@/components/organisms/board/settings/Sidebar";
import BoardRoleGuard from "@/components/organisms/BoardRoleGuard";

export const metadata = {
  title: "TaskCare | Board - Settings"
};

export default function BoardSettingsLayout({ children }) {
  return (
    <BoardRoleGuard roles={["ADMINISTRATOR", "MAINTAINER"]}>
      <div className="grow flex flex-col">
        <div className="flex flex-col md:flex-row grow w-full max-w-screen-2xl mx-auto">
          <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
            <Sidebar />
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 p-4 flex flex-col space-y-4">
            {children}
          </div>
        </div>
      </div>
    </BoardRoleGuard>
  );
}
