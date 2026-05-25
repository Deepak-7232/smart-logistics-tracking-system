import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  MdLocalShipping, MdArrowForward, MdEmail, MdLock,
  MdPerson, MdPhone, MdBadge,
} from "react-icons/md";
import authService from "../services/authService";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const registerSchema = z.object({
  name:          z.string().min(2, "Name must be at least 2 characters"),
  email:         z.string().email("Enter a valid email address"),
  password:      z.string().min(6, "Password must be at least 6 characters"),
  phone:         z.string().min(10, "Enter a valid phone number"),
  licenseNumber: z.string().min(3, "Enter a valid license number"),
});

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      await authService.register(data);
      toast.success("Account created! You can now log in.");
      navigate("/");
    } catch (err) {
      if (err?.response?.status === 409 || err?.response?.status === 500) {
        toast.error("Email already registered. Please log in.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600
                          items-center justify-center shadow-xl shadow-cyan-900/40 mb-4">
            <MdLocalShipping className="text-3xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Join LogiTrack</h1>
          <p className="text-sm text-slate-400 mt-1">Create your driver account</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 bg-slate-900/80 border border-slate-700/60">
          {/* DRIVER badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-lg
                             text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
              DRIVER REGISTRATION
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              id="name" label="Full Name *" placeholder="Rahul Kumar"
              icon={MdPerson} error={errors.name?.message} {...register("name")}
            />
            <Input
              id="reg-email" type="email" label="Email Address *"
              placeholder="driver@logistics.com" icon={MdEmail}
              error={errors.email?.message} {...register("email")}
            />
            <Input
              id="reg-password" type="password" label="Password *"
              placeholder="Minimum 6 characters" icon={MdLock}
              error={errors.password?.message} {...register("password")}
            />
            <Input
              id="phone" label="Phone Number *" placeholder="+91 99999 00000"
              icon={MdPhone} error={errors.phone?.message} {...register("phone")}
            />
            <Input
              id="license" label="License Number *" placeholder="DL-0120110012345"
              icon={MdBadge} error={errors.licenseNumber?.message}
              {...register("licenseNumber")}
            />

            <Button type="submit" loading={isSubmitting} fullWidth size="lg" className="mt-2">
              Create Account <MdArrowForward />
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <Link to="/" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
