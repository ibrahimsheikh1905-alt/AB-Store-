import { useNavigate } from "react-router-dom";

const collections = [
  {
    title: "Chain Watches",
    category: "Chain",
    badge: "HOT",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Luxury Watches",
    category: "Luxury",
    badge: "PREMIUM",
    image:
      "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Strap Watches",
    category: "Strap",
    badge: "TRENDING",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Smart Watches",
    category: "Smart",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Classic Watches",
    category: "Classic",
    badge: "CLASSIC",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Limited Edition",
    category: "Limited",
    badge: "LIMITED",
    image:
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80",
  },
];

const Collections = () => {
  const navigate = useNavigate();

  const handleOpenCategory = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* ===== HERO SECTION ===== */}
      <section className="relative">
        <img
          src="/hero-luxury-watch.jpg"
          alt="Curated collection"
          className="w-full h-[520px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <p className="text-sm tracking-[0.3em] font-semibold mb-4">
              CURATED COLLECTIONS
            </p>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Elevate Your Style
            </h1>
            <p className="text-lg max-w-2xl mx-auto opacity-90">
              Discover timeless, luxury & modern watches crafted for every style.
            </p>
          </div>
        </div>
      </section>

      {/* ===== COLLECTION CARDS ===== */}
      <section className="py-20">
        <div className="container mx-auto px-4">

          {/* Heading */}
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Shop by Collection
            </h2>
            <div className="mt-4 flex justify-center">
              <span className="h-[3px] w-28 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {collections.map((item) => (
              <div
                key={item.title}
                onClick={() => handleOpenCategory(item.category)}
                className="group cursor-pointer relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Badge */}
                <span className="absolute top-6 left-6 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full tracking-widest">
                  {item.badge}
                </span>

                {/* Text */}
                <div className="absolute bottom-8 left-8 text-white transition-all duration-500 group-hover:bottom-10">
                  <h3 className="text-2xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm opacity-90">
                    Explore Collection →
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Collections;
