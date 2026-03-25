import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SmartBooksSidebar } from "./SmartBooksSidebar";
import { Outlet } from "react-router-dom";

export default function SmartBooksLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen min-h-[100dvh] flex w-full bg-background">
        <SmartBooksSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 sm:h-14 flex items-center border-b border-border px-3 sm:px-4 bg-background sticky top-0 z-30">
            <SidebarTrigger className="mr-3" />
            <span className="font-display text-xs sm:text-sm font-semibold text-muted-foreground">SmartBooks</span>
          </header>
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
