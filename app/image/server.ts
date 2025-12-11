"use server";

import OpenAI from "openai";
import { prompts } from "./prompts";

const client = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

export const generateImage = async (
  prompt: string,
  model: string,
  size: string,
  scene: keyof typeof prompts | undefined,
  image: string[] | null
) => {
  try {
    const content: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    > = [
      {
        type: "text",
        text: `${
          scene ? prompts[scene] : ""
        } Generate an image. ${prompt}. Output as a single complete image with aspect ratio ${size}. Do not include any text, watermark, or explanation in the response.`,
      },
    ];

    // 添加上传的参考图片
    if (image && image.length > 0 && image[0] !== "") {
      image.forEach((imgBase64) => {
        content.push({
          type: "image_url",
          image_url: {
            url: imgBase64,
          },
        });
      });
    }

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content,
        },
      ],
      stream: false,
    });

    const output = response.choices[0]?.message?.content || "";

    const imageUrlRegex =
      /!\[image\]\(((?:https?:\/\/[^\)]+|data:image\/[^;]+;base64,[^\)]+))\)/g;

    const urls: string[] = [];
    let match;

    while ((match = imageUrlRegex.exec(output)) !== null) {
      urls.push(match[1]);
    }

    return {
      data: urls.map((url) => ({
        url,
        revised_prompt: prompt,
      })),
    };
  } catch (error) {
    throw error;
  }
};
