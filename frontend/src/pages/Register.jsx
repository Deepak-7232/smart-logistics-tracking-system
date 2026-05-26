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
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-10 h-10 rounded-lg bg-primary-500 items-center justify-center mb-4">
            <MdLocalShipping className="text-white text-lg" />
          </div>
          <h1 className="text-xl font-semibold text-gray-100">Join LogiTrack</h1>
          <p className="text-xs text-gray-600 mt-1">Create your driver account</p>
        </div>

        {/* Card */}
        <div className="card p-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-100">Driver Registration</h2>
              <p className="text-xs text-gray-600 mt-0.5">Fill in your details below</p>
            </div>
            <span className="text-[10px] font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              DRIVER
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
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

            <Button type="submit" loading={isSubmitting} fullWidth className="mt-1">
              Create Account <MdArrowForward className="text-sm" />
            </Button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-primary-400 hover:text-primary-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
