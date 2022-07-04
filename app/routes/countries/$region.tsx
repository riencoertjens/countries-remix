import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getCountries } from "~/models/countries.server";
import { CountryGrid } from "~/components/country-grid.component";
import type { Country } from "~/utils/types";

export const loader: LoaderFunction = async ({ params: { region } }) => {
  return getCountries({ region });
};

export default function Region() {
  const countries = useLoaderData<Array<Country>>();
  return <CountryGrid countries={countries} tagName="main" />;
}
