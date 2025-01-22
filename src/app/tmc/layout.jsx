import AuthGuard from "@/components/organisms/AuthGuard";

export const metadata = {
  title: "TaskCare | TMC"
};

export default function TmcLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
