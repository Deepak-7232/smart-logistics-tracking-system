import { useNavigate } from "react-router-dom";
import { MdLock, MdArrowBack } from "react-icons/md";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center max-w-sm animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center
                        justify-center mx-auto mb-5">
          <MdLock className="text-3xl text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Access Denied</h1>
        <p className="text-slate-400 text-sm mb-8">
          You don't have permission to view this page.
          Contact your administrator if you think this is a mistake.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary text-sm mx-auto"
        >
          <MdArrowBack /> Go Back
        </button>
      </div>
    </div>
  );
}
