import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Use real rating and review count from product
  const rating = product.rating || 0;
  const reviewCount = product.numReviews || 0;
  const images = product.images || [];
  const hasMultipleImages = images.length > 1;
  const [activeImage, setActiveImage] = useState(0);
  const [hovering, setHovering] = useState(false);
  
  // Check if product is new (created within last 7 days)
  const isNew = product.createdAt 
    ? (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000
    : false;

  // Only rotate images while hovering to avoid many intervals
  useEffect(() => {
    if (!hovering || !hasMultipleImages) return;
    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [hovering, hasMultipleImages, images.length]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart(product, 1);
      // Show notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-fade-in';
      notification.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>${product.name} added to cart!</span>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking the button
    if (e.target.closest('button')) {
      e.preventDefault();
    }
  };

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => {
        setHovering(true);
        if (hasMultipleImages) {
          setActiveImage((prev) => (prev + 1) % images.length);
        }
      }}
      onMouseLeave={() => {
        setHovering(false);
        setActiveImage(0);
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/15 via-white to-sky-500/15 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_12px_40px_rgba(17,24,39,0.1)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(17,24,39,0.16)]">
        <Link to={`/products/${product._id}`} className="flex flex-1 flex-col" onClick={handleCardClick}>
          <div className="relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-200" aria-hidden="true" />
            <img
              key={activeImage}
              src={
                images[activeImage]
                  ? images[activeImage].startsWith('http')
                    ? images[activeImage]
                    : `http://localhost:5000${images[activeImage]}`
                  : 'https://via.placeholder.com/400x400?text=No+Image'
              }
              alt={product.name}
              className="relative z-10 h-full w-full object-cover transition duration-500 group-hover:scale-105 animate-fade-in"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
              }}
            />
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

            <div className="absolute left-4 right-4 top-4 z-30 flex items-center justify-between gap-2">
              {product.featured && (
                <span className="rounded-full bg-red-500/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-red-500/30">
                  Trending
                </span>
              )}

              {isNew && (
                <span className="ml-auto flex items-center gap-1 rounded-full bg-gray-900/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-gray-800/30">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  New Arrival
                </span>
              )}
            </div>

            {hasMultipleImages && (
              <div className="absolute inset-x-4 bottom-4 z-30 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {images.slice(0, 4).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveImage(idx);
                      }}
                      className={`h-2 w-2 rounded-full transition ${
                        idx === activeImage ? 'bg-white shadow-lg' : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                  {images.length > 4 && (
                    <span className="ml-1 rounded-full bg-black/60 px-2 text-[10px] font-semibold uppercase tracking-wide text-white">
                      +{images.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
              <span>ABSTORE®</span>
              {product.inStock ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-600 ring-1 ring-emerald-200">
                  In Stock
                </span>
              ) : (
                <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-semibold text-red-600 ring-1 ring-red-200">
                  Out of Stock
                </span>
              )}
            </div>

            {reviewCount > 0 ? (
              <div className="flex items-center gap-2 text-sm">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${
                      i < Math.round(rating) ? 'text-amber-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-600">
                  {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm text-gray-300" />
                ))}
                <span className="text-xs text-gray-500">No reviews yet</span>
              </div>
            )}

            <h3 className="line-clamp-2 min-h-[2.5rem] text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
              {product.name}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="text-xs font-semibold text-emerald-600">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              {product.category && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600">
                  {product.category}
                </span>
              )}
            </div>
          </div>
        </Link>

        <div className="px-5 pb-5">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`group/button w-full rounded-xl py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              product.inStock
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/35 hover:shadow-orange-500/45 hover:from-orange-500 hover:to-orange-600 active:translate-y-[1px]'
                : 'cursor-not-allowed bg-gray-200 text-gray-500'
            }`}
          >
            <FaShoppingCart className="text-base" />
            <span className="uppercase tracking-wide">{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
