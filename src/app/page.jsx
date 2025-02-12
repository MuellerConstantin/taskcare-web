import { redirect } from "next/navigation";

export default function Root() {
  redirect("/boards/me");
}
