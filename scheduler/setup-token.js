// NOTE: MCP の初期設定を行うためのコード
// node setup-token.js を実行することで token.json を作成する

const fs = require("node:fs");
const path = require("node:path");
const { google } = require("googleapis");

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
];
const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");

async function loadSavedCredentialsIfExist() {
  try {
    const content = fs.readFileSync(TOKEN_PATH, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const payload = JSON.stringify(client.credentials);
  fs.writeFileSync(TOKEN_PATH, payload);
}

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  const token = await loadSavedCredentialsIfExist();
  if (token) {
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  }
  // 認証フロー
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("認証URLにアクセスしてください:", authUrl);
  const readline = require("node:readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve, reject) => {
    readline.question("認証コードを入力してください: ", (code) => {
      readline.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject(err);
        oAuth2Client.setCredentials(token);
        saveCredentials(oAuth2Client);
        resolve(oAuth2Client);
      });
    });
  });
}

authorize().catch(console.error);
