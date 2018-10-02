const { OAuth2Client } = require("google-auth-library");

//const audience = process.env.GOOGLE_CLIENT_ID;
const audience =
    "489162778339-4rs3l13uu58q22goo4enlo2akq3egejm.apps.googleusercontent.com";

const gapiClient = new OAuth2Client(audience, "", "");

if (audience) {
    console.log("Google Sign-in Initialized");
    console.log("\tClient ID:", audience);
} else {
    console.log(
        "ERROR: No Google Client ID set, sign-in WILL FAIL. Set env variable GOOGLE_CLIENT_ID"
    );
}

/**
 * Checks a google token for validity
 * @param {*} idToken The google token
 * @param {*} onSuccess Success callback
 * @param {*} onFailure Failure callback
 */
const parser = (idToken, onSuccess, onFailure) => {
    if (audience) {
        gapiClient
            .verifyIdToken({ idToken, audience })
            .then(login => {
                onSuccess(login.getPayload());
            })
            .catch(error => {
                if (onFailure) onFailure(error);
            });
    } else {
        onFailure({ message: "No audience specified" });
    }
};

module.exports = parser;
