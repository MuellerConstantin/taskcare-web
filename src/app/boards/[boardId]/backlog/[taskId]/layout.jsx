import BacklogTaskListSidebar from "@/components/organisms/task/BacklogTaskListSidebar";

export const metadata = {
  title: "TaskCare | Board - Backlog"
};

export default function BoardBacklogTaskLayout({ children }) {
  return (
    <div className="grow flex flex-col">
      <div className="flex flex-col md:flex-row grow w-full max-w-screen-2xl mx-auto">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 h-full flex max-h-[20rem] md:max-h-[40rem]">
          <BacklogTaskListSidebar />
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 p-4 flex flex-col space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
