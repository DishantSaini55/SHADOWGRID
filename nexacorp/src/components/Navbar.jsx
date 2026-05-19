import { Link } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import { sessionTracker } from '../utils/analytics';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (label) => {
    sessionTracker.recordInteraction('nav_click', label);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="container-shell glass-panel rounded-2xl shadow-[0_18px_38px_rgba(15,23,42,0.12)]">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" onClick={() => handleNavClick('logo')} className="flex items-center space-x-3 group" aria-label="NexaCorp Home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-800 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-blue-900/30 group-hover:scale-105">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-extrabold tracking-tight text-slate-900 text-lg">NexaCorp</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link to="/" onClick={() => handleNavClick('home')} className="px-3 py-2 rounded-xl text-slate-600 hover:text-blue-800 hover:bg-blue-50/80 font-semibold">Home</Link>
            <Link to="/about" onClick={() => handleNavClick('about')} className="px-3 py-2 rounded-xl text-slate-600 hover:text-blue-800 hover:bg-blue-50/80 font-semibold">About</Link>
            <Link to="/services" onClick={() => handleNavClick('services')} className="px-3 py-2 rounded-xl text-slate-600 hover:text-blue-800 hover:bg-blue-50/80 font-semibold">Services</Link>
            <Link to="/careers" onClick={() => handleNavClick('careers')} className="px-3 py-2 rounded-xl text-slate-600 hover:text-blue-800 hover:bg-blue-50/80 font-semibold">Careers</Link>
            <Link to="/login" onClick={() => handleNavClick('portal_nav')} className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold">
              <LogIn size={16} /> Employee Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-blue-50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-5 px-4 space-y-2 animate-[rise-in_240ms_ease-out]">
            <Link to="/" onClick={() => handleNavClick('home')} className="block px-4 py-2.5 rounded-xl text-slate-700 hover:bg-blue-50 font-medium">Home</Link>
            <Link to="/about" onClick={() => handleNavClick('about')} className="block px-4 py-2.5 rounded-xl text-slate-700 hover:bg-blue-50 font-medium">About</Link>
            <Link to="/services" onClick={() => handleNavClick('services')} className="block px-4 py-2.5 rounded-xl text-slate-700 hover:bg-blue-50 font-medium">Services</Link>
            <Link to="/careers" onClick={() => handleNavClick('careers')} className="block px-4 py-2.5 rounded-xl text-slate-700 hover:bg-blue-50 font-medium">Careers</Link>
            <Link to="/login" onClick={() => handleNavClick('portal_nav')} className="btn-primary block px-4 py-2.5 text-center font-semibold">Employee Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
