import AuthGuard from "@/components/organisms/AuthGuard";
import StackTemplate from "@/components/templates/StackTemplate";
import BoardNavbar from "@/components/organisms/board/BoardNavbar";
import BoardMemberGuard from "@/components/organisms/BoardMemberGuard";

export const metadata = {
  title: "TaskCare | Board",
};

export default function BoardLayout({ children }) {
  return (
    <AuthGuard>
      <BoardMemberGuard>
        <StackTemplate>
          <div className="flex grow flex-col">
            <BoardNavbar />
            {children}
          </div>
        </StackTemplate>
      </BoardMemberGuard>
    </AuthGuard>
  );
}
