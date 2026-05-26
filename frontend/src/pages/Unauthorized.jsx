import { useNavigate } from "react-router-dom";
import { MdLock, MdDashboard, MdArrowBack } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user }  = useAuth();

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-6">
      <div className="text-center max-w-sm w-full animate-fade-in">

        {/* Error code */}
        <p className="text-7xl font-bold text-app-elevated tracking-tight mb-2 select-none">403</p>

        {/* Icon */}
        <div className="inline-flex w-12 h-12 rounded-lg bg-red-400/8 border border-red-400/20
                        items-center justify-center mb-5">
          <MdLock className="text-red-400 text-xl" />
        </div>

        {/* Copy */}
        <h1 className="text-lg font-semibold text-gray-100 mb-2">Access Denied</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-2">
          You don't have permission to view this page.
        </p>

        {/* Role info */}
        {user?.role && (
          <p className="text-sm text-gray-600 mb-8">
            Your role is{" "}
            <span className="font-medium text-gray-400 bg-app-elevated px-1.5 py-0.5 rounded text-xs">
              {user.role}
            </span>
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary"
          >
            <MdDashboard className="text-base" />
            Return to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            <MdArrowBack className="text-base" />
            Go Back
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-700">
          Need access? Contact your system administrator.
        </p>
      </div>
    </div>
  );
}
