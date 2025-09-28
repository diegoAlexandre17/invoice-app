import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 relative">
        <div className="absolute top-4 right-4 z-50 w-20">
          <LanguageSwitcher />
        </div>
        <SidebarTrigger />
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
} 