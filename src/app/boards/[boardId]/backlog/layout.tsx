import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskCare | Board Backlog",
};

export default function BoardBacklogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
