import { google } from "googleapis";
import { Readable } from "stream";

export async function POST(req) {
  try {
    const buffer = Buffer.from(await req.arrayBuffer());

    const oAuth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_CLIENT_ID,
      process.env.NEXT_PUBLIC_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_REDIRECT_URI
    );

    oAuth2Client.setCredentials({
      refresh_token: process.env.NEXT_PUBLIC_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    await drive.files.create({
      requestBody: {
        name: "image.png",
        mimeType: "image/png",
      },
      media: {
        mimeType: "image/png",
        body: Readable.from(buffer),
      },
      fields: "id",
    });

    const dataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
    return new Response(JSON.stringify({ dataUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Ошибка при загрузке:", err);
    return new Response("Upload failed", { status: 500 });
  }
}