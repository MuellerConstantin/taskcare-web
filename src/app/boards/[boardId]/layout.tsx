import type { Metadata } from "next";
import { StackTemplate } from "@/components/templates/StackTemplate";
import AuthGuard from "@/components/organisms/AuthGuard";
import { BoardNavbar } from "@/components/organisms/board/BoardNavbar";

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
      <StackTemplate>
        <div className="flex grow flex-col">
          <BoardNavbar />
          {children}
        </div>
      </StackTemplate>
    </AuthGuard>
  );
}
