"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Lightbulb,
  Trash2,
  Download,
  Wand2,
  Loader2,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "./ActionButton";

const MOCK_TASKS: Task[] = [];

interface GeneratedImage {
  url: string;
  revised_prompt: string;
}

interface Task {
  id: string;
  prompt: string;
  status: "pending" | "completed" | "failed";
  model: string;
  createdAt: string;
  duration: string;
  resolution: string;
  imageUrl: string;
  images?: GeneratedImage[];
}

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    "gemini-3-pro-image-preview-4k"
  );
  const [ratio, setRatio] = useState("1:1");
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [currentImages, setCurrentImages] = useState<GeneratedImage[]>([]);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>("");

  // 生成图片处理函数
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("请输入图像描述");
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    const taskId = Date.now().toString();

    // 创建一个新的待处理任务
    const newTask: Task = {
      id: taskId,
      prompt: prompt,
      status: "pending",
      model: selectedModel,
      createdAt: "刚刚",
      duration: "-",
      resolution:
        ratio === "1:1"
          ? "1024x1024"
          : ratio === "16:9"
          ? "1920x1080"
          : "1280x960",
      imageUrl: "",
    };

    setTasks((prev) => [newTask, ...prev]);

    try {
      const result = await generateImage(prompt, selectedModel, ratio, [
        uploadedImageBase64,
      ]);

      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);

      // 更新任务状态为完成
      if (result.data && result.data.length > 0) {
        const updatedTask: Task = {
          ...newTask,
          status: "completed",
          duration: `${duration}s`,
          imageUrl: result.data[0].url,
          images: result.data,
        };

        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );

        // 设置当前显示的图片
        setCurrentImages(result.data);
      }
    } catch (error) {
      console.error(error);
      // 更新任务状态为失败
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: "failed" as const, duration: "失败" }
            : task
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    setPrompt("");
    setCurrentImages([]);
    setRatio("1:1");
    setUploadedImageBase64("");
  };

  // 删除任务
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
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
                onImageRemove={() => setUploadedImageBase64("")}
              />
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

        <div className="pt-8 border-t border-border mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              生成任务
            </h2>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="group border border-input rounded-lg p-4 bg-card hover:border-ring/50 transition-all flex flex-col sm:flex-row gap-4"
              >
                <div className="flex sm:hidden items-center justify-between">
                  <Badge
                    variant={
                      task.status === "completed"
                        ? "default"
                        : task.status === "failed"
                        ? "outline"
                        : "default"
                    }
                  >
                    {task.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {task.createdAt}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="hidden sm:block">
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "default"
                            : task.status === "failed"
                            ? "outline"
                            : "default"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-input">
                      {task.model}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      创建时间: {task.createdAt}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      执行时长: {task.duration}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wand2 className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground line-clamp-2">
                      {task.prompt}
                    </p>
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    尺寸: {task.resolution}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  {task.status === "pending" ? (
                    <div className="w-16 h-16 rounded-md bg-muted shrink-0 border border-input flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                    </div>
                  ) : task.imageUrl ? (
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0 border border-input">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={task.imageUrl}
                        alt="Generated"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-muted shrink-0 border border-input flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 opacity-50" />
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <ActionButton
                      icon={<Trash2 className="w-4 h-4" />}
                      label="删除"
                      variant="destructive"
                      onClick={() => handleDeleteTask(task.id)}
                    />
                    {task.imageUrl && (
                      <ActionButton
                        icon={<Download className="w-4 h-4" />}
                        label="下载"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = task.imageUrl;
                          link.download = `generated-${task.id}.png`;
                          link.click();
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
