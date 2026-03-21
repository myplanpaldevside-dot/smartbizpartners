import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SmartBooksLayout from "./components/smartbooks/SmartBooksLayout";
import SmartBooksDashboard from "./pages/smartbooks/Dashboard";
import Invoices from "./pages/smartbooks/Invoices";
import Expenses from "./pages/smartbooks/Expenses";
import CRM from "./pages/smartbooks/CRM";
import Inventory from "./pages/smartbooks/Inventory";
import ComingSoon from "./pages/smartbooks/ComingSoon";
import Auth from "./pages/smartbooks/Auth";
import Pricing from "./pages/smartbooks/Pricing";
import AdminDashboard from "./pages/smartbooks/AdminDashboard";
import ProtectedRoute from "./components/smartbooks/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
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
              <Route path="quotes" element={<ComingSoon />} />
              <Route path="website" element={<ComingSoon />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
