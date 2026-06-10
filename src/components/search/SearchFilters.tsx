"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import type { Category } from "@/types/database";

interface SearchFiltersProps {
  categories: Category[];
  regions: string[];
}

export function SearchFilters({ categories, regions }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [region, setRegion] = useState(searchParams.get("region") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [guests, setGuests] = useState(searchParams.get("guests") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    if (category) params.set("category", category);
    if (guests) params.set("guests", guests);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/search?${params.toString()}`);
  }, [region, category, guests, minPrice, maxPrice, router]);

  const clearFilters = () => {
    setRegion("");
    setCategory("");
    setGuests("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/search");
  };

  return (
    <aside className="search-filters">
      <h2 className="search-filters__title">Filtrlər</h2>

      <label className="search-filters__field">
        Rayon
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">Hamısı</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="search-filters__field">
        Kateqoriya
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Hamısı</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name_az}
            </option>
          ))}
        </select>
      </label>

      <label className="search-filters__field">
        Qonaq sayı
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="2"
        />
      </label>

      <label className="search-filters__field">
        Min qiymət (AZN)
        <input
          type="number"
          min={0}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="50"
        />
      </label>

      <label className="search-filters__field">
        Max qiymət (AZN)
        <input
          type="number"
          min={0}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="500"
        />
      </label>

      <div className="search-filters__actions">
        <button type="button" className="btn btn--primary" onClick={applyFilters}>
          Axtar
        </button>
        <button type="button" className="btn btn--ghost" onClick={clearFilters}>
          Təmizlə
        </button>
      </div>
    </aside>
  );
}
