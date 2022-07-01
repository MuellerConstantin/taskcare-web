import { useEffect } from "react";
import StackTemplate from "../components/templates/StackTemplate";

export default function Overview() {
  useEffect(() => {
    document.title = "TaskCare | Overview";
  }, []);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600" />
    </StackTemplate>
  );
}
