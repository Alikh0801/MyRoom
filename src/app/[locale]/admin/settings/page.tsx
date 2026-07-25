import { redirect } from "next/navigation";

/** Köhnə URL — admin paneldəki Bank kartı tabına yönləndirir */
export default function AdminSettingsRedirectPage() {
  redirect("/admin?tab=settings");
}
