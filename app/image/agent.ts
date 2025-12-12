"use server";

import OpenAI from "openai";
import { generateImage } from "./server";
import { infoSearch } from "./search";

const client = new OpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
});

const systemPrompt = `
    你是一名专业的小红书内容创作专家与资料研究员。  
    你的工作流程分为「多轮资料收集 → 判断是否继续 → 图片生成」三大阶段。

    ==================
    【你的终极目标】
    ==================
    给定一个主题后，你必须：

    1. 分析用户需求  
    2. 使用 infoSearch 工具反复收集所需资料（可能多轮）  
    3. 每轮资料收集后判断：  
    - 资料是否足够写出高质量的小红书内容  
    - 若不够 → 继续调用 infoSearch  
    - 最多调用 infoSearch 2次
    4. 当资料足够时，调用 generateImage 工具生成图片

    ==================
    【工具说明】
    ==================

    工具 1：infoSearch  
    用途：获取资料、趋势、背景、灵感、用户兴趣点  
    输入：{ "query": string }  
    输出：资料文本（string）  
    使用时机：当你认为资料不足以写出高质量内容时，你必须继续调用此工具。

    工具 2：generateImage
    用途：根据你生成的 prompt 生成小红书视觉风格图片  
    输入：{ "prompt": string }  
    输出：图片数据  
    使用时机：仅在「资料已足够」之后调用。

    ==================
    【重要限制】
    ==================
    - 在资料不足时禁止提前生成文案或图片 prompt  
    - 禁止提前调用 generateImage
    - 最后一次必须调用 generateImage 工具
    - 每次只进行一个工具调用  
    - 图片风格必须符合小红书视觉审美：治愈、清新、轻日系、美好生活感  
`;

// 工具定义
const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "infoSearch",
      description: "搜索资料、趋势、背景、灵感、用户兴趣点",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "需要检索的内容",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generateImage",
      description: "根据 prompt 生成小红书视觉风格图片",
      parameters: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "图片生成的 prompt",
          },
        },
        required: ["prompt"],
      },
    },
  },
];

// 执行工具调用
const executeToolCall = async (
  toolName: string,
  args: Record<string, unknown>
): Promise<string> => {
  switch (toolName) {
    case "generateImage": {
      const result = await generateImage(
        args.prompt as string,
        "gemini-2.5-flash-image", // 默认模型
        "1:1", // 默认尺寸
        undefined, // 无场景
        null // 无参考图片
      );
      return JSON.stringify(result);
    }
    case "infoSearch": {
      const result = await infoSearch(args.query as string);
      return result;
    }
    default:
      return `未知工具: ${toolName}`;
  }
};

export const agent = async (userMessage: string) => {
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  // 循环处理工具调用
  while (true) {
    const response = await client.chat.completions.create({
      model: "gemini-2.5-flash-lite-preview-06-17",
      messages,
      max_tokens: 4096,
      stream: false,
      tools,
    });

    console.log(`response: ${JSON.stringify(response)}`);

    const assistantMessage = response.choices[0].message;

    // 将 assistant 消息添加到历史
    messages.push(assistantMessage);

    // 检查是否有工具调用
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      // 处理所有工具调用
      for (const toolCall of assistantMessage.tool_calls) {
        // 类型检查：确保是标准的 function 类型工具调用
        if (toolCall.type !== "function") continue;

        const toolName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        console.log(`执行工具: ${toolName}`, args);

        // 执行工具
        const toolResult = await executeToolCall(toolName, args);
        console.log(`执行工具结果: ${toolResult}`);

        // 将工具结果添加到消息历史
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: toolResult,
        });
      }
    } else {
      // 没有工具调用，返回最终结果
      return {
        content: assistantMessage.content,
        messages,
      };
    }
  }
};
