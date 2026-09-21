import { useQuery } from "@tanstack/react-query";
import { Country, CountriesNowResponse } from "@/types/country";
import { useDebounce } from "./useDebounce";

export async function fetchCountries(
  query: string,
  signal?: AbortSignal,
): Promise<Country[]> {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const url = "https://countriesnow.space/api/v0.1/countries";

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `API Error (${response.status}): ${response.statusText || "Failed to fetch"}`,
    );
  }

  const json: CountriesNowResponse = await response.json();

  if (json.error || !Array.isArray(json.data)) {
    throw new Error(json.msg || "Failed to load countries");
  }

  // STRICT FILTERING: Only match countries that START directly with the typed search query
  const matchedCountries = json.data.filter((item) => {
    const countryName = item.country?.trim().toLowerCase() || "";
    return countryName.startsWith(normalizedQuery);
  });

  // Sort alphabetically
  matchedCountries.sort((a, b) => a.country.localeCompare(b.country));

  // Map the API output
  return matchedCountries.map((item) => ({
    name: {
      common: item.country,
      official: item.country,
    },
    cca2: item.iso2 || "",
    capital: item.cities && item.cities.length > 0 ? [item.cities[0]] : [],
    flags: {
      svg: item.iso2
        ? `https://flagcdn.com/${item.iso2.toLowerCase()}.svg`
        : undefined,
      png: item.iso2
        ? `https://flagcdn.com/w320/${item.iso2.toLowerCase()}.png`
        : undefined,
      alt: `Flag of ${item.country}`,
    },
  }));
}

export function useCountrySearch(searchTerm: string) {
  const debouncedQuery = useDebounce(searchTerm, 300);

  return useQuery({
    queryKey: ["countries-search", debouncedQuery],
    queryFn: ({ signal }) => fetchCountries(debouncedQuery, signal),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
