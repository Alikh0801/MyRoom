"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <input
        type="text"
        placeholder="Rayon (məs: Quba, Şəki...)"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Bütün növlər</option>
        <option value="a-frame">A-frame</option>
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
