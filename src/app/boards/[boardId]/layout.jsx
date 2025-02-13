import AuthGuard from "@/components/organisms/AuthGuard";
import StackTemplate from "@/components/templates/StackTemplate";
import BoardNavbar from "@/components/organisms/board/BoardNavbar";

export const metadata = {
  title: "TaskCare | Board"
};

export default function BoardLayout({ children }) {
  return (
    <AuthGuard>
      <StackTemplate>
        <div className="grow flex flex-col">
          <BoardNavbar />
          {children}
        </div>
      </StackTemplate>
    </AuthGuard>
  );
}
