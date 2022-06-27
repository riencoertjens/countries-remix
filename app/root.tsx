import type { MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "./styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col h-full">
        <header className="w-full shadow-xl flex justify-center z-10 relative">
          <div className="flex justify-between items-center h-[3.5rem] w-full max-w-5xl">
            <Link to="/" className="p-4 text-lg font-bold capitalize">
              <h1>where in the world</h1>
            </Link>
            <button className="p-4">Dark / light</button>
          </div>
        </header>
        <div className="bg-slate-50 pt-10 z-0 relative flex-grow">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
