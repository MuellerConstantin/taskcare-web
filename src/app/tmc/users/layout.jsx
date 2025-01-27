import AuthGuard from "@/components/organisms/AuthGuard";

export const metadata = {
  title: "TaskCare | TMC - Users"
};

export default function TmcUsersLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
