export type AdminTab = "pending" | "active" | "deleted";

export function parseAdminTab(value: string | undefined): AdminTab {
  if (value === "active" || value === "deleted") return value;
  return "pending";
}

export function adminTabHref(tab: AdminTab): string {
  return tab === "pending" ? "/admin" : `/admin?tab=${tab}`;
}
