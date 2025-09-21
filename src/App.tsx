import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { LegalFooter } from "@/components/LegalFooter";
import { ConsentBanner } from "@/components/ConsentBanner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import RequestDetail from "./pages/RequestDetail";
import SubmitRequest from "./pages/SubmitRequest";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import UpdatePassword from "./pages/UpdatePassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/request/:id" element={<RequestDetail />} />
                <Route path="/submit" element={<SubmitRequest />} />
                <Route path="/about" element={<About />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/my-dashboard" element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/auth" element={<Auth />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <LegalFooter />
            <ConsentBanner />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
