import { createCookieSessionStorage } from "@remix-run/node"; // or "@remix-run/cloudflare"

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET env variable must be set");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",

      // all of these are optional
      // domain: "remix.run",
      // Expires can also be set (although maxAge overrides it when used in combination).
      // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
      //
      // expires: new Date(Date.now() + 60_000),
      httpOnly: true,
      maxAge: 60,
      path: "/",
      sameSite: "lax",
      secrets: [sessionSecret],
      // normally you want this to be `secure: true`
      // but that doesn't work on localhost for Safari
      // https://web.dev/when-to-use-local-https/
      secure: false, //process.env.NODE_ENV === "production",
    },
  });

export { getSession, commitSession, destroySession };
