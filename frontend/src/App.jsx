import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const TalentSubmit = lazy(() => import("./pages/TalentSubmit"));
const TalentDirectory = lazy(() => import("./pages/TalentDirectory"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Login = lazy(() => import("./pages/Login"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? children : <Navigate to="/login" />;
};

const LayoutWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes with Navbar */}
            <Route path="/" element={<LayoutWrapper><Home /></LayoutWrapper>} />
            <Route path="/talents" element={<LayoutWrapper><TalentDirectory /></LayoutWrapper>} />
            <Route path="/talents/submit" element={<LayoutWrapper><TalentSubmit /></LayoutWrapper>} />
            <Route path="/login" element={<LayoutWrapper><Login /></LayoutWrapper>} />

            {/* Admin Routes (Custom Layout) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Backward compatibility / Fallbacks */}
            <Route path="/talents/list" element={<Navigate to="/talents" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
        
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#fff',
              borderRadius: '16px',
              padding: '12px 16px',
            },
          }} 
        />
      </Router>
    </AuthProvider>
  );
}
