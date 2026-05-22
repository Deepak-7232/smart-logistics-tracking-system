import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/dashboard";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-card p-8 text-center border border-red-500/20">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-slate-100 mb-2">Something went wrong</h1>
          <p className="text-sm text-slate-400 mb-2">
            An unexpected error occurred. Our team has been notified.
          </p>

          {/* Error details (dev-friendly) */}
          {this.state.error?.message && (
            <pre className="text-left text-xs bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 text-red-300 overflow-auto mb-5 max-h-32">
              {this.state.error.message}
            </pre>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-slate-300
                         hover:bg-slate-700 hover:text-slate-100 transition-all duration-200"
            >
              Reload Page
            </button>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 text-sm rounded-xl bg-primary-600 text-white
                         hover:bg-primary-500 transition-all duration-200 font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}
