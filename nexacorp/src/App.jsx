import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Careers from './pages/Careers';
import Login from './pages/Login';
import Terminal from './pages/Terminal';
import Dashboard from './pages/Dashboard';
import { sessionTracker } from './utils/analytics';
import { X, Copy, Download } from 'lucide-react';

function AppLayout() {
  const [showDevTools, setShowDevTools] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Global mouse and right-click tracking
  useEffect(() => {
    const onMove = () => sessionTracker.recordMouseMove();
    const onRightClick = (e) => {
      e.preventDefault();
      sessionTracker.recordRightClick();
    };
    window.addEventListener('mousemove', onMove, { once: true });
    window.addEventListener('contextmenu', onRightClick);
    return () => window.removeEventListener('contextmenu', onRightClick);
  }, []);

  const handleCopySessionData = () => {
    const data = JSON.stringify(sessionTracker.getSessionData(), null, 2);
    navigator.clipboard.writeText(data).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    });
  };

  const handleDownloadSessionData = () => {
    const data = JSON.stringify(sessionTracker.getSessionData(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexacorp-session-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-6 sm:pt-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />

      {/* Invisible Dev Tools Button - click bottom right corner */}
      <button
        onClick={() => setShowDevTools(!showDevTools)}
        className="fixed bottom-0 right-0 opacity-0 w-1 h-1 cursor-default"
        title="Session Analytics"
        style={{ pointerEvents: 'auto' }}
      />

      {/* Dev Tools Modal */}
      {showDevTools && (
        <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 border border-slate-200 rounded-2xl shadow-[0_28px_64px_rgba(15,23,42,0.35)] max-w-4xl w-full max-h-[78vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Session Analytics (DEV)</h2>
              <button
                onClick={() => setShowDevTools(false)}
                className="p-2 hover:bg-slate-100 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <pre className="text-xs bg-slate-50 p-4 rounded-xl overflow-auto max-h-80 font-mono whitespace-pre-wrap break-words border border-slate-200 text-slate-700">
                {JSON.stringify(sessionTracker.getSessionData(), null, 2)}
              </pre>
            </div>

            <div className="flex gap-3 p-6 border-t border-slate-200 flex-wrap">
              <button
                onClick={handleCopySessionData}
                className="btn-primary flex items-center space-x-2 px-4 py-2.5 font-semibold"
              >
                <Copy size={18} />
                <span>{copiedToClipboard ? 'Copied!' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={handleDownloadSessionData}
                className="rounded-xl flex items-center space-x-2 px-4 py-2.5 bg-sky-600 text-white hover:bg-sky-500 font-semibold shadow-[0_10px_24px_rgba(2,132,199,0.32)]"
              >
                <Download size={18} />
                <span>Download JSON</span>
              </button>
              <button
                onClick={() => setShowDevTools(false)}
                className="ml-auto px-4 py-2.5 bg-slate-200 text-slate-900 rounded-xl hover:bg-slate-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
