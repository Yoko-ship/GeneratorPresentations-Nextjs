"use server";
import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.NEXT_PUBLIC_APIKEY;
const ai = new GoogleGenAI({ apiKey: apiKey });
import { promises as fs } from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { checkEmail, isValid, minLength } from "./checkValues";
import sql, { insertIntoTable } from "./db";
import { google } from "googleapis";
const { Readable } = require("stream");
import axios from "axios";
const SECRET_CODE = process.env.NEXT_PUBLIC_SECRET_CODE;
const file = `
Структура должна быть точно такой же, как в этом примере:

{
  "presentationTitle": "Тема презентации",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Заголовок слайда",
      "description": Пожалуйста, создайте подробное и информативное описание на русском языке, охватывающее ключевые особенности, историю, назначение, функциональность и любую соответствующую фоновую информацию. Опишите, как это работает, почему это важно и как это соотносится с похожими объектами или явлениями. Используйте точный язык, примеры и технические или контекстуальные детали, чтобы сделать описание насыщенным и содержательным. Описание должно быть без лишних фраз вроде 'Меня зовут' или 'Я расскажу'. Пожалуйста, сосредоточьтесь только на самой сути вопроса.,
      image: Generate a highly detailed and informative description for an image based on the description text. The image should visually reflect the key elements, themes, and atmosphere described. Ensure the scene is vivid and immersive, with attention to lighting, color palette, textures, perspective, environmental details, and any relevant characters or objects.Do not include any text, labels, or written content within the image. The focus should be entirely on the visual representation of the scene.On English
    },
  ]
}

Только измени значения, но **не меняй ключи и структуру**.
`;

export default async function WritePrompt(prevState, formData) {
  const prompt = formData.get("prompt");
  const cardNumbers = formData.get("card");
  const manners = formData.get("manners");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const presentationPrompt =
    `Сгенерируй структуру презентации на тему: ${prompt} в формате валидного JSON.
        Ответ должен содержать только JSON. Без пояснений, комментариев и markdown Не добавляй ничего, кроме JSON.
      Сгенерируй ${cardNumbers} слайдов
      Соблюдай логическую последовательность и структуру повествования. 
      Описание каждого слайда должно быть четким,соответствовать его заголовку.От первого лица.${manners}` +
    file;
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: presentationPrompt,
  });
  try {
    const filtered = result.text
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "");

    const filteredJson = JSON.parse(filtered);
    const contents = [];
    contents.push(
      filteredJson.slides[1].image,
      filteredJson.slides[3].image,
      filteredJson.slides[5].image
    );

    const images = await getImages(contents);
    return {
      data: JSON.parse(filtered),
      firstName: firstName,
      lastName: lastName,
      images: images,
    };
  } catch {
    return { message: "Произошла ошибка,пожалуста попробуйте ещё раз." };
  }
}

export async function getImages(contents) {
  const responses = await Promise.all(
    contents.map((content) =>
      ai.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: content,
        config: { responseModalities: ["Text", "Image"] },
      })
    )
  );
  const images = [];

  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        const dataUrl = await importImages(buffer)
        images.push(dataUrl)
      }
    }
  }
  return images;
}

export async function RegisterHandler(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const secondPassword = formData.get("confirmPassword");
  const firstName = formData.get("first-name");
  const lastName = formData.get("last-name");

  const errors = [];
  if (!checkEmail(email)) {
    errors.push("Пожалуста введите корректный эмейл");
  }
  if (!minLength(password) || password !== secondPassword) {
    errors.push("Пароли должны совпадать");
  }
  if (!isValid(firstName) || !isValid(lastName)) {
    errors.push("Пожалуста заполните поле 'Имя // Фамилия' ");
  }

  if (email && password === secondPassword && firstName && lastName) {
    //TODO:Check email firstfull
    const checkEmail =
      await sql`SELECT email FROM presentation WHERE email = ${email}`;
    if (checkEmail.length > 0) {
      errors.push("Данный эмейл уже существует");
      return { error: errors };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await insertIntoTable(
      firstName,
      lastName,
      email,
      hashedPassword
    );
    if (result) {
      const token = jwt.sign(
        { id: result.id, email: result.email },
        SECRET_CODE,
        {
          expiresIn: "24h",
        }
      );
      return { success: "Вы успешно зарегистрировались", token: token };
    }
    // await createTable()
  }

  return { error: errors };
}

export async function LoginHandler(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = [];
  if (!checkEmail(email)) {
    errors.push("Пожалуста введите корректный эмейл");
  }
  if (!password) {
    errors.push("Пароль отсутствует");
  }

  if (email && password) {
    //TODO: Check for the user
    const query = await sql`SELECT * FROM presentation WHERE email = ${email}`;
    if (query.length === 0) {
      errors.push("Такой пользователь не найден");
      return { error: errors };
    }
    const user = query[0];
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      errors.push("Пароль не совпадает");
      return { error: errors };
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_CODE, {
      expiresIn: "24h",
    });
    return { token: token, success: "Вы успешно вошли в аккаунт" };
  }
  return { error: errors };
}

async function importImages(buffer) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_CLIENT_ID,
    process.env.NEXT_PUBLIC_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_REDIRECT_URI
  );
  oAuth2Client.setCredentials({
    refresh_token: process.env.NEXT_PUBLIC_REFRESH_TOKEN,
  });
  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  const response = await drive.files.create({
    requestBody: {
      name: "image .png",
      mimeType: "image/png",
    },
    media: {
      mimeType: "image/png",
      body: Readable.from(buffer),
    },
    fields: "id",
  });
  const fileId = response.data.id;
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });
  const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
  const imageResponse = await axios.get(fileUrl, {
    responseType: "arraybuffer",
  });
  const base64 = Buffer.from(imageResponse.data, "binary").toString("base64");
  const contentType = imageResponse.headers["content-type"];
  const dataUrl = `data:${contentType};base64,${base64}`;
  return dataUrl
}
