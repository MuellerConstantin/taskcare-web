import BoardRoleGuard from "@/components/organisms/BoardRoleGuard";

export const metadata = {
  title: "TaskCare | Board - Settings"
};

export default function BoardSettingsGeneralLayout({ children }) {
  return (
    <BoardRoleGuard roles={["ADMINISTRATOR"]}>
      {children}
    </BoardRoleGuard>
  );
}
