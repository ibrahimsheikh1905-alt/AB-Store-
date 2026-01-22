import { useEffect } from 'react';

const Shipping = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sections = [
    {
      title: 'Processing time',
      body: 'Orders are processed within 1-2 business days. Customizations may require extra time.',
    },
    {
      title: 'Delivery timelines',
      body: 'Metro cities: 2-4 business days. Other regions: 4-7 business days. Delays may occur in peak seasons.',
    },
    {
      title: 'Shipping fees',
      body: 'Shipping costs are shown at checkout. Free delivery may apply on promotions or order thresholds.',
    },
    {
      title: 'Tracking',
      body: 'A tracking link will be sent once your order ships. You can also track via your account orders page.',
    },
    {
      title: 'Failed delivery',
      body: 'If a delivery attempt fails, the courier may retry or contact you. Undelivered orders may be returned to us.',
    },
    {
      title: 'International shipping',
      body: 'Currently limited. Customs duties/taxes (if any) are the buyer’s responsibility.',
    },
  ];

  return (
    <div className="bg-[#0b0d12] text-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400 border border-orange-500/30">
            Shipping
          </div>
          <h1 className="mt-4 text-4xl font-black">Shipping Policy</h1>
          <p className="mt-2 text-gray-300">
            Learn how we process, dispatch, and deliver your orders with care.
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

export default Shipping;
