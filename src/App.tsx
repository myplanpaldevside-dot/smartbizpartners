import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SmartBooksLayout from "./components/smartbooks/SmartBooksLayout";
import SmartBooksDashboard from "./pages/smartbooks/Dashboard";
import ComingSoon from "./pages/smartbooks/ComingSoon";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/smartbooks" element={<SmartBooksLayout />}>
            <Route index element={<SmartBooksDashboard />} />
            <Route path="invoices" element={<ComingSoon />} />
            <Route path="expenses" element={<ComingSoon />} />
            <Route path="crm" element={<ComingSoon />} />
            <Route path="inventory" element={<ComingSoon />} />
            <Route path="quotes" element={<ComingSoon />} />
            <Route path="website" element={<ComingSoon />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
