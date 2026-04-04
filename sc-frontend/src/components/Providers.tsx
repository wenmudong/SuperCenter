"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/Toast";
import { SystemConfigProvider } from "@/contexts/SystemConfigContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SystemConfigProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </SystemConfigProvider>
    </AuthProvider>
  );
}
