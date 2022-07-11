import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";

type User = {};
// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);
