import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskCare | Board Settings",
};

export default function BoardSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
