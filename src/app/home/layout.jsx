import AuthGuard from "@/components/organisms/AuthGuard";
import StackTemplate from "@/components/templates/StackTemplate";

export const metadata = {
  title: "TaskCare | Home"
};

export default function HomeLayout({ children }) {
  return (
    <AuthGuard>
      <StackTemplate>
        {children}
      </StackTemplate>
    </AuthGuard>
  );
}
