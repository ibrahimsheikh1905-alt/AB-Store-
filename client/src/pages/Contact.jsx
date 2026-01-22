import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const contactItems = [
    {
      title: 'Customer Care',
      desc: 'Questions on orders, returns, or delivery.',
      value: 'support@abstore.com',
      href: 'mailto:support@abstore.com',
    },
    {
      title: 'Call Us',
      desc: 'Mon–Sat, 9:00 AM – 7:00 PM (PKT)',
      value: '+92 300 1234567',
      href: 'tel:+923001234567',
    },
    {
      title: 'Visit Us',
      desc: 'AB Store HQ, Clifton, Karachi, Pakistan',
      value: 'View on Maps',
      href: 'https://maps.google.com',
    },
  ];

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | success

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="bg-[#0b0d12] text-white min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute -left-20 top-10 w-[520px] h-[520px] bg-orange-500/10 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-[460px] h-[460px] bg-orange-400/8 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300 shadow-lg shadow-orange-500/15">
              Contact
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-black leading-tight">
              Let&apos;s talk about your next timepiece.
            </h1>
            <p className="mt-3 text-gray-300 text-lg max-w-2xl">
              We love hearing from you. Whether you have a question about an order, a product, or need
              style advice, our team is here to help.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="space-y-6">
              {contactItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                    {item.title}
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">{item.desc}</p>
                  <Link
                    to={item.href}
                    className="mt-3 inline-flex items-center gap-2 text-orange-300 font-semibold hover:text-orange-200 transition"
                  >
                    {item.value}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}

              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-200 font-black">
                  ✓
                </div>
                <div>
                  <p className="text-sm text-emerald-200 font-semibold">We respond within 24 hours.</p>
                  <p className="text-xs text-emerald-100/80">
                    Expect a swift reply from our customer success team.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.4)] backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black">Send us a message</h3>
                {status === 'success' && (
                  <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 rounded-full px-3 py-1">
                    Message sent
                  </span>
                )}
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject (optional)"
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <textarea
                  required
                  rows="5"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={`w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-orange-500/50 ${
                    status === 'sending' ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {status === 'sending' ? 'Sending...' : 'Send message'}
                </button>
              </form>
              <p className="mt-4 text-xs text-gray-400">
                By sending, you agree to our privacy policy and terms of service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
