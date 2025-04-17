import { StackTemplate } from "@/components/templates/StackTemplate";

export const metadata = {
  title: "TaskCare | Unsufficient Permissions",
};

export default function UnsufficientPermissionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StackTemplate>{children}</StackTemplate>;
}
