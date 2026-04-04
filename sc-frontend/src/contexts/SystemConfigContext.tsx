"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { adminApi } from "@/services/api";
import { useAuth } from "./AuthContext";
import type { SystemConfig } from "@/types";

interface SystemConfigValue {
  configs: Map<string, string>;
  updateConfig: (key: string, value: string) => Promise<void>;
  refreshConfigs: () => Promise<void>;
  isLoading: boolean;
}

const SystemConfigContext = createContext<SystemConfigValue | null>(null);

export function SystemConfigProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [configs, setConfigs] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // 加载配置
  const loadConfigs = async () => {
    if (!token) return;

    try {
      const response = await adminApi.getAllConfigs(token);
      const configMap = new Map<string, string>();
      response.configs.forEach((config: SystemConfig) => {
        configMap.set(config.key, config.value);
      });
      setConfigs(configMap);
    } catch (error) {
      console.error("加载系统配置失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, [token]);

  // 更新单个配置
  const updateConfig = async (key: string, value: string) => {
    if (!token) return;

    try {
      await adminApi.updateConfig(token, key, { value });
      setConfigs((prev) => new Map(prev).set(key, value));
    } catch (error) {
      console.error("更新配置失败:", error);
      throw error;
    }
  };

  return (
    <SystemConfigContext.Provider
      value={{
        configs,
        updateConfig,
        refreshConfigs: loadConfigs,
        isLoading,
      }}
    >
      {children}
    </SystemConfigContext.Provider>
  );
}

export function useSystemConfig() {
  const context = useContext(SystemConfigContext);
  if (!context) {
    throw new Error("useSystemConfig 必须在 SystemConfigProvider 内使用");
  }
  return context;
}
