"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Country } from "@/types/country";
import { useCountrySearch } from "@/hooks/useCountrySearch";
import { CountryInput } from "../components/countryInput";
import { CountryDropdown } from "../components/countryDropdown";
import { SelectedCountryCard } from "../components/selectedCountry";

export default function CountrySearch() {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false);

  const {
    data: countries = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useCountrySearch(inputValue);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset keyboard index when search results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [countries]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSelectingRef.current) return;

    const val = e.target.value;
    setInputValue(val);
    setIsOpen(val.trim().length > 0);
    if (!val) setSelectedCountry(null);
  };

  const handleSelect = (country: Country) => {
    isSelectingRef.current = true;

    setSelectedCountry(country);
    setInputValue(country.name?.common || "");
    setIsOpen(false);
    setSelectedIndex(-1);

    setTimeout(() => {
      isSelectingRef.current = false;
    }, 100);
  };

  // Keyboard Navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || countries.length === 0) {
      if (e.key === "ArrowDown") setIsOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < countries.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : countries.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < countries.length) {
          handleSelect(countries[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-lg mx-auto relative p-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Search Country
      </label>

      <CountryInput
        value={inputValue}
        isOpen={isOpen}
        isLoading={isLoading || isFetching}
        onChange={handleInputChange}
        onFocus={() => {
          if (!isSelectingRef.current && inputValue.trim().length > 0) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
      />

      {isOpen && inputValue.trim().length > 0 && (
        <CountryDropdown
          countries={countries}
          isLoading={isLoading || isFetching}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : undefined}
          searchTerm={inputValue}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          onHoverItem={setSelectedIndex}
          onRetry={refetch}
        />
      )}
    </div>
  );
}
