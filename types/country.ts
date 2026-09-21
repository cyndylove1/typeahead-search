export interface CountryApiObject {
  names: {
    common: string;
    official: string;
  };
  codes: {
    alpha_2: string;
    alpha_3: string;
  };
  capitals?: Array<{
    name: string;
  }>;
  flag?: {
    url_png?: string;
    url_svg?: string;
    description?: string;
  };
  population?: number;
  region?: string;
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