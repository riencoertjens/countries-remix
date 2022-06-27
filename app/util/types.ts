export type Region = "africa" | "americas" | "asia" | "europe" | "oceania";
export type Country = {
  name: string;
  code: string;
  flag: string;
  population: number;
  region: Region;
  capital: string[];
};
