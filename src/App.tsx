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
import ComingSoon from "./pages/smartbooks/ComingSoon";
import Auth from "./pages/smartbooks/Auth";
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
              <Route path="expenses" element={<ComingSoon />} />
              <Route path="crm" element={<ComingSoon />} />
              <Route path="inventory" element={<ComingSoon />} />
              <Route path="quotes" element={<ComingSoon />} />
              <Route path="website" element={<ComingSoon />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
