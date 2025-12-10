"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Lightbulb,
  Trash2,
  Download,
  Copy,
  Edit,
  History,
  Camera,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock Data for Tasks
const MOCK_TASKS = [
  {
    id: "1",
    prompt: "一直小猫趴在床上",
    status: "completed",
    model: "gemini-2.5-flash-image-vip",
    createdAt: "25 minutes ago",
    duration: "20s",
    resolution: "1024x1024",
    imageUrl:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop", // Placeholder image
  },
];

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    "gemini-3-pro-image-preview-4k"
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <h1 className="text-xl font-bold">AI 图像生成</h1>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="appearance-none bg-background border border-input rounded-md px-3 py-1.5 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="gemini-3-pro-image-preview-4k">
                gemini-3-pro-image-preview-4k (nano-banana-2-4k)
              </option>
              <option value="gemini-2.5-flash">gemini-2.5-flash</option>
            </select>
            {/* Custom Arrow */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Reference Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                参考图片 (可选)
              </label>
              <div className="border-2 border-dashed border-input rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition-colors group">
                <div className="bg-muted p-3 rounded-full mb-3 group-hover:bg-muted/80 transition-colors">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  点击或拖拽上传图片
                </p>
                <p className="text-xs text-muted-foreground">
                  支持 JPG, PNG, WebP, 最大 10MB
                </p>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-muted-foreground">
                  图像描述
                </label>
                <Lightbulb className="w-4 h-4 text-yellow-500 cursor-pointer hover:text-yellow-400" />
              </div>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="场景：日落时分，一座宏伟的城堡庭院..."
                  className="w-full min-h-[180px] p-4 rounded-xl border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm leading-relaxed"
                />
              </div>
            </div>

            {/* Settings & Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">比例</span>
                <div className="relative">
                  <select className="appearance-none bg-background border border-input rounded-md px-3 py-1.5 text-sm pr-8 focus:outline-none min-w-[80px]">
                    <option>1:1</option>
                    <option>16:9</option>
                    <option>4:3</option>
                    <option>3:4</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <svg
                      width="8"
                      height="5"
                      viewBox="0 0 10 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 1L5 5L9 1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">数量</span>
                <div className="relative">
                  <select className="appearance-none bg-background border border-input rounded-md px-3 py-1.5 text-sm pr-8 focus:outline-none min-w-[60px]">
                    <option>1</option>
                    <option>2</option>
                    <option>4</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <svg
                      width="8"
                      height="5"
                      viewBox="0 0 10 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 1L5 5L9 1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex-1"></div>

              <Button
                variant="default"
                className="bg-orange-500 hover:bg-orange-600 text-white min-w-[100px]"
              >
                生成
              </Button>
              <Button
                variant="secondary"
                className="bg-muted text-muted-foreground hover:bg-muted/80"
              >
                重置
              </Button>
            </div>
          </div>

          {/* Right Panel: Preview */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[500px] border border-input border-dashed rounded-xl bg-muted/10 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-24 h-24 bg-muted/20 rounded-xl mb-4 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-sm">图像将在这里显示</p>
            </div>
          </div>
        </div>

        {/* Bottom: Task List */}
        <div className="pt-8 border-t border-border mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              生成任务 (1)
            </h2>
          </div>

          <div className="space-y-4">
            {MOCK_TASKS.map((task) => (
              <div
                key={task.id}
                className="group border border-input rounded-lg p-4 bg-card hover:border-ring/50 transition-all flex flex-col sm:flex-row gap-4"
              >
                {/* Status & Info Header (Mobile) */}
                <div className="flex sm:hidden items-center justify-between">
                  <Badge status={task.status} />
                  <span className="text-xs text-muted-foreground">
                    {task.createdAt}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="hidden sm:block">
                      <Badge status={task.status} />
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

                {/* Thumbnail & Actions */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0 border border-input">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={task.imageUrl}
                      alt="Generated"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <ActionButton
                      icon={<Trash2 className="w-4 h-4" />}
                      label="删除"
                      variant="destructive"
                    />
                    <ActionButton
                      icon={<Copy className="w-4 h-4" />}
                      label="插入"
                      className="bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                    />
                    <ActionButton
                      icon={<Download className="w-4 h-4" />}
                      label="下载"
                    />
                    <ActionButton
                      icon={<History className="w-4 h-4" />}
                      label="缓存"
                    />
                    <ActionButton
                      icon={<Edit className="w-4 h-4" />}
                      label="编辑"
                    />
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

// Helper Components

function Badge({ status }: { status: string }) {
  const styles = {
    completed:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    failed:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  const label = {
    completed: "已完成",
    pending: "进行中",
    failed: "失败",
  };

  return (
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded border",
        styles[status as keyof typeof styles]
      )}
    >
      {label[status as keyof typeof label] || status}
    </span>
  );
}

function ActionButton({
  icon,
  label,
  variant = "outline",
  className,
}: {
  icon: React.ReactNode;
  label: string;
  variant?: "outline" | "destructive" | "default";
  className?: string;
}) {
  const baseStyles = "h-8 px-3 text-xs gap-1.5";
  const variantStyles = {
    outline:
      "hover:bg-muted text-muted-foreground hover:text-foreground border-transparent hover:border-input",
    destructive:
      "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 border border-red-200 dark:border-red-900/50 bg-transparent",
    default: "",
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        baseStyles,
        variantStyles[variant as keyof typeof variantStyles],
        className
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
