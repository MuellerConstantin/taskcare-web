import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskCare | Board Layout Settings",
};

export default function BoardLayoutSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
