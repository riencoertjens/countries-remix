import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Country } from "~/models/countries.server";
import { getCountries } from "~/models/countries.server";
import { CountryGrid } from "~/components/country-grid.component";

export const loader: LoaderFunction = async () => {
  return getCountries();
};

export default function Region() {
  const countries = useLoaderData<Array<Country>>();
  return <CountryGrid countries={countries} tagName="main" />;
}
