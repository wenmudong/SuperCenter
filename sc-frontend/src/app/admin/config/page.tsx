"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import GradientText from "@/components/GradientText";
import type { SystemConfig } from "@/types";

const CONFIG_DEFINITIONS = [
  {
    key: "global_font",
    label: "全局字体",
    description: "设置网站使用的字体",
    type: "select",
    options: [
      { value: "FusionPixel", label: "像素字体 (FusionPixel)" },
      { value: "var(--font-geist-sans)", label: "系统字体 (Geist)" },
    ],
  },
  {
    key: "background_color",
    label: "背景颜色",
    description: "设置网站背景色",
    type: "color",
  },
  {
    key: "navbar_style",
    label: "导航栏样式",
    description: "设置导航栏的显示样式",
    type: "select",
    options: [
      { value: "transparent", label: "透明" },
      { value: "solid", label: "实色" },
      { value: "blur", label: "毛玻璃" },
    ],
  },
  {
    key: "site_title",
    label: "网站标题",
    description: "显示在浏览器标签页的标题",
    type: "text",
  },
  {
    key: "site_description",
    label: "网站描述",
    description: "网站简短描述",
    type: "textarea",
  },
];

export default function AdminConfigPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [configs, setConfigs] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 加载配置
  const loadConfigs = async () => {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8000/api/admin/config", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const configMap = new Map<string, string>();
        data.configs.forEach((config: SystemConfig) => {
          configMap.set(config.key, config.value);
        });
        setConfigs(configMap);
      }
    } catch (error) {
      console.error("加载配置失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    } else if (!authLoading && user?.role !== "admin") {
      router.push("/");
    } else {
      loadConfigs();
    }
  }, [user, authLoading, router, token]);

  // 保存配置
  const handleSave = async (key: string, value: string) => {
    if (!token) return;

    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:8000/api/admin/config/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });

      if (response.ok) {
        setConfigs((prev) => new Map(prev).set(key, value));
        showToast("保存成功", "success");
      } else {
        const data = await response.json();
        showToast(data.detail || "保存失败", "error");
      }
    } catch (error) {
      showToast("保存失败", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <GradientText className="text-lg">加载中...</GradientText>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="font-sans text-4xl font-extralight text-neutral-900">
            <GradientText>系统配置</GradientText>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">配置网站的全局设置</p>
        </div>

        {/* 配置列表 */}
        <div className="space-y-6">
          {CONFIG_DEFINITIONS.map((def) => (
            <div
              key={def.key}
              className="rounded-lg border border-neutral-200 bg-white/50 p-4 backdrop-blur-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-900">
                  {def.label}
                </label>
                <span className="text-xs text-neutral-400">{def.key}</span>
              </div>

              {def.description && (
                <p className="mb-3 text-xs text-neutral-500">{def.description}</p>
              )}

              {def.type === "select" && (
                <select
                  value={configs.get(def.key) || ""}
                  onChange={(e) => handleSave(def.key, e.target.value)}
                  disabled={isSaving}
                  className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none disabled:opacity-50"
                >
                  <option value="">请选择</option>
                  {def.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {def.type === "color" && (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={configs.get(def.key) || "#ffffff"}
                    onChange={(e) => handleSave(def.key, e.target.value)}
                    disabled={isSaving}
                    className="h-10 w-20 cursor-pointer rounded border border-neutral-300 disabled:opacity-50"
                  />
                  <span className="text-sm text-neutral-600">
                    {configs.get(def.key) || "#ffffff"}
                  </span>
                </div>
              )}

              {def.type === "text" && (
                <input
                  type="text"
                  value={configs.get(def.key) || ""}
                  onChange={(e) => handleSave(def.key, e.target.value)}
                  disabled={isSaving}
                  placeholder={`输入${def.label}`}
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none disabled:opacity-50"
                />
              )}

              {def.type === "textarea" && (
                <textarea
                  value={configs.get(def.key) || ""}
                  onChange={(e) => handleSave(def.key, e.target.value)}
                  disabled={isSaving}
                  placeholder={`输入${def.label}`}
                  rows={3}
                  className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none disabled:opacity-50"
                />
              )}
            </div>
          ))}
        </div>

        {/* 提示信息 */}
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white/30 p-4 backdrop-blur-sm">
          <p className="text-xs text-neutral-500">
            <span className="font-medium text-neutral-700">提示：</span>
            配置更改后会立即生效。部分配置可能需要刷新页面才能看到效果。
          </p>
        </div>
      </div>
    </div>
  );
}
