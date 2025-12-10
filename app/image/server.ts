"use server";

const baseUrl = process.env.BASE_URL;
const apiKey = process.env.API_KEY;

export const generateImage = async (
  prompt: string,
  model: string,
  resolution: string,
  image: string[]
) => {
  try {
    // 构建消息内容
    const content: Array<{
      type: string;
      text?: string;
      image_url?: { url: string };
    }> = [
      {
        type: "text",
        text: `Generate an image. ${prompt}. Output as a single complete image with aspect ratio ${resolution}. Do not include any text, watermark, or explanation in the response.`,
      },
    ];

    // 如果有上传的图片，添加到内容中
    if (image && image.length > 0) {
      image.forEach((imgBase64) => {
        content.push({
          type: "image_url",
          image_url: {
            url: imgBase64,
          },
        });
      });
    }

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: content,
          },
        ],
        presence_penalty: 0,
        temperature: 0.5,
        top_p: 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      throw new Error(`API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // 解析新API返回格式，转换为前端期望的格式
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content;

      // 从markdown格式提取图片URL或base64: ![image](url) 或 ![image](data:image/...)
      const imageUrlRegex =
        /!\[image\]\(((?:https?:\/\/[^\)]+|data:image\/[^;]+;base64,[^\)]+))\)/g;
      const urls: string[] = [];
      let match;

      while ((match = imageUrlRegex.exec(content)) !== null) {
        urls.push(match[1]);
      }

      return {
        data: urls.map((url) => ({
          url: url,
          revised_prompt: prompt,
        })),
        original_response: data,
      };
    }

    return data;
  } catch (error) {
    console.error("Generate Image Error:", error);
    throw error;
  }
};
