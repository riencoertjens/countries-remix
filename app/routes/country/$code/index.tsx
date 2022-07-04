import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getCountry } from "~/models/countries.server";
import type { CountryDetail } from "~/utils/types";

export const loader: LoaderFunction = async ({ params }) => {
  const country = await getCountry(params.code);
  return json(country);
};

export const meta: MetaFunction = ({ data }: { data: CountryDetail }) => {
  return {
    title: data.name.common,
  };
};

const iconFavicon = (favicon: string) =>
  `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${favicon}</text></svg>`;

export const handle = {
  dynamicLinks: ({ data }: { data: CountryDetail }) => {
    if (!data.flag) return [];
    return { rel: "icon", href: iconFavicon(data.flag) };
  },
};

export default function () {
  const country = useLoaderData<CountryDetail>();

  return (
    <div>
      <img src={country.flags.svg} alt={`flag of ${country.name.common}`} />
      <h1>{country.name.common}</h1>
      <h2>{country.name.official}</h2>
      <p>
        {country.region} - {country.subregion}
      </p>
      <pre>{JSON.stringify(country, null, 2)}</pre>
    </div>
  );
}
