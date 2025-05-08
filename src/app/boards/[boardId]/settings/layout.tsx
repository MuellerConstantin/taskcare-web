import type { Metadata } from "next";
import BoardRoleGuard from "@/components/organisms/BoardRoleGuard";

export const metadata: Metadata = {
  title: "TaskCare | Board Settings",
};

export default function BoardSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BoardRoleGuard roles={["ADMINISTRATOR", "MAINTAINER"]}>
      {children}
    </BoardRoleGuard>
  );
}
