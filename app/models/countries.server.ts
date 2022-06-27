import { compose, orderBy } from "lodash/fp";
import invariant from "tiny-invariant";
import { isRegion } from "~/util/regions";
import type { Region, Country } from "~/util/types";

const BASE_URL = "https://restcountries.com/v3.1";

export const getCountries = async (params?: {
  search: string;
  region: Region;
}): Promise<Array<Country>> => {
  const { search, region } = params || {};

  if (region) {
    invariant(isRegion(region), `Invalid region: ${region}`);
  }

  const apiPath = region ? `region/${region}` : "all";
  const countries = await (await fetch(`${BASE_URL}/${apiPath}`)).json();
  const parsedCountries: Country[] = countries.map(
    ({
      name: { common: name },
      population,
      region,
      capital,
      flags: { png: flag },
      cca3: code,
    }: any) => ({
      name,
      population,
      region,
      capital,
      flag,
      code,
    })
  );
  const sortCountries = compose(
    orderBy("name", "asc"),
    orderBy("capitalCount", "desc")
  )(parsedCountries) as any as Country[];

  return sortCountries;
};

export const getCountry = async (code: string): Promise<Country> => {
  const country = await (await fetch(`${BASE_URL}/alpha/${code}`)).json();
  return country;
};
