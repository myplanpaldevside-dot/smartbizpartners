import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SmartBooksSidebar } from "./SmartBooksSidebar";
import { Outlet } from "react-router-dom";

export default function SmartBooksLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen min-h-[100dvh] flex w-full bg-background">
        <SmartBooksSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-3 sm:px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
            <SidebarTrigger className="mr-3" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-display text-xs font-semibold text-muted-foreground tracking-wide">SmartBooks</span>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
