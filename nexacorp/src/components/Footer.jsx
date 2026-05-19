import { Mail, Phone, Share2, Share, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sessionTracker } from '../utils/analytics';

export default function Footer() {
  const handleFooterClick = (label) => {
    sessionTracker.recordInteraction('footer_click', label);
  };

  return (
    <footer className="mt-16 px-4 sm:px-6">
      <div className="container-shell rounded-3xl border border-slate-200/80 bg-slate-950 text-slate-100 shadow-[0_22px_58px_rgba(2,6,23,0.38)] overflow-hidden">
        <div className="absolute" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 sm:p-10 lg:p-12">
          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-tight">NexaCorp</h3>
            <p className="text-sm text-slate-300">Enterprise security and cybersecurity solutions for the modern enterprise.</p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-tight">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" onClick={() => handleFooterClick('footer_services')} className="text-slate-300 hover:text-sky-300">Services</Link></li>
              <li><a href="#pricing" onClick={() => handleFooterClick('footer_pricing')} className="text-slate-300 hover:text-sky-300 transition cursor-pointer">Pricing</a></li>
              <li><a href="#security" onClick={() => handleFooterClick('footer_security')} className="text-slate-300 hover:text-sky-300 transition cursor-pointer">Security</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-tight">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" onClick={() => handleFooterClick('footer_about')} className="text-slate-300 hover:text-sky-300">About</Link></li>
              <li><Link to="/careers" onClick={() => handleFooterClick('footer_careers')} className="text-slate-300 hover:text-sky-300">Careers</Link></li>
              <li><a href="#blog" onClick={() => handleFooterClick('footer_blog')} className="text-slate-300 hover:text-sky-300 transition cursor-pointer">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 tracking-tight">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <a href="mailto:support@nexacorp.com" className="text-slate-300 hover:text-sky-300">support@nexacorp.com</a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="text-slate-300">+1 (800) 639-2291</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 px-8 sm:px-10 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">© 2024 NexaCorp. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" onClick={() => handleFooterClick('footer_linkedin')} className="text-slate-400 hover:text-sky-300">
                <Share2 size={20} />
              </a>
              <a href="#" onClick={() => handleFooterClick('footer_twitter')} className="text-slate-400 hover:text-sky-300">
                <Share size={20} />
              </a>
              <a href="#" onClick={() => handleFooterClick('footer_github')} className="text-slate-400 hover:text-sky-300">
                <Code size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
