import { google } from "googleapis";
import fs from "node:fs";

export const getOAuth2Client = () => {
  const credentials = JSON.parse(
    fs.readFileSync(process.env.CREDENTIALS_PATH ?? "", "utf-8")
  );
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const token = JSON.parse(
    fs.readFileSync(process.env.TOKEN_PATH ?? "", "utf-8")
  );
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
};
