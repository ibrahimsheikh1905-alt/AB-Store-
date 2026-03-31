import { useNavigate } from 'react-router-dom';

const CategoryLanding = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'MEN',
      description: 'Timeless designs for the modern gentleman',
      link: '/category/men',
      image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731a95e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      gradient: 'from-slate-900 via-blue-900/50 to-indigo-900/20',
      badge: 'HERO COLLECTION'
    },
    {
      title: 'WOMEN',
      description: 'Elegant & sophisticated for every occasion',
      link: '/category/women',
      image: 'https://images.unsplash.com/photo-1570986468421-5cd8e6a951c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      gradient: 'from-rose-900 via-pink-900/50 to-rose-900/20',
      badge: 'SIGNATURE'
    },
    {
      title: 'KIDS',
      description: 'Fun, durable & stylish for young adventurers',
      link: '/category/kids',
      image: 'https://images.unsplash.com/photo-1610658919454-2b5b6a969929?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      gradient: 'from-emerald-900 via-yellow-900/50 to-orange-900/20',
      badge: 'NEW ARRIVAL'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[50vh] overflow-hidden">
        <img
          src="/hero-luxury-watch.jpg"
          alt="Category"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-orange-400 drop-shadow-2xl">
              CATEGORIES
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-white opacity-95">
              Discover our curated collections for every style and occasion
            </p>
          </div>
        </div>
      </section>

      {/* 3 Hero Cards */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-10">
            {categories.map((category) => (
              <div
                key={category.title}
                className="group relative overflow-hidden rounded-4xl shadow-2xl cursor-pointer h-[500px] transition-transform duration-700 hover:-translate-y-4"
                onClick={() => navigate(encodeURI(category.link))}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border border-white/20">
                    {category.badge}
                  </span>
                </div>
                <div className="absolute bottom-10 left-6 right-6 transform transition-all duration-700 group-hover:translate-y-2">
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-2xl leading-tight">
                    {category.title}
                  </h2>
                  <p className="text-lg text-white/90 mb-6 font-medium">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center gap-3 text-orange-400 font-bold text-lg uppercase tracking-wider">
                    Explore Collection
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryLanding;
