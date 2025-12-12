"use client";

import { useState } from "react";
import { Image as ImageIcon, Lightbulb, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateImage } from "./server";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import { prompts } from "./prompts";
import { agent } from "./agent";

interface GeneratedImage {
  url: string;
  revised_prompt: string;
}

export default function ImageGenerationPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash-image");
  const [ratio, setRatio] = useState("1:1");
  const [scene, setScene] = useState<keyof typeof prompts | undefined>(
    undefined
  );
  const [currentImages, setCurrentImages] = useState<GeneratedImage[]>([]);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(
    null
  );

  // 生成图片处理函数
  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await agent(
        prompt
        // selectedModel,
        // ratio,
        // scene,
        // uploadedImageBase64 ? [uploadedImageBase64] : null
      );
      console.log(result);
      toast.success("图像生成成功");
      //   setCurrentImages(result.data);
    } catch (error) {
      toast.error("图像生成失败");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    setPrompt("");
    setCurrentImages([]);
    setRatio("1:1");
    setUploadedImageBase64(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <h1 className="text-xl font-bold">AI 图像生成</h1>
          <div className="relative">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="模型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-3-pro-image-preview-4k">
                  gemini-3-pro-image-preview-4k
                </SelectItem>
                <SelectItem value="gemini-2.5-flash-image">
                  gemini-2.5-flash-image
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                参考图片 (可选)
              </label>
              <ImageUpload
                onImageUpload={(base64) => setUploadedImageBase64(base64)}
                onImageRemove={() => setUploadedImageBase64(null)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-muted-foreground">
                  场景
                </label>
              </div>
              <div className="relative">
                <Select
                  value={scene}
                  onValueChange={(value) =>
                    setScene(value as keyof typeof prompts)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="场景" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="小红书">小红书</SelectItem>
                    <SelectItem value="最美证件照">最美证件照</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-muted-foreground">
                  图像描述
                </label>
                <Lightbulb className="w-4 h-4 text-yellow-500 cursor-pointer hover:text-yellow-400" />
              </div>
              <div className="relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="场景：日落时分，一座宏伟的城堡庭院..."
                  className="w-full min-h-[180px] p-4 rounded-xl border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">比例</span>
                <div className="relative">
                  <Select value={ratio} onValueChange={setRatio}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="比例" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">数量</span>
                <div className="relative">
                  <Select value={count} onValueChange={setCount}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="数量" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div> */}

              <div className="flex-1"></div>

              <Button
                variant="default"
                className="bg-orange-500 hover:bg-orange-600 text-white min-w-[100px]"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  "生成"
                )}
              </Button>
              <Button
                variant="secondary"
                className="bg-muted text-muted-foreground hover:bg-muted/80"
                onClick={handleReset}
                disabled={isLoading}
              >
                重置
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="h-full min-h-[500px] border border-input border-dashed rounded-xl bg-muted/10 flex flex-col items-center justify-center text-muted-foreground">
              {isLoading ? (
                // 加载动画
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-4" />
                  <p className="text-sm text-muted-foreground">
                    正在生成图像，请稍候...
                  </p>
                </div>
              ) : currentImages.length > 0 ? (
                // 显示生成的图片
                <div className="w-full h-full p-4 overflow-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border border-input bg-card"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.url}
                          alt={`Generated ${index + 1}`}
                          className="w-full h-auto object-contain"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs text-white truncate">
                            {image.revised_prompt}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-black"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = image.url;
                              link.download = `generated-${index + 1}.png`;
                              link.click();
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // 默认空状态
                <>
                  <div className="w-24 h-24 bg-muted/20 rounded-xl mb-4 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 opacity-50" />
                  </div>
                  <p className="text-sm">图像将在这里显示</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
