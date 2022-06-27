import { Link } from "@remix-run/react";
import type { ReactText } from "react";
import type { Country } from "~/util/types";

export const CountryCard = ({ country }: { country: Country }) => (
  <Link
    to={`/country/${country.code}`}
    key={country.code}
    className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-xl"
  >
    <img src={country.flag} alt={country.name} className="w-full my-auto" />
    <div className="px-3 py-2 bg-stone-200">
      <h2 className="text-xl font-bold">
        {country.name}{" "}
        <span className="font-normal text-sm">({country.code})</span>
      </h2>
      <dl className="space-y-1 mt-3 text-stone-900">
        <KeyValue
          label="Population"
          value={country.population.toLocaleString()}
        />
        <KeyValue label="region" value={country.region} />
        <KeyValue label="capital" value={country.capital?.join(", ")} />
      </dl>
    </div>
  </Link>
);

const KeyValue = ({ label, value }: { label: string; value?: ReactText }) => {
  return (
    <div className="flex space-between space-x-2">
      <dt className="text-sm font-bold capitalize">{label}:</dt>
      <dd className="text-sm">{value ?? "N/A"}</dd>
    </div>
  );
};
