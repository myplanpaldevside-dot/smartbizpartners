import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SmartBooksSidebar } from "./SmartBooksSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function SmartBooksLayout() {
  const { profile } = useAuth();
  const location = useLocation();
  const businessName = profile?.business_name || "SmartBooks";
  const pageTitle =
    {
      "/smartbooks": "Dashboard",
      "/smartbooks/invoices": "Invoices",
      "/smartbooks/expenses": "Expenses",
      "/smartbooks/crm": "Customers",
      "/smartbooks/inventory": "Inventory",
      "/smartbooks/quotes": "Quotes",
      "/smartbooks/store": "Store",
      "/smartbooks/orders": "Orders",
      "/smartbooks/reports": "Reports",
      "/smartbooks/admin": "Admin",
    }[location.pathname] || "SmartBooks";
  const businessInitial = businessName.charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <div className="min-h-screen min-h-[100dvh] flex w-full bg-background">
        <SmartBooksSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-3 py-3 backdrop-blur-sm sm:px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="shrink-0" />
              <div className="flex min-w-0 items-center gap-3">
                {profile?.logo_url ? (
                  <img src={profile.logo_url} alt={businessName} className="h-10 w-10 rounded-2xl border border-border object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 font-display text-sm font-bold text-primary">
                    {businessInitial}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{businessName}</p>
                  <h1 className="truncate font-display text-base font-bold text-foreground sm:text-lg">{pageTitle}</h1>
                </div>
              </div>
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
