import type { Session } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import {
  accessTokenCookie,
  Cookies,
  idTokenCookie,
  refreshTokenCookie,
} from "./cookies.server";
import { getEnv } from "./get-env.server";
import { v4 as uuid } from "uuid";
import { base64Encode } from "~/utils/base64";
import { getSession, commitSession } from "./session.server";

const cognitoDomain = getEnv("COGNITO_DOMAIN");
const clientId = getEnv("COGNITO_CLIENT_ID");
const clientSecret = getEnv("COGNITO_CLIENT_SECRET");

type User = {};

export class Authenticator {
  private request: Request;
  private accessToken: string | null;
  private idToken: string | null;
  private refreshToken: string | null;
  private user: User | null;
  private session: Session | null;

  constructor(request: Request) {
    this.request = request;

    this.accessToken = "";
    this.idToken = "";
    this.refreshToken = "";

    this.user = null;
    this.session = null;
  }

  private async init() {
    await this.initTokens();
    await this.initSession();
  }

  private async initSession() {
    this.session = await getSession(this.request.headers.get("Cookie"));
  }

  // get tokens from cookies
  private async initTokens() {
    const header = this.request.headers.get("Cookie");

    const accessToken = await accessTokenCookie.parse(header);
    this.accessToken = accessToken ? accessToken.access_token : null;

    const idToken = await idTokenCookie.parse(header);
    this.idToken = idToken ? idToken[Cookies.ID_TOKEN] : null;

    const refreshToken = await refreshTokenCookie.parse(header);
    this.refreshToken = refreshToken
      ? refreshToken[Cookies.REFRESH_TOKEN]
      : null;
  }

  async authenticate() {
    await this.init();

    if (!this.session) {
      throw new Error("can't get session");
    }

    const url = new URL(this.request.url);
    const code = url.searchParams.get("code");

    // if we have a code, the user just logged in
    if (code) {
      const state = url.searchParams.get("state");
      if (!state) {
        throw new Error("State missing");
      }
      const stateDecoded = decodeURIComponent(state);
      const stateParts = stateDecoded.split(":");
      const nonce = stateParts[0];

      // const redirect = stateParts[1]; // can be used to redirect back to a location the app

      // check if nonce is the same as the one we sent
      if (this.session.get("auth:state") !== nonce) {
        throw new Error("State mismatch");
      }

      await this.setTokensFromCode(code);

      return redirect("/login", {
        headers: await this.setHeaders(),
      });
    }

    // try to authenticate user with tokens
    await this.setCognitoUser();

    // if no user, redirect to cognito login
    if (!this.user) {
      return this.loginRedirect();
    }

    // return user and cookies
    return json({ user: this.user }, { headers: await this.setHeaders() });
  }

  async authenticated() {
    await this.init();

    // try to authenticate user with tokens
    await this.setCognitoUser();

    // return user or null and headers with tokens (they might have been refreshed)
    return {
      headers: await this.setHeaders(),
      user: this.user ? this.user : null,
    };
  }

  async logout() {
    await this.init();

    const url = new URL(this.request.url);
    const completed = url.searchParams.get("complete");

    // if logout successful, unset all tokens
    if (completed) {
      this.accessToken = "";
      this.idToken = "";
      this.refreshToken = "";

      return json(
        { success: true },
        {
          headers: await this.setHeaders(),
        }
      );
    }
    const cognitoRedirect = `${url.origin}${url.pathname}?complete=true`; // where the user will be redirected to after cognito logout

    const uri = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${cognitoRedirect}`;

    return redirect(uri);
  }

  // set cookie headers from token values
  private async setHeaders() {
    const headers = new Headers();

    headers.append(
      "Set-cookie",
      await accessTokenCookie.serialize({
        [Cookies.ACCESS_TOKEN]: this.accessToken,
      })
    );
    headers.append(
      "Set-cookie",
      await idTokenCookie.serialize({
        [Cookies.ID_TOKEN]: this.idToken,
      })
    );
    headers.append(
      "Set-cookie",
      await refreshTokenCookie.serialize({
        [Cookies.REFRESH_TOKEN]: this.refreshToken,
      })
    );

    return headers;
  }

  // redirect to auth login page
  private async loginRedirect() {
    const url = new URL(this.request.url);
    const cognitoRedirect = url.origin + url.pathname; // where the user will be redirected to after cognito login
    if (!this.session) {
      throw new Error("can't get session");
    }

    // TODO: where in the app to send the user after successful login
    const appRedirect = "/";
    // create nonce and pass it to state
    const nonce = uuid(); // a random string to prevent replay attacks
    const state = `${nonce}:${appRedirect}`;

    // set state in session, 'flash' will unset value after .get()
    this.session.flash("auth:state", nonce);

    const uri = `https://${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${cognitoRedirect}&state=${encodeURIComponent(
      state
    )}`;

    const headers = { "Set-Cookie": await commitSession(this.session) };
    // send user to cognito login page
    return redirect(uri, { headers });
  }

  private async setCognitoUser() {
    // try to authenticate user with current access token
    await this.getCognitoUser();

    if (!this.user) {
      // if no user, refresh tokens
      await this.refreshTokens();
      // try to authenticate user with new access token
      await this.getCognitoUser();
    }
  }

  private async getCognitoUser() {
    const uri = `https://${cognitoDomain}/oauth2/userInfo`;

    const response = await fetch(uri, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (response.status === 200) {
      this.user = await response.json();
    } else {
      this.user = null;
    }
  }

  private async refreshTokens() {
    const uri = `https://${cognitoDomain}/oauth2/token`;

    if (!this.refreshToken) return;

    const body = {
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: this.refreshToken,
    };
    const refreshTokenResponse = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(body),
    });

    const { access_token, id_token, refresh_token } =
      await refreshTokenResponse.json();

    this.accessToken = access_token;
    this.idToken = id_token;
    this.refreshToken = refresh_token;
  }

  private async setTokensFromCode(code: string) {
    const url = new URL(this.request.url);
    const cognitoRedirect = url.origin + url.pathname;
    // get tokens after cognito login
    const uri = `https://${cognitoDomain}/oauth2/token`;
    const body = {
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: cognitoRedirect,
    };
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${base64Encode(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams(body),
    });

    const { access_token, id_token, refresh_token } = await response.json();

    this.accessToken = access_token;
    this.idToken = id_token;
    this.refreshToken = refresh_token;
  }
}
