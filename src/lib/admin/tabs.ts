export type AdminTab = "pending" | "active" | "deleted" | "settings";

export function parseAdminTab(value: string | undefined): AdminTab {
  if (value === "active" || value === "deleted" || value === "settings") {
    return value;
  }
  return "pending";
}

export function adminTabHref(tab: AdminTab): string {
  return tab === "pending" ? "/admin" : `/admin?tab=${tab}`;
}

export function isListingsAdminTab(
  tab: AdminTab
): tab is Exclude<AdminTab, "settings"> {
  return tab !== "settings";
}
