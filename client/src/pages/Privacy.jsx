import { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sections = [
    {
      title: 'Data we collect',
      body: 'We collect personal information you provide (name, email, address, phone) and site usage data to improve your experience.',
    },
    {
      title: 'How we use data',
      body: 'To process orders, personalize recommendations, communicate updates, and enhance our services and security.',
    },
    {
      title: 'Sharing your data',
      body: 'We do not sell your data. We share it only with trusted partners for payment, delivery, or legal compliance.',
    },
    {
      title: 'Cookies & tracking',
      body: 'We use cookies/analytics to remember preferences and improve site performance. You can manage cookies in your browser.',
    },
    {
      title: 'Your rights',
      body: 'You can access, update, or request deletion of your data. Contact support@abstore.com for assistance.',
    },
    {
      title: 'Security',
      body: 'We employ encryption and best practices to protect your data, but no method is 100% secure; use the site at your discretion.',
    },
  ];

  return (
    <div className="bg-[#0b0d12] text-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400 border border-orange-500/30">
            Privacy
          </div>
          <h1 className="mt-4 text-4xl font-black">Privacy Policy</h1>
          <p className="mt-2 text-gray-300">
            Your privacy matters to us. This policy explains how we collect, use, and protect your data.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
              <h3 className="text-xl font-bold text-orange-300 mb-2">{item.title}</h3>
              <p className="text-gray-200 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
