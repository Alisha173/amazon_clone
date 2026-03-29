import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../api/productService';
import { cartService } from '../api/cartService';
import { Star, MapPin, ShieldCheck, Lock } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Track quantity for Buy Now and Add to Cart
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  });

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(Number(id), quantity),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        // Optional: show a small toast or confirmation instead of an alert
    },
  });

  if (isLoading) return <div className="p-10 text-center">Loading product details...</div>;
  if (error || !product) return <div className="p-10 text-center text-red-600">Product not found.</div>;

  const images = product.images?.length > 0 ? product.images : [{ imageUrl: 'https://placehold.co/600' }];
  const inStock = product.stock > 0;

  // Handle Buy Now by passing state to the checkout route (bypasses cart)
  const handleBuyNow = () => {
    navigate('/checkout', { 
      state: { 
        buyNowItem: { 
          productId: product.id, 
          quantity: quantity,
          name: product.name,
          price: product.discountedPrice || product.price,
          image: images[0].imageUrl
        } 
      } 
    });
  };

  return (
    <div className="bg-white min-h-screen pb-10">
      <div className="text-xs text-gray-500 py-2 px-4 border-b border-gray-200">
        {product.category?.name || 'Category'} {'>'} {product.brand?.name || 'Brand'}
      </div>

      <div className="max-w-[1500px] mx-auto p-4 flex flex-col md:flex-row gap-8 mt-4">
        
        {/* LEFT: Image Gallery */}
        <div className="md:w-2/5 flex gap-4">
          <div className="flex flex-col gap-2 w-12 shrink-0">
            {images.map((img, idx) => (
              <img 
                key={idx}
                src={img.imageUrl} 
                alt="thumbnail" 
                onMouseEnter={() => setSelectedImage(idx)}
                className={`w-10 h-10 object-contain border rounded cursor-pointer ${selectedImage === idx ? 'border-blue-500 shadow-[0_0_3px_rgba(59,130,246,0.5)]' : 'border-gray-300'}`}
              />
            ))}
          </div>
          <div className="flex-grow flex justify-center items-start">
            <img 
              src={images[selectedImage].imageUrl} 
              alt={product.name} 
              className="max-h-[500px] object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* MIDDLE: Product Info */}
        <div className="md:w-2/5 flex flex-col">
          <h1 className="text-2xl font-medium leading-tight">{product.name}</h1>
          <p className="text-sm text-blue-600 hover:underline cursor-pointer mt-1">Visit the {product.brand?.name || 'Brand'} Store</p>
          
          <div className="flex items-center gap-4 mt-2 border-b border-gray-200 pb-2">
            <div className="flex items-center text-amazon-yellow">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(product.averageRating) ? "currentColor" : "none"} className={i >= Math.round(product.averageRating) ? "text-gray-300" : ""} />
              ))}
              <span className="text-sm text-blue-600 hover:underline cursor-pointer ml-2">{product.ratingCount} ratings</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-end gap-2">
              {product.discountPercent > 0 && (
                <span className="text-3xl font-light text-red-600">-{product.discountPercent}%</span>
              )}
              <div className="flex items-start">
                <span className="text-sm mt-1">₹</span>
                <span className="text-3xl font-medium">
                  {Number(product.discountedPrice || product.price).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            {product.discountedPrice && (
              <p className="text-sm text-gray-500 mt-1">
                M.R.P.: <span className="line-through">₹{Number(product.price).toLocaleString('en-IN')}</span>
              </p>
            )}
            <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
          </div>

          <div className="mt-4 text-sm">
            <h3 className="font-bold mb-2 text-base">About this item</h3>
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        </div>

        {/* RIGHT: The "Buy Box" */}
        <div className="md:w-1/5 shrink-0">
          <div className="border border-gray-300 rounded-lg p-4 sticky top-24">
            <div className="text-2xl font-medium mb-3">
              ₹{Number(product.discountedPrice || product.price).toLocaleString('en-IN')}
            </div>

            <h4 className={`text-lg font-medium mb-4 ${inStock ? 'text-green-700' : 'text-red-700'}`}>
              {inStock ? 'In stock' : 'Out of stock'}
            </h4>

            {inStock && (
              <div className="flex flex-col gap-2">
                {/* Quantity Dropdown */}
                <select 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-[#F0F2F2] border border-gray-300 rounded-md p-1.5 text-sm w-fit mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>Qty: {num}</option>
                  ))}
                </select>

                <button 
                  onClick={() => addToCartMutation.mutate()}
                  disabled={addToCartMutation.isPending}
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-2 rounded-full shadow-sm text-sm border border-[#FCD200] mt-2 transition-colors disabled:opacity-50"
                >
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                </button>

                <button 
                  onClick={handleBuyNow}
                  disabled={addToCartMutation.isPending}
                  className="w-full bg-[#FFA41C] hover:bg-[#FA8900] py-2 rounded-full shadow-sm text-sm border border-[#FF8F00] transition-colors disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500 border-t pt-4">
              <div className="flex items-center gap-2"><Lock size={14} /> Secure transaction</div>
              <div className="flex items-center gap-2"><ShieldCheck size={14} /> 1 Year Warranty</div>
              <div className="flex items-center gap-2 font-bold"><MapPin size={14} /> Deliver to Ludhiana 141001</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;