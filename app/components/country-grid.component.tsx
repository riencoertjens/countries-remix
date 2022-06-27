import type { Country } from "~/util/types";
import { CountryCard } from "./country-card.component";

export const CountryGrid = ({
  countries,
  tagName = "div",
}: {
  countries: Country[];
  tagName: keyof JSX.IntrinsicElements;
}) => {
  const Tag = tagName;
  return (
    <Tag className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl mx-auto gap-8 p-4">
      {countries.map((country) => (
        <CountryCard key={country.code} country={country} />
      ))}
    </Tag>
  );
};
