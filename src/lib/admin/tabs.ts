export type AdminTab = "pending" | "active" | "deleted" | "settings";

export function parseAdminTab(value: string | undefined): AdminTab {
  if (value === "active" || value === "deleted" || value === "settings") {
    return value;
  }
  return "pending";
}

export function adminTabHref(
  tab: AdminTab,
  filters?: { q?: string; sort?: string; vip?: string }
): string {
  const params = new URLSearchParams();

  if (tab !== "pending") {
    params.set("tab", tab);
  }

  const query = filters?.q?.trim();
  if (query) {
    params.set("q", query);
  }

  if (filters?.sort && filters.sort !== "newest") {
    params.set("sort", filters.sort);
  }

  if (
    tab !== "deleted" &&
    filters?.vip &&
    filters.vip !== "all"
  ) {
    params.set("vip", filters.vip);
  }

  const qs = params.toString();
  if (!qs) {
    return "/admin";
  }

  return `/admin?${qs}`;
}

export function isListingsAdminTab(
  tab: AdminTab
): tab is Exclude<AdminTab, "settings"> {
  return tab !== "settings";
}
