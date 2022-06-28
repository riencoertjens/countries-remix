import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getCountry } from "~/models/countries.server";

export const loader: LoaderFunction = async ({ params }) => {
  return getCountry(params.code);
};

export default function () {
  const country = useLoaderData();

  return (
    <div>
      <h1>{country.name.common}</h1>
      <h2>{country.name.official}</h2>
      <p>
        {country.region} - {country.subregion}
      </p>
      <pre>{JSON.stringify(country, null, 2)}</pre>
    </div>
  );
}
