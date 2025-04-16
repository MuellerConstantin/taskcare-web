import type { Metadata } from "next";
import { StackTemplate } from "@/components/templates/StackTemplate";
import AuthGuard from "@/components/organisms/AuthGuard";

export const metadata: Metadata = {
  title: "TaskCare | Board",
};

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <StackTemplate>{children}</StackTemplate>
    </AuthGuard>
  );
}
