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

      if (data.role === ROLES.DRIVER) {
        try {
          const profile = await authService.getMyProfile(data.email);
          setProfile(profile);
        } catch {
          // Non-critical
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
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-10 h-10 rounded-lg bg-primary-500 items-center justify-center mb-4">
            <MdLocalShipping className="text-white text-lg" />
          </div>
          <h1 className="text-xl font-semibold text-gray-100">LogiTrack</h1>
          <p className="text-xs text-gray-600 mt-1">Smart Logistics Management</p>
        </div>

        {/* Card */}
        <div className="card p-6 shadow-lg">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-100">Sign in to your account</h2>
            <p className="text-xs text-gray-600 mt-0.5">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
            <Button type="submit" loading={isSubmitting} fullWidth className="mt-1">
              Sign In <MdArrowForward className="text-sm" />
            </Button>
          </form>

          {/* Register link */}
          <p className="text-center text-xs text-gray-600 mt-5">
            New driver?{" "}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 transition-colors">
              Create an account
            </Link>
          </p>

          {/* Test accounts */}
          <div className="mt-5 pt-4 border-t border-app-border">
            <p className="text-[10px] text-gray-700 font-medium mb-2 uppercase tracking-wider">
              Test Accounts
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-mono">deepak@gmail.com / 123456</span>
                <span className="text-[10px] font-medium text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded">
                  ADMIN
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-mono">user@gmail.com / 123456</span>
                <span className="text-[10px] font-medium text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                  DRIVER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
