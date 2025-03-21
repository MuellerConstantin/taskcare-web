import AuthGuard from "@/components/organisms/AuthGuard";
import StackTemplate from "@/components/templates/StackTemplate";
import Sidebar from "@/components/organisms/tmc/Sidebar";
import SystemRoleGuard from "@/components/organisms/SystemRoleGuard";

export const metadata = {
  title: "TaskCare | TMC",
};

export default function TmcLayout({ children }) {
  return (
    <AuthGuard>
      <SystemRoleGuard roles={["ADMINISTRATOR"]}>
        <StackTemplate>
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
        </StackTemplate>
      </SystemRoleGuard>
    </AuthGuard>
  );
}
