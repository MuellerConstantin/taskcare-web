import BacklogTaskListSidebar from "@/components/organisms/task/BacklogTaskListSidebar";

export const metadata = {
  title: "TaskCare | Board - Backlog",
};

export default function BoardBacklogTaskLayout({ children }) {
  return (
    <div className="flex grow flex-col">
      <div className="mx-auto flex w-full max-w-screen-2xl grow flex-col md:flex-row">
        <div className="flex h-full max-h-[20rem] w-full p-4 md:max-h-[40rem] md:w-1/3 lg:w-1/4">
          <BacklogTaskListSidebar />
        </div>
        <div className="flex w-full flex-col space-y-4 p-4 md:w-2/3 lg:w-3/4 xl:w-4/5">
          {children}
        </div>
      </div>
    </div>
  );
}
