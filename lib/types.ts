export type TbcCountry = "USA" | "Mexico" | "Canada";

export type HostCityCountry = TbcCountry;

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Team = {
  slug: string;
  name: string;
  countryCode: string;
  confederation: "AFC" | "CAF" | "CONCACAF" | "CONMEBOL" | "OFC" | "UEFA";
  group: string;
  tbc: {
    country: TbcCountry;
    city: string;
    trainingSite: string;
    isHostCityCommunity: boolean;
    coordinates: Coordinates;
    nearestHostCitySlug: string;
  };
  groupStageHostCitySlugs: string[];
};

export type HostCity = {
  slug: string;
  name: string;
  country: HostCityCountry;
  stadium: string;
  accentColor: string;
  coordinates: Coordinates;
};

export type NonHostCommunity = {
  name: string;
  country: TbcCountry;
};

export type TeamFilters = {
  search?: string;
  group?: string;
  tbcCountry?: TbcCountry;
  hostCitySlug?: string;
  sort?: "name" | "group" | "tbcCity";
};
