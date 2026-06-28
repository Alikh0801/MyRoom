import { createClient } from "@/lib/supabase/server";
import { getFavoriteListingIds } from "@/lib/queries/favorites";

export interface FavoritePageContext {
  isLoggedIn: boolean;
  favoriteIds: Set<string>;
}

export async function getFavoritePageContext(): Promise<FavoritePageContext> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  if (!user) {
    return { isLoggedIn: false, favoriteIds: new Set() };
  }

  const favoriteIds = await getFavoriteListingIds(user.id);
  return { isLoggedIn: true, favoriteIds: new Set(favoriteIds) };
}
