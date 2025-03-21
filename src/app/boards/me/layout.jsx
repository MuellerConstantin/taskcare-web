import AuthGuard from "@/components/organisms/AuthGuard";
import StackTemplate from "@/components/templates/StackTemplate";

export const metadata = {
  title: "TaskCare | My Boards",
};

export default function MyBoardsLayout({ children }) {
  return (
    <AuthGuard>
      <StackTemplate>{children}</StackTemplate>
    </AuthGuard>
  );
}
