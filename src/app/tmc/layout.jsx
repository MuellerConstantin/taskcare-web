import AuthGuard from "@/components/organisms/AuthGuard";
import StackTemplate from "@/components/templates/StackTemplate";
import Sidebar from "@/components/organisms/tmc/Sidebar";

export const metadata = {
  title: "TaskCare | TMC"
};

export default function TmcLayout({ children }) {
  return (
    <AuthGuard>
      <StackTemplate>
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
      </StackTemplate>
    </AuthGuard>
  );
}
