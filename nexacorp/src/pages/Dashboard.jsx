import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionTracker } from '../utils/analytics';
import { LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    sessionTracker.recordPageView('dashboard');
    sessionTracker.recordInteraction('dashboard_access', 'page', { timestamp: Date.now() });

    // Simulate loading with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 40;
      });
    }, 300);

    // Redirect after 3 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
      sessionTracker.recordPageExit();
      sessionTracker.recordInteraction('dashboard_redirect', 'page');
      navigate('/login');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="px-4 sm:px-6 pb-12 min-h-[80vh] flex items-center justify-center">
      <div className="container-shell premium-card overflow-hidden max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 to-sky-900 text-white p-8 flex items-center space-x-4 border-b border-slate-800">
          <LayoutDashboard size={32} />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">NexaCorp Dashboard</h1>
            <p className="text-sky-200">Loading your workspace...</p>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="p-8 space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Loading dashboard</span>
              <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-100 rounded-xl p-6 space-y-3">
                <div className="h-6 bg-slate-300 rounded-lg w-3/4 animate-pulse" />
                <div className="h-4 bg-slate-300 rounded-lg w-full animate-pulse" />
                <div className="h-4 bg-slate-300 rounded-lg w-5/6 animate-pulse" />
                <div className="flex space-x-2 pt-2">
                  <div className="h-8 bg-slate-300 rounded-lg flex-1 animate-pulse" />
                  <div className="h-8 bg-slate-300 rounded-lg flex-1 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Status Messages */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6 space-y-2">
            <p className="text-sm font-semibold text-blue-900">System Status:</p>
            <div className="text-xs text-blue-800 space-y-1">
              <div>✓ Authenticating credentials...</div>
              <div>✓ Loading user permissions...</div>
              <div>• Initializing workspace...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
