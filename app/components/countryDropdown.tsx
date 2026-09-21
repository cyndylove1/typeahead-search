import { Country } from "@/types/country";

interface CountryDropdownProps {
  countries: Country[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  searchTerm: string;
  selectedIndex: number;
  onSelect: (country: Country) => void;
  onHoverItem: (index: number) => void;
  onRetry: () => void;
}

export function CountryDropdown({
  countries,
  isLoading,
  isError,
  errorMessage,
  searchTerm,
  selectedIndex,
  onSelect,
  onHoverItem,
  onRetry,
}: CountryDropdownProps) {
  return (
    <ul
      id="country-listbox"
      role="listbox"
      className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto"
    >
      {/* ERROR STATE */}
      {isError && (
        <li className="p-4 text-sm text-red-600 flex justify-between items-center bg-red-50">
          <span>{errorMessage || "Error fetching results"}</span>
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
          >
            Retry
          </button>
        </li>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !isError && countries.length === 0 && (
        <li className="p-4 text-sm text-gray-500 text-center">
          No country found matching "
          <span className="font-semibold">{searchTerm}</span>"
        </li>
      )}

      {/* RESULTS LIST */}
      {!isLoading &&
        !isError &&
        countries.map((country, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <li
              key={country.cca2 || idx}
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelect(country)}
              onMouseEnter={() => onHoverItem(idx)}
              className={`px-4 py-3 cursor-pointer text-sm flex items-center justify-between border-b last:border-b-0 border-gray-100 ${
                isSelected
                  ? "bg-blue-50 text-blue-900 font-medium"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                {country.flags?.svg || country.flags?.png ? (
                  <img
                    src={country.flags.svg || country.flags.png}
                    alt={country.flags.alt || country.name?.common}
                    className="w-6 h-4 object-cover rounded-sm shadow-sm"
                  />
                ) : (
                  <span className="text-base">🌐</span>
                )}
                <div>
                  <div className="text-gray-900">{country.name?.common}</div>
                  {country.capital && country.capital.length > 0 && (
                    <div className="text-xs text-gray-400">
                      Capital: {country.capital[0]}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-mono">
                {country.cca2}
              </span>
            </li>
          );
        })}
    </ul>
  );
}
