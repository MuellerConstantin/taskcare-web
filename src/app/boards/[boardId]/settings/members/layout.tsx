import type { Metadata } from "next";
import BoardRoleGuard from "@/components/organisms/BoardRoleGuard";

export const metadata: Metadata = {
  title: "TaskCare | Board Members Settings",
};

export default function BoardMembersSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BoardRoleGuard roles={["ADMINISTRATOR"]}>{children}</BoardRoleGuard>;
}
