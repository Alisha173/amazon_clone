import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../api/productService';
import { cartService } from '../api/cartService';
import { 
  Star, MapPin, ShieldCheck, Lock, Percent, 
  RefreshCcw, CreditCard, Truck, Package 
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Scroll to top whenever the URL ID changes (important for the carousel)
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0); // Reset image gallery on new product
    setQuantity(1); // Reset quantity
  }, [id]);

  // 1. Fetch Current Product
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  });

  // 2. Fetch All Products (for the carousel)
  const { data: allProductsData } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(Number(id), quantity),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  if (isLoading) return <div className="p-10 text-center">Loading product details...</div>;
  if (error || !product) return <div className="p-10 text-center text-red-600">Product not found.</div>;

  // Formatting & Fallbacks
  const images = product.images?.length > 0 ? product.images : [{ imageUrl: 'https://placehold.co/600' }];
  const inStock = product.stock > 0;
  const activePrice = Number(product.discountedPrice || product.price);
  const originalPrice = Number(product.price);
  const hasDiscount = activePrice < originalPrice;
  const dummyDiscountPercent = hasDiscount ? Math.round(((originalPrice - activePrice) / originalPrice) * 100) : 0;

  // --- RESTORED SIMILAR PRODUCTS LOGIC ---
  const allProducts = Array.isArray(allProductsData) ? allProductsData : allProductsData?.products || [];
  const targetCategoryId = product?.categoryId || product?.category?.id;

  let similarProducts = allProducts.filter(p => 
    (p.categoryId === targetCategoryId || p.category?.id === targetCategoryId) && 
    p.id !== product?.id
  );

  // Fallback if it's the only item in its category
  if (similarProducts.length === 0) {
    similarProducts = allProducts.filter(p => p.id !== product?.id).slice(0, 8); 
  }
  // ----------------------------------------

  const handleBuyNow = () => {
    navigate('/checkout', { 
      state: { 
        buyNowItem: { 
          productId: product.id, 
          quantity: quantity,
          name: product.name,
          price: activePrice,
          image: images[0].imageUrl
        } 
      } 
    });
  };

  return (
    <div className="bg-white min-h-screen pb-10 font-sans">
      {/* Breadcrumbs */}
      <div className="text-xs text-gray-500 py-2 px-4 md:px-6">
        {product.category?.name || 'Category'} {'>'} {product.brand?.name || 'Brand'}
      </div>

      <div className="max-w-[1500px] mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8 mt-2">
        
        {/* LEFT: Image Gallery */}
        <div className="lg:w-[40%] flex gap-4 sticky top-4 h-fit">
          <div className="flex flex-col gap-2 w-12 shrink-0">
            {images.map((img, idx) => (
              <img 
                key={idx}
                src={img.imageUrl} 
                alt="thumbnail" 
                onMouseEnter={() => setSelectedImage(idx)}
                className={`w-10 h-10 object-contain border rounded cursor-pointer p-1 ${selectedImage === idx ? 'border-blue-500 shadow-[0_0_3px_rgba(59,130,246,0.5)]' : 'border-gray-300'}`}
              />
            ))}
          </div>
          <div className="flex-grow flex justify-center items-start">
            <img 
              src={images[selectedImage]?.imageUrl} 
              alt={product.name} 
              className="max-h-[550px] object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* MIDDLE: Product Info */}
        <div className="lg:w-[40%] flex flex-col">
          <p className="text-sm text-[#007185] hover:underline cursor-pointer mb-1">Brand: {product.brand?.name || 'Generic'}</p>
          <h1 className="text-2xl font-normal leading-tight text-gray-900">{product.name}</h1>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center text-[#FFA41C]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(product.averageRating || 4) ? "currentColor" : "none"} className={i >= Math.round(product.averageRating || 4) ? "text-gray-300" : ""} />
              ))}
              <span className="text-sm text-[#007185] hover:underline cursor-pointer ml-2">{product.ratingCount || '209'} ratings</span>
            </div>
          </div>
          <p className="text-sm text-gray-700 font-medium mt-1 pb-2 border-b border-gray-300">500+ bought in past month</p>

          <div className="mt-3">
            {hasDiscount && (
              <div className="bg-[#CC0C39] text-white text-[12px] font-bold px-2 py-1 rounded-sm w-fit mb-2">
                Limited time deal
              </div>
            )}
            <div className="flex items-start gap-2">
              {hasDiscount && <span className="text-3xl font-light text-[#CC0C39]">-{dummyDiscountPercent}%</span>}
              <div className="flex items-start">
                <span className="text-sm mt-1 text-gray-900">₹</span>
                <span className="text-3xl font-medium text-gray-900">
                  {activePrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            {hasDiscount && (
              <p className="text-sm text-gray-500 mt-1">
                M.R.P.: <span className="line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
              </p>
            )}
            <p className="text-sm font-medium mt-2">Save ₹23 extra using <span className="text-blue-500 font-bold">💎230</span></p>
            <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 font-bold text-gray-900 mb-3">
              <Percent size={18} /> Offers
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <div className="min-w-[140px] max-w-[140px] border border-gray-300 rounded-lg p-3 shadow-sm">
                <p className="font-bold text-sm mb-1">Cashback</p>
                <p className="text-xs text-gray-800 line-clamp-3">Upto ₹15.00 cashback as Amazon Pay Balance when...</p>
                <p className="text-[#007185] text-xs hover:underline mt-2 cursor-pointer">3 offers {'>'}</p>
              </div>
              <div className="min-w-[140px] max-w-[140px] border border-gray-300 rounded-lg p-3 shadow-sm">
                <p className="font-bold text-sm mb-1">Bank Offer</p>
                <p className="text-xs text-gray-800 line-clamp-3">Upto ₹1,000.00 discount on select Credit Cards</p>
                <p className="text-[#007185] text-xs hover:underline mt-2 cursor-pointer">25 offers {'>'}</p>
              </div>
              <div className="min-w-[140px] max-w-[140px] border border-gray-300 rounded-lg p-3 shadow-sm">
                <p className="font-bold text-sm mb-1">Partner Offers</p>
                <p className="text-xs text-gray-800 line-clamp-3">Get GST invoice and save up to 28% on business purchases.</p>
                <p className="text-[#007185] text-xs hover:underline mt-2 cursor-pointer">1 offer {'>'}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-b border-gray-200 py-4 flex justify-between text-center gap-2">
            <div className="flex flex-col items-center w-16 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1"><RefreshCcw size={18} className="text-[#007185]"/></div>
              <span className="text-[11px] text-[#007185] leading-tight hover:underline">10 days Return & Exchange</span>
            </div>
            <div className="flex flex-col items-center w-16 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1"><CreditCard size={18} className="text-[#007185]"/></div>
              <span className="text-[11px] text-[#007185] leading-tight hover:underline">Pay on Delivery</span>
            </div>
            <div className="flex flex-col items-center w-16 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1"><Truck size={18} className="text-[#007185]"/></div>
              <span className="text-[11px] text-[#007185] leading-tight hover:underline">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center w-16 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1"><Package size={18} className="text-[#007185]"/></div>
              <span className="text-[11px] text-[#007185] leading-tight hover:underline">Amazon Delivered</span>
            </div>
            <div className="flex flex-col items-center w-16 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1"><ShieldCheck size={18} className="text-[#007185]"/></div>
              <span className="text-[11px] text-[#007185] leading-tight hover:underline">Secure transaction</span>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <h3 className="font-bold mb-2 text-base">About this item</h3>
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        </div>

        {/* RIGHT: Detailed Buy Box */}
        <div className="lg:w-[20%] shrink-0">
          <div className="border border-gray-300 rounded-lg p-4 sticky top-4">
            <div className="text-2xl font-medium mb-2 text-gray-900">
              <span className="text-sm align-top mr-0.5">₹</span>
              {activePrice.toLocaleString('en-IN')}
            </div>
            
            <div className="text-sm mb-4">
              <div className="flex items-center gap-1 font-bold text-[#007185] mb-1">
                <span className="italic text-blue-500">prime</span> DELIVERY UNLOCKED
              </div>
              <p className="text-gray-900">FREE delivery <span className="font-bold">Tomorrow, 30 Mar.</span> Order within <span className="text-green-700">10 hrs 28 mins.</span> <span className="text-[#007185] hover:underline cursor-pointer">Details</span></p>
            </div>

            <div className="flex items-start gap-2 text-sm mb-4">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span className="text-[#007185] hover:underline cursor-pointer leading-tight">Deliver to Scaler - Bengaluru 560100</span>
            </div>

            <h4 className={`text-lg font-medium mb-4 ${inStock ? 'text-green-700' : 'text-[#B12704]'}`}>
              {inStock ? 'In stock' : 'Out of stock'}
            </h4>

            {inStock && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs text-gray-600 mb-2">
                  <span>Ships from</span> <span className="text-gray-900">Amazon</span>
                  <span>Sold by</span> <span className="text-[#007185] hover:underline cursor-pointer">{product.brand?.name || 'Amazon Retail'}</span>
                  <span>Packaging</span> <span className="text-[#007185] hover:underline cursor-pointer">Ships in product packaging</span>
                  <span>Payment</span> <span className="text-[#007185] hover:underline cursor-pointer flex items-center gap-1">Secure transaction</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Quantity:</span>
                  <select 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="bg-[#F0F2F2] border border-gray-300 rounded-md py-1 px-2 text-sm w-fit focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => addToCartMutation.mutate()}
                  disabled={addToCartMutation.isPending}
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-2 rounded-full shadow-sm text-sm border border-[#FCD200] transition-colors disabled:opacity-50"
                >
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to cart'}
                </button>

                <button 
                  onClick={handleBuyNow}
                  disabled={addToCartMutation.isPending}
                  className="w-full bg-[#FFA41C] hover:bg-[#FA8900] py-2 rounded-full shadow-sm text-sm border border-[#FF8F00] transition-colors disabled:opacity-50"
                >
                  Buy Now
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-[#007185] hover:underline cursor-pointer mt-2">
                  <Lock size={14} className="text-gray-400" /> Secure transaction
                </div>

                <button className="w-full bg-white hover:bg-gray-50 py-1.5 rounded-md shadow-sm text-sm border border-gray-300 mt-2 text-left px-3">
                  Add to Wish List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM CAROUSEL: Similar Products */}
      {similarProducts.length > 0 && (
        <div className="max-w-[1500px] mx-auto px-4 md:px-6 mt-16 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold mb-6 text-[#C45500]">Products related to this item</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {similarProducts.map(item => (
              <Link 
                to={`/product/${item.id}`} 
                key={item.id} 
                className="min-w-[180px] max-w-[180px] group flex flex-col items-center bg-white p-2 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="h-40 w-full flex items-center justify-center mb-3">
                  <img 
                    src={item.images?.[0]?.imageUrl || 'https://placehold.co/150'} 
                    alt={item.name} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply" 
                  />
                </div>
                <p className="text-[#007185] group-hover:underline group-hover:text-orange-700 text-sm line-clamp-2 w-full text-left">
                  {item.name}
                </p>
                <div className="flex items-center text-[#FFA41C] w-full mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < Math.round(item.averageRating || 4) ? "currentColor" : "none"} className={i >= Math.round(item.averageRating || 4) ? "text-gray-300" : ""} />
                  ))}
                  <span className="text-xs text-[#007185] ml-1">{item.ratingCount || '10+'}</span>
                </div>
                <p className="text-[#B12704] font-bold text-lg mt-1 w-full text-left">
                  <span className="text-sm align-top mr-0.5">₹</span>
                  {Number(item.discountedPrice || item.price).toLocaleString('en-IN')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;