import { Star, ShoppingCart } from 'lucide-react';
import { cartService } from '../api/cartService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const queryClient = useQueryClient();

  // Mutation to add to cart
  const mutation = useMutation({
    mutationFn: () => cartService.addToCart(product.id, 1),
    onSuccess: () => {
      // Invalidate the cart query so the Navbar count updates automatically
      queryClient.invalidateQueries(['cart']);
    },
  });

  return (
    <div className="bg-white p-4 flex flex-col z-30 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      <p className="absolute top-2 right-2 text-xs italic text-gray-400 capitalize">{product.category}</p>
      
      <Link to={`/product/${product.id}`} className="cursor-pointer flex-grow flex flex-col">
        <div className="h-48 flex items-center justify-center">
          <img 
            src={product.images?.[0]?.imageUrl || 'https://placehold.co/400?text=No+Image'} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain mix-blend-multiply"
          />
        </div>

        <h4 className="font-medium my-3 line-clamp-2 hover:text-orange-700">
          {product.name}
        </h4>
      </Link>


      <div className="flex items-center text-amazon-yellow">
        {/* Simple logic for 5 stars */}
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="currentColor" />
        ))}
        <span className="text-xs text-blue-500 ml-2 hover:underline cursor-pointer">1,245</span>
      </div>

      <p className="text-xs my-2 line-clamp-2 text-gray-600">{product.description}</p>

      <div className="mb-5 flex items-center">
        <span className="text-sm self-start mt-1">₹</span>
        <span className="text-2xl font-bold">
          {Number(product.discountedPrice || product.price).toLocaleString('en-IN')}
        </span>
        {product.discountedPrice && (
          <span className="text-sm text-gray-500 line-through ml-2">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
        )}
      </div>

      <button 
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="mt-auto bg-amazon-yellow border border-yellow-500 p-2 text-xs md:text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 active:from-yellow-500 font-bold"
      >
        {mutation.isPending ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;