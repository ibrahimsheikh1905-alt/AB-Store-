import { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sections = [
    {
      title: '1. Acceptance of terms',
      body: 'By accessing or using AB STORE, you agree to these terms. If you disagree with any part, please discontinue using the site.',
    },
    {
      title: '2. Products & pricing',
      body: 'Prices, promotions, and availability are subject to change without prior notice. We reserve the right to limit quantities and correct pricing errors.',
    },
    {
      title: '3. Orders & payment',
      body: 'All orders are subject to acceptance. Payment must be completed for order processing. We may cancel orders in cases of fraud or stock issues.',
    },
    {
      title: '4. Returns & exchanges',
      body: 'Please refer to our Refund & Return Policy for eligibility, timelines, and procedures for returns and exchanges.',
    },
    {
      title: '5. Intellectual property',
      body: 'All content, branding, and media on this site remain the property of AB STORE and protected by applicable laws.',
    },
    {
      title: '6. Limitation of liability',
      body: 'AB STORE shall not be liable for indirect, incidental, or consequential damages arising from product use or inability to use the site.',
    },
  ];

  return (
    <div className="bg-[#0b0d12] text-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400 border border-orange-500/30">
            Terms
          </div>
          <h1 className="mt-4 text-4xl font-black">Terms & Conditions</h1>
          <p className="mt-2 text-gray-300">
            Please read these terms carefully before using AB STORE. Updated: {new Date().toLocaleDateString()}.
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

export default Terms;
