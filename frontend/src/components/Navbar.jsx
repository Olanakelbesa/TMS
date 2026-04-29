import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Users, UserPlus, LogOut, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Browse Talent", path: "/talents", icon: Users },
    { name: "Join Network", path: "/talents/submit", icon: UserPlus },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-text-primary tracking-tight">
                Talentry
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive(link.path) 
                      ? "text-primary bg-primary-light" 
                      : "text-text-secondary hover:text-text-primary hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="h-4 w-px bg-slate-200"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/admin/dashboard">
                   <Button variant="ghost" className="text-sm font-semibold h-9 px-4">
                      Dashboard
                   </Button>
                </Link>
                <button onClick={logout} className="p-2 text-text-muted hover:text-red-500 transition-colors" title="Logout">
                   <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="secondary" className="h-9 px-5 text-sm font-semibold">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 p-2 hover:bg-slate-50 rounded-lg transition-colors">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-6 pt-2 pb-8 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
                    isActive(link.path) ? "bg-primary-light text-primary" : "text-text-secondary"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                {user ? (
                   <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block w-full">
                      <Button className="w-full font-bold">Admin Dashboard</Button>
                   </Link>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full">
                    <Button variant="secondary" className="w-full font-bold">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
