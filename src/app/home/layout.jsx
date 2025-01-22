import AuthGuard from "@/components/organisms/AuthGuard";

export const metadata = {
  title: "TaskCare | Home"
};

export default function HomeLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
