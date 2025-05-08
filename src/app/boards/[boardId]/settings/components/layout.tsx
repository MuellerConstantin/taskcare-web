import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskCare | Board Components Settings",
};

export default function BoardComponentsSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
