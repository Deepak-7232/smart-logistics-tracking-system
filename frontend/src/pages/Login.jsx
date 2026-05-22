import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { MdLocalShipping, MdArrowForward } from "react-icons/md";
import { MdEmail, MdLock } from "react-icons/md";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../schemas/loginSchema";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ email, password }) => {
    try {
      const data = await authService.login(email, password);
      if (typeof data === "string" && data.toLowerCase().includes("invalid")) {
        toast.error("Invalid email or password");
      } else {
        login(data);
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch {
      toast.error("Could not connect to server. Is the backend running?");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600
                          items-center justify-center shadow-xl shadow-primary-900/40 mb-4">
            <MdLocalShipping className="text-3xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">LogiTrack</h1>
          <p className="text-sm text-slate-400 mt-1">Smart Logistics Management</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 bg-slate-900/80 border border-slate-700/60">
          <h2 className="text-lg font-semibold text-slate-100 mb-1">Sign in to your account</h2>
          <p className="text-sm text-slate-500 mb-7">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="admin@logistics.com"
              icon={MdEmail}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              icon={MdLock}
              error={errors.password?.message}
              {...register("password")}
            />

            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth
              size="lg"
              className="mt-2"
            >
              Sign In <MdArrowForward />
            </Button>
          </form>

          <p className="text-xs text-slate-600 text-center mt-6">
            Default: any registered user in your MySQL database
          </p>
        </div>
      </div>
    </div>
  );
}
