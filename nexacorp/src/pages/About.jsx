import { useEffect } from 'react';
import { sessionTracker, useScrollTracking } from '../utils/analytics';

export default function About() {
  const trackScroll = useScrollTracking();

  useEffect(() => {
    sessionTracker.recordPageView('about');
    window.addEventListener('scroll', trackScroll);
    return () => {
      sessionTracker.recordPageExit();
      window.removeEventListener('scroll', trackScroll);
    };
  }, []);

  const team = [
    { name: 'Sarah Chen', role: 'CEO & Founder', image: 'https://picsum.photos/300/300?random=1' },
    { name: 'Michael Torres', role: 'CTO', image: 'https://picsum.photos/300/300?random=2' },
    { name: 'Emily Rodriguez', role: 'VP Security', image: 'https://picsum.photos/300/300?random=3' },
    { name: 'James Mitchell', role: 'VP Sales', image: 'https://picsum.photos/300/300?random=4' },
    { name: 'Lisa Park', role: 'Chief Architect', image: 'https://picsum.photos/300/300?random=5' },
    { name: 'David Kumar', role: 'VP Operations', image: 'https://picsum.photos/300/300?random=6' }
  ];

  return (
    <div className="px-4 sm:px-6 space-y-10 pb-8">
      <section className="container-shell premium-card p-8 sm:p-10 lg:p-14 text-center">
        <p className="inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wider text-blue-800 bg-blue-100 mb-5">ABOUT NEXACORP</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">Building Trust Through Better Security</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">Leading the future of enterprise cybersecurity with resilient architecture, transparent operations, and high-confidence protection.</p>
      </section>

      <section className="container-shell grid lg:grid-cols-3 gap-6">
        <article className="premium-card p-7 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Our Story</h2>
          <p className="text-slate-600 mb-4">Founded in 2009, NexaCorp started with one objective: make enterprise-grade security practical and scalable. From a compact San Francisco research team, we evolved into a global cybersecurity platform trusted by modern organizations.</p>
          <p className="text-slate-600">Over 15 years, we have protected millions of endpoints and helped security leaders modernize response operations while improving compliance readiness and customer trust.</p>
        </article>
        <article className="premium-card p-7 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
          <h3 className="text-xl font-bold mb-3">Core Principle</h3>
          <p className="text-blue-100">Security should feel clear, fast, and dependable. We design every workflow for both technical precision and operator confidence.</p>
        </article>
      </section>

      <section className="container-shell grid md:grid-cols-2 gap-6">
        <article className="premium-card p-7">
          <h2 className="text-2xl font-bold mb-3 text-slate-900">Mission</h2>
          <p className="text-slate-600">Empower organizations with advanced cybersecurity capabilities that protect critical systems while enabling sustainable growth.</p>
        </article>
        <article className="premium-card p-7">
          <h2 className="text-2xl font-bold mb-3 text-slate-900">Vision</h2>
          <p className="text-slate-600">A world where security operations are intelligent, adaptive, and transparent for every enterprise team.</p>
        </article>
      </section>

      <section className="container-shell premium-card p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">By The Numbers</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: '2009', label: 'Founded' },
            { value: '2,400+', label: 'Team Members' },
            { value: '40+', label: 'Countries' },
            { value: '15 Years', label: 'Excellence' }
          ].map((stat, i) => (
            <div key={i} onClick={() => sessionTracker.recordInteraction('stat_view', stat.label)} className="rounded-2xl bg-white border border-slate-200 p-5 text-center cursor-pointer hover:border-sky-300">
              <p className="text-3xl font-extrabold text-blue-800 mb-1">{stat.value}</p>
              <p className="text-slate-600 font-semibold text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((member, i) => (
            <article
              key={i}
              onClick={() => sessionTracker.recordInteraction('team_member_view', member.name)}
              className="premium-card p-6 text-center cursor-pointer"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-2xl mb-4 object-cover shadow-md"
                loading="lazy"
              />
              <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
              <p className="text-slate-600 text-sm">{member.role}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
