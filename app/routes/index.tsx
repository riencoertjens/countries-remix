import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Authenticator } from "~/utils/authenticator.class.server";

export const loader: LoaderFunction = async ({ request }) => {
  const auth = new Authenticator(request);

  const { user, headers } = await auth.authenticated();
  return json({ user }, { headers });
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div>
      <h1>welcome to the index page</h1>
      {!data.user ? (
        <p>
          you are not logged in{" "}
          <Link to="/login" className="text-blue-700">
            log in
          </Link>
        </p>
      ) : (
        <Link to="/logout" className="text-blue-700">
          log out
        </Link>
      )}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
