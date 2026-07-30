"use client";

import { LoadedProvider } from "@/contexts/LoadedContext";
import DashboardLayoutContent from "./DashboardLayoutContent";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoadedProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </LoadedProvider>
  );
}
