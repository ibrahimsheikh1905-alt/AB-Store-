import { useEffect } from 'react';

const Refund = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sections = [
    {
      title: 'Eligibility',
      body: 'Items must be unused, in original packaging, and returned within 7 days of delivery. Proof of purchase required.',
    },
    {
      title: 'Refund method',
      body: 'Approved refunds are processed to the original payment method. Processing times vary by bank/payment provider.',
    },
    {
      title: 'Non-returnable items',
      body: 'Custom/engraved items, clearance items, and worn products may not be eligible unless defective.',
    },
    {
      title: 'Defective or wrong item',
      body: 'Contact support within 48 hours of delivery with photos. We will prioritize replacements or refunds.',
    },
    {
      title: 'Return shipping',
      body: 'Customer bears return shipping unless the item is defective or incorrect. We recommend trackable shipping.',
    },
    {
      title: 'Exchanges',
      body: 'Subject to stock availability. If unavailable, we will issue a refund per this policy.',
    },
  ];

  return (
    <div className="bg-[#0b0d12] text-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400 border border-orange-500/30">
            Refund
          </div>
          <h1 className="mt-4 text-4xl font-black">Refund & Return Policy</h1>
          <p className="mt-2 text-gray-300">
            Understand how returns and refunds work at AB STORE.
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

export default Refund;
