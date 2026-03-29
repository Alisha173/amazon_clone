import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../api/cartService';
import { CheckCircle, Trash2, Minus, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch Cart Data
  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  });

  // Mutation for updating quantity (Optimistic Update)
  const updateQuantity = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.updateCart(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData(['cart']);

      queryClient.setQueryData(['cart'], (oldCart) => {
        if (!oldCart) return oldCart;
        return {
          ...oldCart,
          items: oldCart.items.map(item => 
            item.productId === productId ? { ...item, quantity } : item
          )
        };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Mutation for removing items
  const removeItem = useMutation({
    mutationFn: (productId) => cartService.removeFromCart(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  if (isLoading) return <div className="p-10 text-center text-xl">Loading your cart...</div>;

  const items = cartData?.items || [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartData?.summary?.total || items.reduce((sum, item) => sum + (Number(item.product.discountedPrice || item.product.price) * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="max-w-screen-2xl mx-auto p-6 mt-6 bg-white shadow-sm min-h-[400px]">
        <h2 className="text-3xl font-bold">Your Amazon Cart is empty.</h2>
        <p className="mt-2 text-gray-600">Check your Saved for later items below or continue shopping.</p>
        <Link to="/" className="text-blue-600 hover:underline hover:text-orange-700 mt-4 inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen py-6 px-4">
      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: Cart Items */}
        <div className="flex-grow bg-white p-6 shadow-sm">
          <div className="border-b border-gray-300 pb-2 mb-4 flex justify-between items-end">
            <div>
              <h1 className="text-3xl mb-1 font-medium">Shopping Cart</h1>
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">Deselect all items</span>
            </div>
            <span className="text-gray-600 text-sm hidden sm:block">Price</span>
          </div>

          {items.map((item) => (
            <div key={item.productId} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-200 last:border-0">
              {/* Image Section */}
              <div className="flex gap-4 items-start sm:w-1/4">
                <input type="checkbox" className="mt-2 w-4 h-4 cursor-pointer" defaultChecked />
                <img 
                  src={item.product.images?.[0]?.imageUrl || 'https://placehold.co/150'} 
                  alt={item.product.name} 
                  className="w-32 h-32 object-contain mix-blend-multiply"
                />
              </div>

              {/* Product Info Section */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg text-black hover:text-orange-700 font-medium cursor-pointer line-clamp-2 pr-4">
                      {item.product.name}
                    </h3>
                    <span className="text-lg font-bold whitespace-nowrap">
                      ₹{Number(item.product.discountedPrice || item.product.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 my-1">In stock</p>
                  <p className="text-xs text-gray-600 mb-1">Eligible for FREE Shipping</p>
                </div>

                {/* Actions (Quantity & Delete) */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-[#F0F2F2]">
                    <button 
                      onClick={() => {
                        if (item.quantity === 1) removeItem.mutate(item.productId);
                        else updateQuantity.mutate({ productId: item.productId, quantity: item.quantity - 1 });
                      }}
                      disabled={updateQuantity.isPending}
                      className="px-2 py-1 hover:bg-gray-200 text-black transition-colors"
                    >
                      {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                    </button>
                    <span className="px-3 py-1 bg-white text-sm font-semibold border-x border-gray-300 min-w-[32px] text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                      disabled={updateQuantity.isPending}
                      className="px-2 py-1 hover:bg-gray-200 text-black transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex gap-3 text-sm text-blue-600">
                    <button 
                      onClick={() => removeItem.mutate(item.productId)} 
                      className="hover:underline"
                    >
                      Delete
                    </button>
                    <span className="text-gray-300">|</span>
                    <button className="hover:underline">Save for later</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="text-right pt-4 text-lg">
            Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}): <span className="font-bold">₹{Number(subtotal).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Checkout Card */}
        <div className="w-full lg:w-[300px] bg-white p-5 shadow-sm h-fit shrink-0 sticky top-24">
          <div className="flex items-start gap-2 mb-4 text-sm">
            <CheckCircle size={20} className="text-green-700 shrink-0 mt-0.5" fill="currentColor" color="white" />
            <div>
              <p className="text-green-700">
                <span className="font-bold">Your order qualifies for FREE Delivery.</span>
                <br />
                <span className="text-gray-600">Select this option at checkout.</span>
              </p>
            </div>
          </div>

          <div className="text-lg mb-4">
            Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}): <span className="font-bold">₹{Number(subtotal).toLocaleString('en-IN')}</span>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            disabled={items.length === 0}
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-2 rounded-full shadow-sm text-sm border border-[#FCD200] font-medium transition-all"
          >
            Proceed to Buy
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;