import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { VehiclesListPage } from "@/pages/VehiclesListPage";
import { VehicleFormPage } from "@/pages/VehicleFormPage";
import { VehicleDetailPage } from "@/pages/VehicleDetailPage";
import { OwnersPage } from "@/pages/OwnersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="vehicules" element={<VehiclesListPage />} />
              <Route path="vehicules/nouveau" element={
                <ProtectedRoute roles={['admin', 'agent']}>
                  <VehicleFormPage />
                </ProtectedRoute>
              } />
              <Route path="vehicules/:id/edit" element={
                <ProtectedRoute roles={['admin', 'agent']}>
                  <VehicleFormPage />
                </ProtectedRoute>
              } />
              <Route path="vehicules/:id" element={<VehicleDetailPage />} />
              <Route path="proprietaires" element={<OwnersPage />} />
              <Route path="procedures" element={
                <ProtectedRoute roles={['admin', 'agent']}>
                  <div className="p-6"><h1 className="text-2xl font-bold">Procédures</h1><p className="text-muted-foreground">Page en cours de développement</p></div>
                </ProtectedRoute>
              } />
              <Route path="paiements" element={
                <ProtectedRoute roles={['admin', 'finance']}>
                  <div className="p-6"><h1 className="text-2xl font-bold">Paiements</h1><p className="text-muted-foreground">Page en cours de développement</p></div>
                </ProtectedRoute>
              } />
              <Route path="notifications" element={
                <ProtectedRoute roles={['admin', 'agent']}>
                  <div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1><p className="text-muted-foreground">Page en cours de développement</p></div>
                </ProtectedRoute>
              } />
              <Route path="admin/utilisateurs" element={
                <ProtectedRoute roles={['admin']}>
                  <div className="p-6"><h1 className="text-2xl font-bold">Gestion des utilisateurs</h1><p className="text-muted-foreground">Page en cours de développement</p></div>
                </ProtectedRoute>
              } />
              <Route path="parametres" element={
                <ProtectedRoute roles={['admin']}>
                  <div className="p-6"><h1 className="text-2xl font-bold">Paramètres</h1><p className="text-muted-foreground">Page en cours de développement</p></div>
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
