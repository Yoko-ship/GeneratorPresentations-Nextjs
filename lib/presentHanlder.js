'use client'
import { GoogleGenAI } from "@google/genai";
import { searchImage } from "./unsplash";
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
      "description": Пожалуйста, создайте подробное и информативное описание на русском языке, охватывающее ключевые особенности, историю, назначение, функциональность и любую соответствующую фоновую информацию. Опишите, как это работает, почему это важно и как это соотносится с похожими объектами или явлениями. Используйте точный язык, примеры и технические или контекстуальные детали, чтобы сделать описание насыщенным и содержательным. Описание должно быть без лишних фраз вроде 'Меня зовут' или 'Я расскажу'. Пожалуйста, сосредоточьтесь только на самой сути вопроса.Нужно раскрыть информацию полностью,
      image: Исходя из Description,создай text-based картинку для генерации картинки,просто укажи описание для картинки на Английском.
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
        Описание каждого слайда должно быть четким,соответствовать его заголовку.Используй объясняющий контекст.Используй манеру:${manners}` +
      file;
    
      const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: presentationPrompt,
    });
    try{
      const filtered = result.text
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "");
  
    const filteredJson = JSON.parse(filtered);
    const images = []
    for(let i = 1; i < 6;i+=2){
      const image = await searchImage(filteredJson.slides[i].image)
      images.push(image)
    }
    return {
      data: JSON.parse(filtered),
      firstName: firstName,
      lastName: lastName,
      images: images,
    };
    } catch(err){
      return{message:"Произошла ошибка при генерации картинки.Пожалуста попробуйте ещё раз"}
    }
      
  }
  