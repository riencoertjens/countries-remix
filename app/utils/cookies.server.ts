import { createCookie } from "@remix-run/node";
import { getEnv } from "./get-env.server";

const sessionSecret = getEnv("SESSION_SECRET");

export enum Cookies {
  ACCESS_TOKEN = "access_token",
  ID_TOKEN = "id_token",
  REFRESH_TOKEN = "refresh_token",
}

const cookieSettings = {
  maxAge: 60 * 60 * 30,
  secure: process.env.NODE_ENV === "production",
  secrets: [sessionSecret],
  httpOnly: true,
};

export const accessTokenCookie = createCookie(
  Cookies.ACCESS_TOKEN,
  cookieSettings
);
export const idTokenCookie = createCookie(Cookies.ID_TOKEN, cookieSettings);
export const refreshTokenCookie = createCookie(
  Cookies.REFRESH_TOKEN,
  cookieSettings
);
