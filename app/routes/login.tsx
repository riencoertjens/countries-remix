import type { User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Authenticator } from "~/utils/authenticator.class.server";

type LoaderData = { users: Array<User> };

export const loader: LoaderFunction = async ({ request, params }) => {
  const auth = new Authenticator(request);
  return await auth.authenticate();
};

export default function () {
  const { user } = useLoaderData<LoaderData>();
  return (
    <div>
      <pre>{JSON.stringify({ user }, null, 2)}</pre>
    </div>
  );
}
