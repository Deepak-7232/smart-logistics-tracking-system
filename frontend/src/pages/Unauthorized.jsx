import { useNavigate } from "react-router-dom";
import { MdLock, MdDashboard, MdShield, MdArrowBack } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const navigate  = useNavigate();
  const { user }  = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-900/10 rounded-full blur-3xl" />
      </div>

      <div className="text-center max-w-md w-full z-10 animate-fade-in">

        {/* Lock icon with pulse ring */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 rounded-2xl bg-red-500/20 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-900/60 to-red-800/40
                          border border-red-500/30 flex items-center justify-center shadow-2xl shadow-red-900/30">
            <MdLock className="text-4xl text-red-400" />
          </div>
        </div>

        {/* Status code */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
          <MdShield className="text-red-400 text-sm" />
          <span className="text-red-400 text-xs font-bold tracking-widest uppercase">Error 403 — Forbidden</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-slate-100 mb-3">Access Denied</h1>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-2">
          You don't have permission to view this page.
        </p>

        {/* Role badge */}
        {user?.role && (
          <p className="text-slate-500 text-sm mb-8">
            Your current role is{" "}
            <span className={`font-bold px-2 py-0.5 rounded text-xs
              ${user.role === "ADMIN"
                ? "text-indigo-400 bg-indigo-500/15 border border-indigo-500/20"
                : "text-cyan-400 bg-cyan-500/15 border border-cyan-500/20"
              }`}
            >
              {user.role}
            </span>
            {" "}which cannot access this resource.
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500
                       text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-primary-900/30
                       hover:shadow-primary-900/50 hover:-translate-y-0.5"
          >
            <MdDashboard className="text-lg" />
            Return to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60
                       border border-slate-700/50 text-slate-300 text-sm font-medium transition-all duration-200"
          >
            <MdArrowBack className="text-lg" />
            Go Back
          </button>
        </div>

        {/* Footer hint */}
        <p className="mt-8 text-xs text-slate-600">
          Need access? Contact your system administrator.
        </p>
      </div>
    </div>
  );
}
