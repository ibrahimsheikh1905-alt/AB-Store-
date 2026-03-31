import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productsAPI, bannersAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const Category = () => {
  const { category: categoryParam } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerImage, setBannerImage] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');

  const categoryConfig = {
    men: { 
      title: 'MEN', 
      description: 'Timeless designs for the modern gentleman',
      image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731a95e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      gradient: 'from-slate-900 via-blue-900/50 to-indigo-900/20',
      badge: 'HERO COLLECTION'
    },
    women: { 
      title: 'WOMEN', 
      description: 'Elegant & sophisticated for every occasion',
      image: 'https://images.unsplash.com/photo-1570986468421-5cd8e6a951c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      gradient: 'from-rose-900 via-pink-900/50 to-rose-900/20',
      badge: 'SIGNATURE'
    },
    kids: { 
      title: 'KIDS', 
      description: 'Fun, durable & stylish for young adventurers',
      image: 'https://images.unsplash.com/photo-1610658919454-2b5b6a969929?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      gradient: 'from-emerald-900 via-yellow-900/50 to-orange-900/20',
      badge: 'NEW ARRIVAL'
    }
  };

  const config = categoryConfig[categoryParam || ''] || categoryConfig.men;
  const resolvedHeroImage = bannerImage || config.image;
  const resolvedHeroTitle = bannerTitle || config.title;

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryParam) return;
      try {
        setLoading(true);

        const categorySlug =
          categoryParam === 'men' ? 'Men' :
          categoryParam === 'women' ? 'Women' :
          categoryParam === 'kids' ? 'Kids' : config.title;

        const [productsResponse, bannersResponse] = await Promise.all([
          productsAPI.getAll({ category: categorySlug }),
          bannersAPI.getAll()
        ]);

        setProducts(productsResponse.data.products || []);

        const banners = bannersResponse.data || [];
        const matchedBanner = banners.find((b) => b.category === categoryParam);
        setBannerImage(matchedBanner?.image || '');
        setBannerTitle(matchedBanner?.title || '');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryParam]);

  return (
    <div className="min-h-screen">
      {/* Dynamic Hero Banner */}
      <section className="relative h-[50vh] overflow-hidden">
        <img
          src={resolvedHeroImage}
          alt={resolvedHeroTitle}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/hero-luxury-watch.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-orange-400 drop-shadow-2xl">
              {resolvedHeroTitle.toUpperCase()}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-white opacity-95">
              {config.description}
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Products Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          {/* No collection title or badge - direct to products */}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">No {config.title.toLowerCase()} products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="text-center mt-16">
              <a
                href={`/products?category=${config.title}`}
                className="inline-block bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-[1.02]"
              >
                View All {config.title} Products →
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Category;