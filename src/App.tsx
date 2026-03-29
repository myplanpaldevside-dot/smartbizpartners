import { lazy, Suspense, forwardRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/smartbooks/ProtectedRoute";

// Lazy load SmartBooks pages for faster initial load
const SmartBooksLayout = lazy(() => import("./components/smartbooks/SmartBooksLayout"));
const SmartBooksDashboard = lazy(() => import("./pages/smartbooks/Dashboard"));
const Invoices = lazy(() => import("./pages/smartbooks/Invoices"));
const Expenses = lazy(() => import("./pages/smartbooks/Expenses"));
const CRM = lazy(() => import("./pages/smartbooks/CRM"));
const Inventory = lazy(() => import("./pages/smartbooks/Inventory"));
const Quotes = lazy(() => import("./pages/smartbooks/Quotes"));

const Auth = lazy(() => import("./pages/smartbooks/Auth"));
const Pricing = lazy(() => import("./pages/smartbooks/Pricing"));
const AdminDashboard = lazy(() => import("./pages/smartbooks/AdminDashboard"));
const ResetPassword = lazy(() => import("./pages/smartbooks/ResetPassword"));
const Store = lazy(() => import("./pages/smartbooks/Store"));
const Orders = lazy(() => import("./pages/smartbooks/Orders"));
const Reports = lazy(() => import("./pages/smartbooks/Reports"));
const Storefront = lazy(() => import("./pages/Storefront"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));

const queryClient = new QueryClient();

const SmartBooksLoader = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-sm text-muted-foreground font-medium">Loading SmartBooks...</p>
    </div>
  </div>
));
SmartBooksLoader.displayName = "SmartBooksLoader";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<SmartBooksLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/store/:slug" element={<Storefront />} />
              <Route path="/store/order-success" element={<OrderSuccess />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/smartbooks/auth" element={<Auth />} />
              <Route path="/smartbooks/pricing" element={<Pricing />} />
              <Route
                path="/smartbooks"
                element={
                  <ProtectedRoute>
                    <SmartBooksLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<SmartBooksDashboard />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="crm" element={<CRM />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="quotes" element={<Quotes />} />
                
                <Route path="store" element={<Store />} />
                <Route path="orders" element={<Orders />} />
                <Route path="reports" element={<Reports />} />
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
