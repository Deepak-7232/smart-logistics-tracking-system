import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { MdLocalShipping, MdArrowForward, MdEmail, MdLock } from "react-icons/md";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../schemas/loginSchema";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { ROLES } from "../constants/roles";

export default function Login() {
  const { login, setProfile } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ email, password }) => {
    try {
      const data = await authService.login(email, password);
      login(data);

      // Fetch full profile for DRIVER so we have id, name, vehicleAssigned etc.
      if (data.role === ROLES.DRIVER) {
        try {
          const profile = await authService.getMyProfile(data.email);
          setProfile(profile);
        } catch {
          // Non-critical — profile can be re-fetched on /my-vehicle page
        }
      }

      toast.success(`Welcome back! Signed in as ${data.role}.`);
      navigate("/dashboard");
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error("Could not connect to server. Is the backend running?");
      }
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
              id="email" type="email" label="Email Address"
              placeholder="admin@logistics.com" icon={MdEmail}
              error={errors.email?.message} {...register("email")}
            />
            <Input
              id="password" type="password" label="Password"
              placeholder="••••••••" icon={MdLock}
              error={errors.password?.message} {...register("password")}
            />
            <Button type="submit" loading={isSubmitting} fullWidth size="lg" className="mt-2">
              Sign In <MdArrowForward />
            </Button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500 mt-5">
            New driver?{" "}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create an account
            </Link>
          </p>

          {/* Test accounts */}
          <div className="mt-5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
            <p className="text-[11px] text-slate-500 font-medium mb-2 uppercase tracking-wider">Test Accounts</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">deepak@gmail.com / 123456</span>
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">ADMIN</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">user@gmail.com / 123456</span>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">DRIVER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
