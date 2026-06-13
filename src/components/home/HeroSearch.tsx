"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RegionCombobox } from "@/components/ui/RegionCombobox";

export function HeroSearch() {
  const router = useRouter();
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    if (category) params.set("category", category);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form className="hero__search" onSubmit={handleSearch}>
      <RegionCombobox
        value={region}
        onChange={setRegion}
        placeholder="Rayon və ya şəhər seç"
        inputClassName="hero__search-input"
        allowEmpty
        emptyLabel="Bütün rayonlar"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Bütün növlər</option>
        <option value="a-frame">A-frame (Glamping)</option>
        <option value="hostel">Hostel</option>
        <option value="otel">Otel</option>
        <option value="villa">Villa</option>
        <option value="rayon-evi">Rayon evi</option>
      </select>
      <button type="submit" className="btn btn--primary">
        Axtar
      </button>
    </form>
  );
}
