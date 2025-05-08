import type { Metadata } from "next";
import BoardRoleGuard from "@/components/organisms/BoardRoleGuard";

export const metadata: Metadata = {
  title: "TaskCare | Board General Settings",
};

export default function BoardGeneralSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BoardRoleGuard roles={["ADMINISTRATOR"]}>{children}</BoardRoleGuard>;
}
