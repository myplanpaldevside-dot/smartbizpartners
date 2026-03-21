import {
  FileText,
  Calculator,
  Users,
  Package,
  FileCheck,
  Globe,
  LayoutDashboard,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const tools = [
  { title: "Dashboard", url: "/smartbooks", icon: LayoutDashboard },
  { title: "Invoices & Payments", url: "/smartbooks/invoices", icon: FileText },
  { title: "Expenses & Profit", url: "/smartbooks/expenses", icon: Calculator },
  { title: "Customer CRM", url: "/smartbooks/crm", icon: Users },
  { title: "Inventory", url: "/smartbooks/inventory", icon: Package },
  { title: "Quotes & Proposals", url: "/smartbooks/quotes", icon: FileCheck },
  { title: "Website Generator", url: "/smartbooks/website", icon: Globe },
];

export function SmartBooksSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium tracking-wide uppercase">
          <ArrowLeft className="h-3 w-3" />
          {!collapsed && <span>Back to SmartBiz</span>}
        </a>
        {!collapsed && (
          <div className="mt-4">
            <h1 className="font-display text-xl font-bold text-foreground">SmartBooks</h1>
            <p className="text-[10px] tracking-[0.2em] text-primary uppercase font-semibold">Business Tools</p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-semibold">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/smartbooks"}
                      className="hover:bg-accent/10 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-semibold">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/smartbooks/admin"
                      className="hover:bg-accent/10 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      {!collapsed && <span>Admin Panel</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <p className="text-[10px] text-muted-foreground text-center">
            Powered by SmartBiz Partners
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
