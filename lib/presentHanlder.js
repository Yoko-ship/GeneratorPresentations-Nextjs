'use client'
import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.NEXT_PUBLIC_APIKEY;
const ai = new GoogleGenAI({ apiKey: apiKey });
const file = `
Структура должна быть точно такой же, как в этом примере:

{
  "presentationTitle": "Тема презентации",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Заголовок слайда",
      "description": Необходимо создать подробное и информативное описание на русском языке, раскрывающее сущность выбранного объекта, явления или технологии.Желательно уместить в небольшой текст данных

      Описание должно объяснять, как объект работает, почему он важен, а также сравнивать его с аналогичными явлениями или решениями, если это уместно.
      Текст должен быть написан от третьего лица, в информационном и академически-объективном стиле, полностью сосредоточенном на сути вопроса.
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
        Описание каждого слайда должно быть четким,соответствовать его заголовку.Используй объясняющий контекст.Используй манеру:${manners}` +
      file;
    
      const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: presentationPrompt,
    });
    try{
      const filtered = result.text
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "");
  
    return {
      data: JSON.parse(filtered),
      firstName: firstName,
      lastName: lastName,
    };
    } catch(err){
      return{message:"Произошла ошибка при генерации картинки.Пожалуста попробуйте ещё раз"}
    }
      
  }
  