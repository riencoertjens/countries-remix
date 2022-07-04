import type { Region } from "./types";

export const regions: Array<Region> = [
  "africa",
  "americas",
  "antarctica",
  "asia",
  "europe",
  "oceania",
];

export const isRegion = (region: any): region is Region =>
  regions.includes(region);
