const { google } = require("googleapis");
const readline = require("readline");


const CLIENT_ID = ""
const CLIENT_SECRET = ""
const REDIRECT_URI = ""; 


const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);


const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/drive"],
});

console.log("Открой эту ссылку в браузере для авторизации:\n", authUrl);


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nВставь код из браузера сюда: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("\n✅ Access Token:", tokens.access_token);
    console.log("🔁 Refresh Token:", tokens.refresh_token);
    rl.close();
  } catch (err) {
    console.error("❌ Ошибка при получении токена:", err);
    rl.close();
  }
});
