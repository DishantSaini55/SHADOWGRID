import { ArrowRight, Shield, Zap, Lock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { sessionTracker, useScrollTracking } from '../utils/analytics';

export default function Home() {
  const trackScroll = useScrollTracking();

  useEffect(() => {
    sessionTracker.recordPageView('home');
    window.addEventListener('scroll', trackScroll);
    return () => {
      sessionTracker.recordPageExit();
      window.removeEventListener('scroll', trackScroll);
    };
  }, []);

  const handleCTAClick = (label) => {
    sessionTracker.recordInteraction('cta_click', label);
  };

  return (
    <div className="pb-8">
      <section className="px-4 sm:px-6">
        <div className="container-shell premium-card p-8 sm:p-10 lg:p-14 relative overflow-hidden fade-in">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_16%,rgba(14,165,233,0.2),transparent_38%)]" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wider text-blue-800 bg-blue-100 mb-5">ENTERPRISE CYBERSECURITY PLATFORM</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-5">
                Security Operations,
                <span className="text-blue-700"> Reimagined</span>
              </h1>
              <p className="text-lg sm:text-xl max-w-2xl mb-8 text-slate-600">
                NexaCorp unifies threat prevention, response, and compliance into a single premium control center for modern enterprise teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/services"
                  onClick={() => handleCTAClick('get_started')}
                  className="btn-primary px-7 py-3.5 font-semibold inline-flex items-center justify-center"
                >
                  Explore Services <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link
                  to="/login"
                  onClick={() => handleCTAClick('employee_portal')}
                  className="btn-secondary px-7 py-3.5 font-semibold text-center"
                >
                  Employee Portal
                </Link>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Protected Endpoints', value: '12.8M+' },
                { label: 'Median Response Time', value: '87 sec' },
                { label: 'Global Regions', value: '40+' },
                { label: 'Platform Availability', value: '99.99%' }
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 mt-10">
        <div className="container-shell">
          <div className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Why Security Teams Choose NexaCorp</h2>
            <p className="mt-3 text-slate-600">Modern architecture, clean workflows, and proactive threat intelligence in one platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: 'Adaptive Defense', desc: 'AI-assisted prevention tuned to your risk profile.' },
              { icon: Zap, title: 'Fast Operations', desc: 'Streamlined response paths for critical events.' },
              { icon: Lock, title: 'Compliance Built In', desc: 'Audit-ready controls for regulated environments.' },
              { icon: Globe, title: 'Global Resilience', desc: 'Distributed uptime and secure regional routing.' }
            ].map((feature, i) => (
              <article
                key={i}
                onClick={() => sessionTracker.recordInteraction('feature_view', feature.title)}
                className="premium-card p-6 cursor-pointer"
              >
                <div className="h-11 w-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                  <feature.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 mt-10">
        <div className="container-shell premium-card p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">Trusted by Industry Leaders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-7">
            {['TechCorp', 'FinanceHub', 'HealthSys', 'RetailMax', 'EnergyCo', 'DataFlow', 'CloudX', 'SecureNet'].map((company, i) => (
              <div
                key={i}
                onClick={() => sessionTracker.recordInteraction('logo_view', company)}
                className="h-20 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 font-semibold cursor-pointer hover:border-sky-300 hover:text-blue-700"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 mt-10">
        <div className="container-shell rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 sm:p-10 lg:p-14 shadow-[0_22px_55px_rgba(15,23,42,0.32)]">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Secure Your Enterprise?</h2>
            <p className="text-blue-100 text-lg mb-7">Join teams that rely on NexaCorp for always-on, high-trust security operations.</p>
            <Link
              to="/login"
              onClick={() => handleCTAClick('final_cta')}
              className="inline-flex px-7 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold shadow-[0_14px_30px_rgba(2,132,199,0.38)]"
            >
              Access Employee Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
