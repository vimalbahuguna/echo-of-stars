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
import EphemerisViewer from "./components/EphemerisViewer";
import SOSOracle from "./components/SOSOracle";
import DailyHoroscopes from "./components/DailyHoroscopes";
import SettingsPage from "./pages/SettingsPage";
import SpiritualPractices from "./pages/SpiritualPractices";
import PranayamaPractice from "./components/PranayamaPractice";
import MeditationPractice from "./components/MeditationPractice";
import YogaNidraPractice from "./components/YogaNidraPractice";
import AsanaPractice from "./components/AsanaPractice";
import UpanishadTeachings from "./components/UpanishadTeachings";
import MantraJapa from "./components/MantraJapa";
import YoniTantraPuja from "./components/YoniTantraPuja";
import YoniTantraBook from "./components/YoniTantraBook";
import AstrologySection from "./pages/AstrologySection";
import RemedialMeasuresPage from "./pages/RemedialMeasuresPage";
import TransitAnalysisPage from "./pages/TransitAnalysisPage";
import DivisionalChartsPage from "./pages/DivisionalChartsPage";
import DashaSystemPage from "./pages/DashaSystemPage";
import { MobilePushService } from "./services/mobileServices";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize mobile services
    MobilePushService.initializePushNotifications();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
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
              <Route path="/compatibility" element={
                <ProtectedRoute>
                  <CompatibilityAnalyzer />
                </ProtectedRoute>
              } />
              <Route path="/ephemeris" element={
                <ProtectedRoute>
                  <EphemerisViewer />
                </ProtectedRoute>
              } />
              <Route path="/oracle" element={
                <ProtectedRoute>
                  <SOSOracle />
                </ProtectedRoute>
              } />
              <Route path="/daily-horoscopes" element={
                <ProtectedRoute>
                  <DailyHoroscopes />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/spiritual-practices" element={
                <ProtectedRoute>
                  <SpiritualPractices />
                </ProtectedRoute>
              } />
              <Route path="/spiritual-practices/pranayama" element={
                <ProtectedRoute>
                  <PranayamaPractice />
                </ProtectedRoute>
              } />
              <Route path="/spiritual-practices/meditation" element={
                <ProtectedRoute>
                  <MeditationPractice />
                </ProtectedRoute>
              } />
              <Route path="/spiritual-practices/yoga-nidra" element={
                <ProtectedRoute>
                  <YogaNidraPractice />
                </ProtectedRoute>
              } />
              <Route path="/spiritual-practices/asana" element={
                <ProtectedRoute>
                  <AsanaPractice />
                </ProtectedRoute>
              } />
              <Route path="/spiritual-practices/upanishad-teachings" element={
                <ProtectedRoute>
                  <UpanishadTeachings />
                </ProtectedRoute>
              } />
              <Route path="/spiritual-practices/mantra-japa" element={
                <ProtectedRoute>
                  <MantraJapa />
                </ProtectedRoute>
              } />
              <Route path="/spiritual-practices/yoni-tantra-puja" element={
                <ProtectedRoute>
                  <YoniTantraPuja onBack={() => window.history.back()} />
                </ProtectedRoute>
              } />
              <Route path="/spiritual-practices/yoni-tantra-book" element={
                <ProtectedRoute>
                  <YoniTantraBook />
                </ProtectedRoute>
              } />
              <Route path="/astrology" element={
                <ProtectedRoute>
                  <AstrologySection />
                </ProtectedRoute>
              } />
              <Route path="/remedial-measures" element={
                <ProtectedRoute>
                  <RemedialMeasuresPage />
                </ProtectedRoute>
              } />
              <Route path="/transits" element={
                <ProtectedRoute>
                  <TransitAnalysisPage />
                </ProtectedRoute>
              } />
              <Route path="/divisional-charts" element={
                <ProtectedRoute>
                  <DivisionalChartsPage />
                </ProtectedRoute>
              } />
              <Route path="/dasha-system" element={
                <ProtectedRoute>
                  <DashaSystemPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);
};

export default App;