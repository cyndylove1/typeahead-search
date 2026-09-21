export interface CountriesNowItem {
  iso2: string;
  iso3: string;
  country: string;
  cities: string[];
}

export interface CountriesNowResponse {
  error: boolean;
  msg: string;
  data: CountriesNowItem[];
}

export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  capital?: string[];
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
  population?: number;
  region?: string;
}
