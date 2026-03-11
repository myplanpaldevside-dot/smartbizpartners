import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SmartBooksSidebar } from "./SmartBooksSidebar";
import { Outlet } from "react-router-dom";

export default function SmartBooksLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SmartBooksSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 bg-background">
            <SidebarTrigger className="mr-4" />
            <span className="font-display text-sm font-semibold text-muted-foreground">SmartBooks</span>
          </header>
          <main className="flex-1 p-6 md:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
