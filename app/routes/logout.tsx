import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Authenticator } from "~/services/authenticator.class.server";

export const loader: LoaderFunction = async ({ request }) => {
  const auth = new Authenticator(request);
  return await auth.logout();
};

export default function () {
  const data = useLoaderData();
  return <div>logout {JSON.stringify(data, null, 2)}</div>;
}
