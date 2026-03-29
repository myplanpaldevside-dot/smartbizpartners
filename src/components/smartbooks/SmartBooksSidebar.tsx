import {
  FileText,
  Calculator,
  Users,
  Package,
  FileCheck,
  LayoutDashboard,
  ArrowLeft,
  Shield,
  ShoppingBag,
  ShoppingCart,
  ChartNoAxesCombined,
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
  { title: "Invoices", url: "/smartbooks/invoices", icon: FileText },
  { title: "Expenses", url: "/smartbooks/expenses", icon: Calculator },
  { title: "Customers", url: "/smartbooks/crm", icon: Users },
  { title: "Inventory", url: "/smartbooks/inventory", icon: Package },
  { title: "Quotes", url: "/smartbooks/quotes", icon: FileCheck },
  { title: "Store", url: "/smartbooks/store", icon: ShoppingBag },
  { title: "Orders", url: "/smartbooks/orders", icon: ShoppingCart },
  { title: "Reports", url: "/smartbooks/reports", icon: ChartNoAxesCombined },
];

export function SmartBooksSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { isAdmin, profile } = useAuth();
  const businessName = profile?.business_name || "SmartBooks";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-3">
        <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium">
          <ArrowLeft className="h-3.5 w-3.5" />
          {!collapsed && <span>Back to Home</span>}
        </a>
        {!collapsed && (
          <div className="mt-3 px-1">
            <h1 className="font-display text-lg font-bold text-foreground truncate">{businessName}</h1>
            <p className="text-[10px] text-muted-foreground">Business Dashboard</p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest uppercase text-muted-foreground/70 font-semibold">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/smartbooks"}
                      className="hover:bg-accent/50 transition-colors rounded-lg"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] tracking-widest uppercase text-muted-foreground/70 font-semibold">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/smartbooks/admin"
                      className="hover:bg-accent/50 transition-colors rounded-lg"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      {!collapsed && <span className="text-sm">Admin Panel</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <p className="text-[10px] text-muted-foreground/40 text-center">
            {businessName}
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
