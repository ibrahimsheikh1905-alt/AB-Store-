import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaShieldAlt,
  FaStar,
  FaTruck,
  FaFire,
  FaShippingFast,
  FaExchangeAlt,
  FaQuestionCircle,
  FaShareAlt,
  FaWhatsapp,
  FaUsers,
} from 'react-icons/fa';
import { productsAPI, getImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import ReviewSection from '../components/ReviewSection';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const images = product?.images || [];
  const hasMultipleImages = images.length > 1;

  // Ensure we start at the top when opening a product
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getById(id);
        setProduct(response.data);
        setSelectedImage(0);
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Auto-advance product gallery when multiple images exist
  useEffect(() => {
    if (!hasMultipleImages || isPaused) return;
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [hasMultipleImages, images.length, isPaused]);

  // Reset index if images array shrinks
  useEffect(() => {
    if (selectedImage >= images.length) {
      setSelectedImage(0);
    }
  }, [images.length, selectedImage]);

  const handleAddToCart = () => {
    if (product && product.inStock) {
      try {
        addToCart(product, quantity);
        // Show notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
        notification.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>${quantity} x ${product.name} added to cart!</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.transition = 'opacity 0.3s';
          setTimeout(() => {
            notification.remove();
            navigate('/cart');
          }, 300);
        }, 1500);
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handlePrevImage = () => {
    if (!hasMultipleImages) return;
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    if (!hasMultipleImages) return;
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-10 pb-0">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch">
          {/* Product imagery */}
          <div className="relative group h-full min-h-[480px] lg:h-[560px]">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 via-white to-sky-500/10 blur-2xl" aria-hidden="true" />
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(17,24,39,0.12)] backdrop-blur-xl">
              <div
                className="relative h-full overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-200" aria-hidden="true" />
                <img
                  key={selectedImage}
                  src={getImageUrl(images[selectedImage])}
                  alt={product.name}
                  className="relative z-10 h-full w-full object-cover transition duration-700 ease-out"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x800?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                {discountPercentage > 0 && (
                  <span className="absolute left-5 top-5 z-30 rounded-full bg-red-500/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-500/30">
                    {discountPercentage}% Off
                  </span>
                )}

                {hasMultipleImages && (
                  <>
                    {/* Side arrows */}
                    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-between px-4">
                      <button
                        onClick={handlePrevImage}
                        className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-lg font-bold text-white shadow-lg backdrop-blur hover:bg-black/70 transition"
                        aria-label="Previous image"
                      >
                        ‹
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-lg font-bold text-white shadow-lg backdrop-blur hover:bg-black/70 transition"
                        aria-label="Next image"
                      >
                        ›
                      </button>
                    </div>

                    {/* Bottom indicators (dots only) */}
                    <div className="absolute inset-x-0 bottom-4 z-30 flex items-center justify-center">
                      <div className="flex items-center gap-2 rounded-full bg-black/45 px-2 py-2 shadow-lg backdrop-blur">
                        {images.slice(0, 6).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`h-2.5 w-2.5 rounded-full transition ${
                              idx === selectedImage ? 'bg-white shadow-lg scale-110' : 'bg-white/60 hover:bg-white'
                            }`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                        {images.length > 6 && (
                          <span className="text-[10px] font-semibold text-white/80">+{images.length - 6}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>

          {/* Product content */}
          <div className="relative flex h-full flex-col space-y-6 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-[0_18px_60px_rgba(17,24,39,0.12)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              {product.category && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 ring-1 ring-slate-200">
                  {product.category}
                </span>
              )}
              <span
                className={`rounded-full px-3 py-1 ring-1 ${
                  product.inStock
                    ? 'bg-emerald-50 text-emerald-600 ring-emerald-200'
                    : 'bg-rose-50 text-rose-600 ring-rose-200'
                }`}
              >
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              {discountPercentage > 0 && (
                <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-600 ring-1 ring-orange-200">
                  Save {discountPercentage}%
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
                {product.name}
              </h1>
              {product.rating > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 ring-1 ring-amber-100">
                  <FaStar className="text-amber-500" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-amber-600">({product.numReviews || 0})</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-4xl font-bold text-slate-900">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-slate-500 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600 ring-1 ring-emerald-200">
                    You save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            <p className="text-base leading-relaxed text-slate-700">
              {product.description || 'No description provided for this product.'}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <div className="rounded-xl bg-white p-2 text-orange-500 ring-1 ring-orange-100">
                  <FaTruck />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Fast delivery</p>
                  <p className="text-xs text-slate-500">2-5 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <div className="rounded-xl bg-white p-2 text-emerald-600 ring-1 ring-emerald-100">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Secure checkout</p>
                  <p className="text-xs text-slate-500">Trusted payment partners</p>
                </div>
              </div>
            </div>

            {product.inStock && (
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-semibold text-slate-700">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-full bg-white text-lg font-bold text-slate-800 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0"
                  >
                    -
                  </button>
                  <span className="min-w-[60px] rounded-xl bg-white px-4 py-2 text-center text-lg font-semibold text-slate-900 ring-1 ring-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-full bg-white text-lg font-bold text-slate-800 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`mt-auto w-full rounded-xl py-4 text-lg font-semibold transition-all ${
                product.inStock
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/35 hover:shadow-orange-500/45 hover:from-orange-500 hover:to-orange-600 active:translate-y-[1px]'
                  : 'cursor-not-allowed bg-slate-200 text-slate-500'
              }`}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        <div className="mt-12">
          <ReviewSection
            productId={product._id}
            productRating={product.rating || 0}
            productNumReviews={product.numReviews || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
