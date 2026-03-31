import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, bannersAPI, getImageUrl } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../utils/currency';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);

  const [featuredGenderProduct, setFeaturedGenderProduct] = useState(null);
  const [signatureProduct, setSignatureProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroBanners, setHeroBanners] = useState([]);
  

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsResponse, bannersResponse] = await Promise.all([
          productsAPI.getAll(),
          bannersAPI.getAll()
        ]);

        const allProducts = productsResponse.data.products || productsResponse.data || [];
        const allBanners = bannersResponse.data || [];

        // Featured products (first 12)
        setFeaturedProducts(allProducts.slice(0, 12));

        // Trending products (first 4)
        setTrendingProducts(allProducts.slice(0, 4));

        // Get first Men/Women product for dynamic section
        let featuredGenderProduct = null;
        const men = allProducts.filter(p => p.category === 'Men');
        const women = allProducts.filter(p => p.category === 'Women');
        if (men.length > 0) {
          featuredGenderProduct = men[0];
        } else if (women.length > 0) {
          featuredGenderProduct = women[0];
        }
        setFeaturedGenderProduct(featuredGenderProduct);

        // Signature product (first featured or first product)
        setSignatureProduct(allProducts.find(p => p.featured) || allProducts[0]);

        // Hero banners for Men/Women/Kids
        setHeroBanners(allBanners);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const categories = [
    { name: 'Women', icon: '♀', link: '/category/women', color: 'from-pink-100 to-rose-100' },
    { name: 'Men', icon: '♂', link: '/category/men', color: 'from-blue-100 to-indigo-100' },
    { name: 'Kids', icon: '👶', link: '/category/kids', color: 'from-orange-100 to-yellow-100' },
  ];

  const TrendingCard = ({ product, index }) => {
    const images = product.images || [];
    const hasMultipleImages = images.length > 1;
    const [activeImage, setActiveImage] = useState(0);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
      if (!hovering || !hasMultipleImages) return;
      const timer = setInterval(() => {
        setActiveImage((prev) => (prev + 1) % images.length);
      }, 2200);
      return () => clearInterval(timer);
    }, [hovering, hasMultipleImages, images.length]);

    const currentImg = getImageUrl(images[activeImage]);

    return (
      <div
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/6 via-white/4 to-black/40 shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2 h-full flex flex-col"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false);
          setActiveImage(0);
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative">
          <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white px-4 py-1.5 text-xs font-black uppercase tracking-wide shadow-lg shadow-orange-500/40">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">{index + 1}</span>
            Trending
          </span>
          <img
            src={currentImg}
            alt={product.name}
            className="w-full h-64 object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = '/no-image.png';
            }}
          />
        </div>
        <div className="relative p-6 flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold line-clamp-2 group-hover:text-orange-300 transition">{product.name}</h3>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-orange-200 border border-white/10">
              {product.category || 'New'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-orange-300">{formatPrice(product.price)}</p>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 rounded-full px-3 py-1">
                Save {formatPrice(product.originalPrice - product.price)}
              </span>
            )}
          </div>
          <div className="flex-1" />
          <Link
            to={`/products/${product._id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-500/40 transition hover:shadow-orange-500/60 mt-auto"
          >
            Buy Now
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white animate-fade-in">
      {/* Hero Section with provided watch banner */}
      <section
        className="relative overflow-hidden text-white py-12 md:py-16 lg:py-20 bg-black"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-[url('/hero-luxury-watch.jpg')] bg-cover bg-center"
          aria-hidden="true"
        />
        {/* Dark/soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/70"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-10 top-1/3 w-[420px] h-[420px] bg-orange-500/18 blur-[120px] rounded-full"></div>
          <div className="absolute right-0 bottom-10 w-[360px] h-[360px] bg-orange-400/14 blur-[110px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-orange-300 px-4 py-2 rounded-full uppercase tracking-[0.35em] text-xs md:text-sm font-semibold shadow-lg shadow-orange-500/10">
                New Collection
              </div>
              <div className="space-y-3">
                <p className="text-sm md:text-base text-gray-200">The best luxury watch brands of 2024</p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] drop-shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                  <span className="block text-orange-400">Luxury</span>
                  <span className="block text-orange-500">Watch</span>
                </h1>
              </div>
              <p className="text-gray-200 text-base md:text-lg max-w-2xl">
                Precision crafted timepieces with bold aesthetics. Discover the elegance and performance of AB STORE signature watches.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/products"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-8 py-4 text-lg font-bold transition"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 opacity-90 group-hover:opacity-100"></span>
                  <span className="absolute inset-0 blur-2xl bg-orange-500/50"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Now
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/products?category=Men"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-8 py-4 text-lg font-semibold text-gray-100 hover:bg-white/5 transition"
                >
                  Explore Collection
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute -inset-6 bg-orange-500/10 blur-3xl rounded-full pointer-events-none"></div>
              <div
                className="relative max-w-[520px] w-full aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40 bg-black/40 backdrop-blur"
              >
                <div
                  className="absolute inset-0 bg-center bg-cover"
                  style={{ backgroundImage: "url('/hero-luxury-watch.jpg')" }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Watches */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight animate-slide-down">FEATURED WATCHES</h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full animate-scale-in"></div>
            <p className="text-gray-600 mt-4 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>Discover our handpicked collection</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent transition-all"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <div key={product._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {!loading && featuredProducts.length > 0 && (
            <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Link
                to="/products"
                className="inline-block bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-xl"
              >
                View All →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Top Trending Section */}
      {trendingProducts.length > 0 && (
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#0b0c10] via-[#0e1016] to-[#08090f] text-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 top-6 w-[520px] h-[520px] bg-orange-500/12 blur-[150px] rounded-full"></div>
            <div className="absolute left-0 bottom-0 w-[460px] h-[460px] bg-orange-400/10 blur-[140px] rounded-full"></div>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300 shadow-lg shadow-orange-500/20">
                This Week
              </div>
              <h2 className="text-5xl font-black mt-4 tracking-tight">Top Trending</h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full mt-3"></div>
              <p className="text-gray-300 mt-4 text-lg">Picked by shoppers, loved for looks and value.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
              {trendingProducts.map((product, index) => (
                <TrendingCard key={product._id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Gender Product Section (Men/Women) */}
      {featuredGenderProduct && (
        <section className="py-20 bg-gradient-to-r from-[#0c0e14] via-[#0f121a] to-[#0b0d12] text-white relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-orange-500/12 rounded-full blur-[150px]"></div>
            <div className="absolute left-10 bottom-0 w-[400px] h-[400px] bg-orange-400/10 rounded-full blur-[130px]"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400 border border-orange-500/30">
                  New Arrival
                </div>
                <h2 className="text-5xl md:text-6xl font-black leading-tight">
                  For<br /><span className="text-orange-500">{featuredGenderProduct.category}</span>
                </h2>
                <p className="text-gray-300 text-lg">
                  {featuredGenderProduct?.description || 'Premium timepieces for modern style.'}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-orange-300">
                    {formatPrice(featuredGenderProduct?.price || 0)}
                  </span>
                  {featuredGenderProduct?.originalPrice && featuredGenderProduct.originalPrice > featuredGenderProduct.price && (
                    <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 rounded-full px-3 py-1">
                      Save {formatPrice(featuredGenderProduct.originalPrice - featuredGenderProduct.price)}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Link
                    to={featuredGenderProduct?._id ? `/products/${featuredGenderProduct._id}` : `/products?category=${featuredGenderProduct.category}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/40 transition hover:shadow-orange-500/60"
                  >
                    Shop now
                  </Link>
                  <Link
                    to={`/products?category=${featuredGenderProduct.category}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-4 text-sm font-semibold text-gray-200 hover:bg-white/5 transition"
                  >
                    Explore all
                  </Link>
                </div>
              </div>
              <div className="relative">
                {featuredGenderProduct && (
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/25 to-orange-600/20 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition"></div>
                    <img
                      src={getImageUrl(featuredGenderProduct.images && featuredGenderProduct.images[0])}
                      alt={featuredGenderProduct.name}
                      className="w-full h-[500px] object-cover rounded-2xl relative z-10 drop-shadow-[0_25px_60px_rgba(0,0,0,0.4)]"
                      onError={(e) => {
                        e.target.src = '/no-image.png';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Signature Product Section */}
      {signatureProduct && (
        <section className="py-24 bg-gradient-to-b from-white via-orange-50/40 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 border border-orange-500/30">
                Signature pick
              </div>
              <h2 className="text-5xl font-black text-gray-900 mt-4 tracking-tight">Our Signature Product</h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full mt-3"></div>
              <p className="text-gray-600 text-lg mt-3">Handpicked bestseller—elegant, modern, and loved by our community.</p>
            </div>

            <div className="relative max-w-6xl mx-auto">
              <div className="absolute -inset-6 bg-gradient-to-r from-orange-500/15 via-orange-400/10 to-transparent rounded-[28px] blur-3xl pointer-events-none"></div>
              <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 rounded-3xl bg-[#0f1117] text-white border border-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden">
                <div className="relative p-6 md:p-8 flex items-center justify-center bg-black/30">
                  <div className="absolute -inset-4 bg-gradient-to-b from-white/5 to-black/40 rounded-2xl"></div>
                  <img
                    src={getImageUrl(signatureProduct.images && signatureProduct.images[0])}
                    alt={signatureProduct.name}
                    className="relative z-10 w-full max-w-[540px] object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
                    onError={(e) => {
                      e.target.src = '/no-image.png';
                    }}
                  />
                </div>

                <div className="p-8 md:p-10 flex flex-col gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-200">
                      Best Seller
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black leading-tight">{signatureProduct.name}</h3>
                    <p className="text-gray-200 text-lg leading-relaxed">{signatureProduct.description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-orange-300">
                      {formatPrice(signatureProduct.price)}
                    </span>
                    {signatureProduct.originalPrice && signatureProduct.originalPrice > signatureProduct.price && (
                      <span className="text-sm font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 rounded-full px-3 py-1">
                        Save {formatPrice(signatureProduct.originalPrice - signatureProduct.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10">
                      ⭐ Loved by fans
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10">
                      🚚 Fast shipping
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10">
                      🛡️ Secure checkout
                    </span>
                  </div>

                  <div className="pt-4">
                    <Link
                      to={`/products/${signatureProduct._id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/40 transition hover:shadow-orange-500/60"
                    >
                      Shop now
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}




      {/* Shop by Collection */}
      <section id="collections" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">SHOP BY COLLECTION</h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 text-lg">Explore our curated collections</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className={`group bg-gradient-to-br ${category.color} rounded-2xl p-8 text-center hover:shadow-2xl transition-all transform hover:scale-110 border-2 border-transparent hover:border-orange-500`}
              >
                <div className="text-6xl mb-4 transform group-hover:scale-125 transition-transform duration-300">{category.icon}</div>
                <h3 className="text-base md:text-lg font-black text-gray-800 group-hover:text-orange-600 transition">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Email Subscription */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Subscribe to our emails</h2>
            <p className="text-gray-300 mb-10 text-lg">Be the first to know about new collections and special offers.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/50 text-lg font-medium"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
