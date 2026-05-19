import { useEffect } from 'react';
import { ArrowRight, Shield, Cloud, Lock, Eye, Zap, BarChart3 } from 'lucide-react';
import { sessionTracker, useScrollTracking } from '../utils/analytics';

export default function Services() {
  const trackScroll = useScrollTracking();

  useEffect(() => {
    sessionTracker.recordPageView('services');
    window.addEventListener('scroll', trackScroll);
    return () => {
      sessionTracker.recordPageExit();
      window.removeEventListener('scroll', trackScroll);
    };
  }, []);

  const services = [
    {
      icon: Shield,
      title: 'Threat Detection & Response',
      description: 'Real-time threat detection with AI-powered analytics. Identify and respond to threats in milliseconds.'
    },
    {
      icon: Cloud,
      title: 'Cloud Security Platform',
      description: 'Comprehensive cloud security across AWS, Azure, and GCP. Protect your entire cloud infrastructure.'
    },
    {
      icon: Lock,
      title: 'Identity & Access Management',
      description: 'Zero-trust architecture with advanced MFA and behavioral analytics for complete identity security.'
    },
    {
      icon: Eye,
      title: 'Security Monitoring & Visibility',
      description: 'Enterprise-wide visibility into security posture with customizable dashboards and alerts.'
    },
    {
      icon: Zap,
      title: 'Incident Response & Remediation',
      description: '24/7 incident response team. Automated remediation to minimize dwell time and impact.'
    },
    {
      icon: BarChart3,
      title: 'Compliance & Risk Management',
      description: 'Built-in compliance frameworks for SOC 2, ISO 27001, HIPAA, PCI-DSS and more.'
    }
  ];

  return (
    <div className="px-4 sm:px-6 space-y-10 pb-8">
      <section className="container-shell premium-card p-8 sm:p-10 lg:p-14 text-center">
        <p className="inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wider text-blue-800 bg-blue-100 mb-5">SECURITY SERVICES</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">A Full Security Stack for Enterprise Teams</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">From early threat detection to compliance intelligence, every capability is built for scale, speed, and operational clarity.</p>
      </section>

      <section className="container-shell">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <article
              key={i}
              onClick={() => sessionTracker.recordInteraction('service_view', service.title)}
              className="premium-card p-7 cursor-pointer"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <service.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-6 text-sm">{service.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sessionTracker.recordInteraction('service_learn_more', service.title);
                }}
                className="font-semibold text-blue-800 hover:text-sky-600 inline-flex items-center"
              >
                Learn More <ArrowRight size={17} className="ml-2" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 sm:p-10 lg:p-14 shadow-[0_20px_52px_rgba(15,23,42,0.32)]">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Schedule a Demo</h2>
          <p className="text-blue-100 text-lg mb-7">See how NexaCorp can protect your enterprise with proactive defense and streamlined operations.</p>
          <button
            onClick={() => sessionTracker.recordInteraction('contact_click', 'demo_request')}
            className="inline-flex px-7 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold shadow-[0_14px_30px_rgba(2,132,199,0.38)]"
          >
            Contact Sales
          </button>
        </div>
      </section>
    </div>
  );
}
