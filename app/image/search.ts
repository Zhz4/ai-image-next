"use server";

import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

/**
 * 使用 Gemini 的 Google Search grounding 功能进行信息搜索
 * @param query 搜索查询
 * @returns 搜索结果文本
 */
export const infoSearch = async (query: string): Promise<string> => {
  try {
    const response = await client.chat.completions.create({
      model: "gemini-2.5-flash-lite-preview-06-17",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: `你是一个专业的信息搜索助手。请根据用户的查询，使用搜索工具获取最新、最准确的信息，并整理成结构化的内容返回。
                    要求：
                    1. 搜索相关的最新资料和信息
                    2. 整理成易于阅读的格式
                    3. 包含关键数据、步骤、要点等
                    4. 如果是教程类内容，请提供详细步骤
                    5. 如果是资讯类内容，请提供多角度信息`,
        },
        {
          role: "user",
          content: `请搜索并整理关于以下主题的详细信息：${query}`,
        },
      ],
      // @ts-expect-error - Gemini 特有的 tools 配置，OpenAI 类型定义中没有
      // tools: [{ google_search: {} }],
      stream: false,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return `关于 "${query}" 的搜索未返回结果，请尝试其他关键词。`;
    }

    return content;
  } catch (error) {
    console.error("搜索出错:", error);
    return `搜索 "${query}" 时出现错误，请稍后重试。`;
  }
};
