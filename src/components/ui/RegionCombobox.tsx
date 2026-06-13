"use client";

import { useEffect, useId, useRef, useState } from "react";
import { filterRegions } from "@/lib/regions";

interface RegionComboboxProps {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  id?: string;
  inputClassName?: string;
  allowEmpty?: boolean;
  emptyLabel?: string;
}

export function RegionCombobox({
  name,
  value,
  onChange,
  required = false,
  placeholder = "Rayon və ya şəhər seç",
  id,
  inputClassName = "",
  allowEmpty = false,
  emptyLabel = "Hamısı",
}: RegionComboboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);

  useEffect(() => {
    if (!open) setQuery(value);
  }, [value, open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const filtered = filterRegions(query);
  const showEmpty = allowEmpty && !query.trim();

  function selectRegion(region: string) {
    onChange(region);
    setQuery(region);
    setOpen(false);
  }

  return (
    <div className="region-combobox" ref={rootRef}>
      {name && <input type="hidden" name={name} value={value} />}
      <input
        id={inputId}
        type="text"
        className={`region-combobox__input ${inputClassName}`.trim()}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (!e.target.value) onChange("");
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        required={required && !value}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={`${inputId}-listbox`}
      />

      {open && (showEmpty || filtered.length > 0) && (
        <ul
          id={`${inputId}-listbox`}
          className="region-combobox__list"
          role="listbox"
        >
          {showEmpty && (
            <li
              role="option"
              className="region-combobox__option"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectRegion("")}
            >
              {emptyLabel}
            </li>
          )}
          {filtered.map((region) => (
            <li
              key={region}
              role="option"
              aria-selected={region === value}
              className={`region-combobox__option${
                region === value ? " region-combobox__option--selected" : ""
              }`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectRegion(region)}
            >
              {region}
            </li>
          ))}
          {!showEmpty && filtered.length === 0 && (
            <li className="region-combobox__empty">Nəticə tapılmadı</li>
          )}
        </ul>
      )}
    </div>
  );
}
