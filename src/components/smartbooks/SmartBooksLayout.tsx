import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SmartBooksSidebar } from "./SmartBooksSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SmartBooksLayout() {
  const { profile, user, refreshProfile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [bizName, setBizName] = useState("");
  const [saving, setSaving] = useState(false);

  const needsBusinessName = profile && !profile.business_name;
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

  const handleSaveBusinessName = async () => {
    if (!bizName.trim() || !user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ business_name: bizName.trim(), updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      try {
        await refreshProfile();
      } catch {
        // profile will reload on next render
      }
      toast({ title: "Welcome to SmartBooks!" });
    }
  };

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

      {/* First-time setup for Google sign-in users with no business name */}
      <Dialog open={!!needsBusinessName} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm rounded-2xl" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-display">One last thing</DialogTitle>
            <DialogDescription>What's the name of your business?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Business Name *</Label>
              <Input
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                placeholder="e.g. Ola's Fashion Hub"
                className="rounded-lg"
                onKeyDown={(e) => e.key === "Enter" && handleSaveBusinessName()}
                autoFocus
              />
            </div>
            <Button
              className="w-full rounded-lg"
              onClick={handleSaveBusinessName}
              disabled={saving || !bizName.trim()}
            >
              {saving ? "Saving..." : "Get Started"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
