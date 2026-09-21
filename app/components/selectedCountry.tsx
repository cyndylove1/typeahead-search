import React from "react";
import { Country } from "@/types/country";

interface SelectedCountryCardProps {
  country: Country;
}

export function SelectedCountryCard({ country }: SelectedCountryCardProps) {
  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
      <div className="font-semibold text-blue-900 flex items-center gap-2">
        {country.flags?.svg && (
          <img
            src={country.flags.svg}
            alt=""
            className="w-5 h-3.5 object-cover"
          />
        )}
        {country.name?.common}
      </div>
      
    </div>
  );
}
