const base64url = require("base64url");
const crypto = require("crypto");
const request = require("request");
const querystring = require("querystring");

function generateCodeVerifierHash(code_verifier) {
  return crypto.createHmac("SHA256", code_verifier).digest("base64");
}

function generateCodeVerifier() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._`-";

  for (var i = 0; i < 64; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return base64url.encode(text);
}

var CLIENT_ID = "Your Client Id";
var CLIENT_SECRET = "Your Client Secret";
var RESPONSE_TYPE = "code";
var REDIRECT_URI = encodeURIComponent("Your Redirect Url");
var SCOPE = "openid";
var AUTH_DOMAIN = "Your Cognito Auth Domain";
var USERNAME = "User's Username";
var PASSWORD = "User's Password";
var CODE_CHALLENGE_METHOD = "S256";

// Challenge
var code_verifier = generateCodeVerifier();
var code_challenge = generateCodeVerifierHash(code_verifier);

// Get CSRF token from /oauth2/authorize endpoint
var csrfRequestUrl = [
  `https://${AUTH_DOMAIN}/oauth2/authorize`,
  `?response_type=${RESPONSE_TYPE}`,
  `&client_id=${CLIENT_ID}`,
  `&redirect_uri=${REDIRECT_URI}`,
  `&scope=${SCOPE}`,
  `&code_challenge_method=${CODE_CHALLENGE_METHOD}`,
  `&code_challenge=${code_challenge}`,
].join("");
// Post CSRF Token and username/password to /login endpoint
var codeRequestUrl = [
  `https://${AUTH_DOMAIN}/login`,
  `?response_type=${RESPONSE_TYPE}`,
  `&client_id=${CLIENT_ID}`,
  `&redirect_uri=${REDIRECT_URI}`,
].join("");

request.get(csrfRequestUrl, (err, res, body) => {
  var XSRFTOKEN = res.headers["set-cookie"].filter(
    (header) => header.substring(0, 10) == "XSRF-TOKEN"
  )[0];

  form = {
    _csrf: `${XSRFTOKEN.split(";")[0].split("=")[1]}`,
    username: `${USERNAME}`,
    password: `${PASSWORD}`,
  };

  var formData = querystring.stringify(form);
  var contentLength = formData.length;

  request(
    {
      headers: {
        "Content-Length": contentLength,
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: `${XSRFTOKEN}`,
      },
      uri: codeRequestUrl,
      body: formData,
      method: "POST",
    },
    function (err, res, body) {
      var authorizationCodeGrant = res.headers.location.split("=")[1];
      console.log(authorizationCodeGrant);
    }
  );
});
