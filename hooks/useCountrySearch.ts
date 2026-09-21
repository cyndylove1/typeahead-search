import { useQuery } from "@tanstack/react-query";
import { Country, CountryApiObject } from "@/types/country";
import { useDebounce } from "./useDebounce";

export async function fetchCountries(
  query: string,
  signal?: AbortSignal,
): Promise<Country[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const apiKey = process.env.NEXT_PUBLIC_REST_COUNTRIES_API_KEY;

  const url = `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(trimmedQuery)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(
      `API Error (${response.status}): ${response.statusText || "Failed to fetch"}`,
    );
  }

  const json = await response.json();
  const rawList: CountryApiObject[] =
    json?.data?.objects || (Array.isArray(json) ? json : []);

  
  // Filters out substring matches (e.g., excludes "Mexico" when query is "c")
  const normalizedQuery = trimmedQuery.toLowerCase();

  const matchedCountries = rawList.filter((item) => {
    const commonName = item.names?.common?.trim().toLowerCase() || "";
    const officialName = item.names?.official?.trim().toLowerCase() || "";

    const startsWithCommon = commonName.startsWith(normalizedQuery);
    const startsWithOfficial = officialName.startsWith(normalizedQuery);

    const wordMatch = commonName
      .split(/\s+/)
      .some((word) => word.startsWith(normalizedQuery));

    return startsWithCommon || startsWithOfficial || wordMatch;
  });

  // Map the strictly filtered results to your UI structure
  return matchedCountries.map((item) => ({
    name: {
      common: item.names?.common?.trim() || "",
      official: item.names?.official?.trim() || "",
    },
    cca2: item.codes?.alpha_2?.trim() || "",
    capital: item.capitals?.map((c) => c.name?.trim()) || [],
    flags: {
      png: item.flag?.url_png,
      svg: item.flag?.url_svg,
      alt: item.flag?.description,
    },
    population: item.population,
    region: item.region,
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
