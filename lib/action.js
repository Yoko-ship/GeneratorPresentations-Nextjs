"use server";
import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.NEXT_PUBLIC_APIKEY;
const ai = new GoogleGenAI({ apiKey: apiKey });
import {promises as fs } from "fs";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { checkEmail, isValid, minLength } from "./checkValues";
import sql, {insertIntoTable} from "./db";
import path from "path";
const SECRET_CODE = process.env.NEXT_PUBLIC_SECRET_CODE

export default async function WritePrompt(prevState, formData) {
  const filePath = path.resolve("public", "prompt.txt");
  const file = await fs.readFile(filePath, "utf-8");
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
  // try{
    const filtered = result.text
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "");

    const filteredJson = JSON.parse(filtered)
    const contents = []
    contents.push(filteredJson.slides[1].image,filteredJson.slides[3].image,filteredJson.slides[5].image)
    
    // await getImages(contents)
    return {
      data: JSON.parse(filtered),
      firstName: firstName,
      lastName: lastName,
    };
  // }catch{
  //   return {message: "Произошла ошибка,пожалуста попробуйте ещё раз."}
  // }
}



export async function getImages(contents) {
  const responses = await Promise.all(
    contents.map((content, index) =>
      ai.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: content,
        config: { responseModalities: ["Text", "Image"] },
      })
    )
  );

  for(let i = 0; i < responses.length;i++){
    const response = responses[i]
    for(const part of response.candidates[0].content.parts){
      if(part.inlineData){
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          const filePath = `public/image/gemini-native-image${i + 1}.png`;
          await fs.writeFile(filePath, buffer);
      }
    }
  }
}

export async function RegisterHandler(prevState,formData){
  const email = formData.get("email")
  const password = formData.get("password")
  const secondPassword = formData.get("confirmPassword")
  const firstName = formData.get("first-name")
  const lastName = formData.get("last-name")

  const errors = []
  if(!checkEmail(email)){
    errors.push("Пожалуста введите корректный эмейл")
  }
  if(!minLength(password) || password !== secondPassword){
    errors.push("Пароли должны совпадать")
  }
  if(!isValid(firstName) || !isValid(lastName)){
    errors.push("Пожалуста заполните поле 'Имя // Фамилия' ")
  }

  if(email && password === secondPassword && firstName && lastName){
//TODO:Check email firstfull
    const checkEmail = await sql`SELECT email FROM presentation WHERE email = ${email}`
    if(checkEmail.length > 0){
      errors.push("Данный эмейл уже существует")
      return {error:errors}
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await insertIntoTable(firstName,lastName,email,hashedPassword)
    if(result){
      const token = jwt.sign({id:result.id,email:result.email},SECRET_CODE,{
        expiresIn:"24h",
      })
      return {success:"Вы успешно зарегистрировались",token:token}
    }
    // await createTable()
    //TODO:Insert into db and giving the tokens
  }

  return {error:errors}
}

export async function LoginHandler(prevState,formData){
  const email = formData.get("email")
  const password = formData.get("password")

  const errors = []
  if(!checkEmail(email)){
    errors.push("Пожалуста введите корректный эмейл")
  }
  if(!password){
    errors.push("Пароль отсутствует")
  }
  
  if(email && password){
    //TODO: Check for the user
    const query = await sql`SELECT * FROM presentation WHERE email = ${email}`
    if(query.length === 0){
      errors.push("Такой пользователь не найден")
      return {error:errors}
    }
    const user = query[0]
    const checkPassword = await bcrypt.compare(password,user.password)
    if(!checkPassword){
      errors.push("Пароль не совпадает")
      return {error:errors}
    }
    const token = jwt.sign({id:user.id,email:user.email},SECRET_CODE,{
      expiresIn:"24h",
    })
    return {token:token,success:"Вы успешно вошли в аккаунт"}
    
  }
  return {error:errors}
}