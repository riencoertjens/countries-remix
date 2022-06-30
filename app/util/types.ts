export type Region = "africa" | "americas" | "asia" | "europe" | "oceania";
export type Country = {
  name: string;
  code: string;
  flag: string;
  population: number;
  region: Region;
  capital: string[];
};

export type CountryDetail = {
  name: {
    common: string;
    official: string;
  };
  tld: string[];
  cca3: string;
  status: string;
  capital: string[];
  region: string;
  subregion: string;
  borders: string[];
  flag: string;
  maps: {
    googleMaps: string;
  };
  population: number;
  flags: {
    png: string;
    svg: string;
  };
};
