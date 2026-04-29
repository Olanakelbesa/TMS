import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, User as UserIcon, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(form);
    if (success) navigate("/admin/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-light-bg-secondary flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="clean-card pt-10">

        <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2.5 mb-6">
              <div className="bg-primary p-2 rounded-xl">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold text-text-primary tracking-tight">
                Talentry
              </span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">Admin Access</h1>
            <p className="text-text-secondary mt-2">Enter your credentials to access the dashboard</p>
        </div>

        <div className=" p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Username"
              placeholder="Enter your username"
              icon={UserIcon}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-4 rounded-xl font-bold gap-2"
            >
              Sign In <ChevronRight className="w-4 h-4" />
            </Button>
          </form>

        </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-text-secondary">
          Not an admin? <span className="text-primary font-bold cursor-pointer hover:underline">Contact support</span>
        </p>
      </motion.div>
    </div>
  );
}
