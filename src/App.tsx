import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import BirthChartCalculator from "./components/BirthChartCalculator";
import CompatibilityAnalyzer from "./components/CompatibilityAnalyzer";
import EphemerisViewer from "./components/EphemerisViewer"; // New import
import SOSOracle from "./components/SOSOracle"; // New import for SOSOracle

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/birth-chart" element={
              <ProtectedRoute>
                <BirthChartCalculator />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/compatibility" element={ // New Route
              <ProtectedRoute>
                <CompatibilityAnalyzer />
              </ProtectedRoute>
            } />
            <Route path="/ephemeris" element={ // New Route for Ephemeris
              <ProtectedRoute>
                <EphemerisViewer />
              </ProtectedRoute>
            } />
            <Route path="/oracle" element={ // New Route for SOS Oracle
              <ProtectedRoute>
                <SOSOracle />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
