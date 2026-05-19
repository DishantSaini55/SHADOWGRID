import { useEffect } from 'react';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { sessionTracker, useScrollTracking } from '../utils/analytics';

export default function Careers() {
  const trackScroll = useScrollTracking();

  useEffect(() => {
    sessionTracker.recordPageView('careers');
    window.addEventListener('scroll', trackScroll);
    return () => {
      sessionTracker.recordPageExit();
      window.removeEventListener('scroll', trackScroll);
    };
  }, []);

  const jobs = [
    {
      id: 1,
      title: 'Senior Security Engineer',
      location: 'San Francisco, CA',
      type: 'Full-time',
      level: 'Senior'
    },
    {
      id: 2,
      title: 'Cloud Security Architect',
      location: 'New York, NY',
      type: 'Full-time',
      level: 'Senior'
    },
    {
      id: 3,
      title: 'Threat Intelligence Analyst',
      location: 'Austin, TX',
      type: 'Full-time',
      level: 'Mid-level'
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      location: 'Seattle, WA',
      type: 'Full-time',
      level: 'Mid-level'
    },
    {
      id: 5,
      title: 'Security Operations Center Analyst',
      location: 'London, UK',
      type: 'Full-time',
      level: 'Junior'
    },
    {
      id: 6,
      title: 'Customer Success Manager',
      location: 'Remote',
      type: 'Full-time',
      level: 'Mid-level'
    }
  ];

  const handleApply = (jobTitle) => {
    sessionTracker.recordInteraction('job_apply', jobTitle);
  };

  return (
    <div className="px-4 sm:px-6 space-y-10 pb-8">
      <section className="container-shell premium-card p-8 sm:p-10 lg:p-14 text-center">
        <p className="inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wider text-blue-800 bg-blue-100 mb-5">CAREERS</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">Join the Team Building Secure Systems</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">Help global organizations operate confidently with modern, resilient cybersecurity programs.</p>
      </section>

      <section className="container-shell space-y-4">
        {jobs.map((job) => (
          <article
            key={job.id}
            onClick={() => sessionTracker.recordInteraction('job_view', job.title)}
            className="premium-card p-6 cursor-pointer"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-slate-600 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200"><MapPin size={14} /> {job.location}</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200"><Briefcase size={14} /> {job.type}</span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 font-semibold">{job.level}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApply(job.title);
                }}
                className="btn-primary px-5 py-2.5 font-semibold inline-flex items-center justify-center"
              >
                Apply <ArrowRight size={15} className="ml-2" />
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="container-shell premium-card p-8 sm:p-10">
        <h2 className="text-3xl font-bold mb-7 text-center text-slate-900">Why Work at NexaCorp</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { title: 'Cutting-Edge Tech', desc: 'Work with modern threat detection, automation, and cloud-native security systems.' },
            { title: 'Great Culture', desc: 'Collaborative, high-accountability teams that value mentorship and clear communication.' },
            { title: 'Benefits', desc: 'Comprehensive healthcare, 401k, flexible schedules, and remote-friendly roles.' }
          ].map((item, i) => (
            <article key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell text-center premium-card p-8">
        <p className="text-slate-600 mb-4">Do not see the right role yet? We still want to hear from you.</p>
        <button
          onClick={() => sessionTracker.recordInteraction('contact_careers', 'general_inquiry')}
          className="btn-secondary px-6 py-3 font-semibold"
        >
          Get in Touch
        </button>
      </section>
    </div>
  );
}
