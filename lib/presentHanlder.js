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
      "description": Пожалуйста, создайте подробное и информативное описание на русском языке, охватывающее ключевые особенности, историю, назначение, функциональность и любую соответствующую фоновую информацию. Опишите, как это работает, почему это важно и как это соотносится с похожими объектами или явлениями. Используйте точный язык, примеры и технические или контекстуальные детали, чтобы сделать описание насыщенным и содержательным. Описание должно быть без лишних фраз вроде 'Меня зовут' или 'Я расскажу'. Пожалуйста, сосредоточьтесь только на самой сути вопроса.Нужно раскрыть информацию полностью,
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
        Описание каждого слайда должно быть четким,соответствовать его заголовку.Используй объясняющий контекст.Используй манеру:${manners}` +
      file;
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: presentationPrompt,
    });
    // try {
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
  
      // try{
        var images = await getImages(contents);
        // console.log(images)
      // }
      // catch(err){
      //   return{message:"Произошла ошибка при генерации картинки.Пожалуста попробуйте ещё раз"}
      // }
      return {
        data: JSON.parse(filtered),
        firstName: firstName,
        lastName: lastName,
        images: images,
      };
    // } catch {
    //   return { message: "Произошла ошибка,пожалуста попробуйте ещё раз." };
    // }
  }
  
  export async function getImages(contents) {
    const images = [];
  
    for (const content of contents) {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: content,
        config: { responseModalities: ["Text", "Image"] },
      });
    
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          const res = await fetch("/api/import-image", {
            method: "POST",
            body: buffer,
          });
          const { dataUrl } = await res.json();
          console.log(dataUrl)
          images.push(dataUrl);
        }
      }
    }
    return images
}

