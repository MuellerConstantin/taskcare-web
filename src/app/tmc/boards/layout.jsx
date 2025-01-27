import AuthGuard from "@/components/organisms/AuthGuard";

export const metadata = {
  title: "TaskCare | TMC - Boards"
};

export default function TmcBoardsLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
