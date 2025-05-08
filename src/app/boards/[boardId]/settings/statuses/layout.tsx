import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskCare | Board Statuses Settings",
};

export default function BoardStatusesSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
