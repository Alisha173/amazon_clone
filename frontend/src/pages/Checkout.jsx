import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../api/cartService';
import { orderService } from '../api/orderService';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Trash2, Plus, Gem } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const buyNowItem = location.state?.buyNowItem;

  // We keep this state so the backend still receives valid data, 
  // even though the UI looks like a static summary.
  const [formData] = useState({
    addressLine1: '575/1, Vrindavan Gardens, KADUNGALLOOR',
    city: 'Ernakulam',
    state: 'KERALA',
    pincode: '683110'
  });

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: !buyNowItem 
  });

  const checkoutMutation = useMutation({
    mutationFn: (payload) => orderService.createOrder(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigate(`/order-confirmation/${data.order_id}`);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Checkout failed.');
    }
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    const payload = { ...formData };
    if (buyNowItem) {
      payload.productId = buyNowItem.productId;
      payload.quantity = buyNowItem.quantity;
    }
    checkoutMutation.mutate(payload);
  };

  const totalItems = buyNowItem 
    ? buyNowItem.quantity 
    : (cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);

  const itemsTotal = buyNowItem 
    ? (buyNowItem.price * buyNowItem.quantity) 
    : (cartData?.summary?.total || 0);

  // Static fees to match screenshot
  const deliveryFee = 79;
  const codFee = 14;
  const orderTotal = Number(itemsTotal) + codFee; // Free delivery cancels the delivery fee

  if (!buyNowItem && isLoading) return <div className="p-10 text-center">Loading checkout...</div>;

  // Helper to render either the single item or the cart items
  const productsToRender = buyNowItem 
    ? [{ 
        product: { 
          name: buyNowItem.name, 
          images: [{ imageUrl: buyNowItem.image }], 
          discountedPrice: buyNowItem.price, 
          discountPercent: 10 
        }, 
        quantity: buyNowItem.quantity 
      }] 
    : cartData?.items || [];

  return (
    <div className="bg-white min-h-screen font-sans pb-20">
      {/* Checkout Header */}
      <div className="bg-[#F0F2F2] border-b border-gray-300 py-4 px-4 md:px-20 flex justify-between items-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="w-24 object-contain mt-2" />
        <h1 className="text-2xl font-normal text-gray-800">
          Checkout {buyNowItem && <span className="text-sm text-gray-500">(Buy Now)</span>}
        </h1>
        <Lock className="text-gray-500" size={24} />
      </div>

      <div className="max-w-[1000px] mx-auto px-4 mt-6 flex flex-col md:flex-row gap-6">
        
        {/* LEFT SIDE: Main Content */}
        <div className="md:w-[70%] space-y-4">
          
          {/* 1. Address Block */}
          <div className="border border-gray-300 rounded-md p-4 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold">Delivering to Alisha Ameer</h2>
              <p className="text-sm text-gray-800 mt-1">575/1, Vrindavan Gardens, KADUNGALLOOR, KERALA, 683110, India</p>
              <p className="text-sm text-blue-600 hover:underline cursor-pointer mt-2">Add delivery instructions</p>
            </div>
            <span className="text-sm text-blue-600 hover:underline cursor-pointer">Change</span>
          </div>

          {/* 2. Payment Block */}
          <div className="border border-gray-300 rounded-md p-4 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold">Pay on delivery (Cash/Card)</h2>
              <p className="text-sm text-blue-600 hover:underline cursor-pointer mt-2">Use a gift card, voucher or promo code</p>
            </div>
            <span className="text-sm text-blue-600 hover:underline cursor-pointer">Change</span>
          </div>

          {/* 3. Diamonds Block */}
          <div className="border border-gray-300 rounded-md p-4">
            <h2 className="text-lg font-bold mb-2">Use your Diamonds</h2>
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="w-4 h-4" />
              <span><span className="bg-green-700 text-white px-1 text-xs font-bold rounded-sm">Save ₹23</span> extra using <Gem size={14} className="inline text-blue-500" fill="currentColor"/> 230</span>
            </div>
            <p className="text-sm text-orange-700 mt-2">⚠️ Change payment method to use Diamonds</p>
          </div>

          {/* 4. Review Items Block */}
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Arriving 30 Mar 2026</h2>
              <p className="text-sm text-gray-600 mt-1">If you order in the next 12 hours and 14 minutes</p>
            </div>

            {productsToRender.map((item, index) => (
              <div key={index} className="p-4 flex flex-col md:flex-row gap-6 border-b border-gray-200 last:border-0">
                {/* Product Info */}
                <div className="md:w-2/3 flex gap-4">
                  <img src={item.product.images?.[0]?.imageUrl || 'https://placehold.co/150'} alt="" className="w-20 h-24 object-contain" />
                  <div>
                    <p className="font-bold text-sm leading-tight">{item.product.name}</p>
                    
                    {item.product.discountPercent > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-[#CC0C39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                          {item.product.discountPercent}% off
                        </span>
                        <span className="text-[#CC0C39] text-xs font-bold">Limited time deal</span>
                      </div>
                    )}

                    <p className="font-bold mt-1">₹{Number(item.product.discountedPrice || item.product.price).toLocaleString('en-IN')}</p>
                    
                    <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                      <p>Ships from Amazon <span className="bg-gray-700 text-white px-1 font-bold rounded-sm text-[10px]">Fulfilled</span></p>
                      <p>Sold by <span className="text-blue-600 hover:underline cursor-pointer">Cocoblu Retail</span></p>
                    </div>

                    {/* Quantity Pill Match */}
                    <div className="flex items-center border border-gray-300 rounded-full shadow-sm bg-[#F0F2F2] w-fit mt-3">
                      <button className="p-1.5 hover:bg-gray-200 text-black rounded-l-full">
                        <Trash2 size={14} />
                      </button>
                      <span className="px-3 py-0.5 bg-white text-sm font-semibold border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button className="p-1.5 hover:bg-gray-200 text-black rounded-r-full">
                        <Plus size={14} />
                      </button>
                    </div>

                    <p className="text-sm text-blue-600 hover:underline cursor-pointer mt-3">Add gift options</p>
                  </div>
                </div>

                {/* Delivery Option */}
                <div className="md:w-1/3 text-sm">
                  <div className="flex items-start gap-2">
                    <input type="radio" checked readOnly className="mt-1" />
                    <div>
                      <p className="font-bold text-green-700">Tomorrow, 30 Mar</p>
                      <p className="text-gray-500 line-through">₹79 per unit</p>
                      <p className="text-gray-800">FREE One-day delivery</p>
                      <p className="text-gray-600 mt-1">PRIME DELIVERY UNLOCKED</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-4 bg-gray-50 text-xs text-gray-600">
              Item often sent in manufacturer's box to reduce packaging and reveals what's inside. If this is a gift, consider sending to a different address.
            </div>
          </div>

          {/* Bottom Placement Box */}
          <div className="border border-gray-300 rounded-md p-4 flex flex-col md:flex-row items-center gap-6">
            <button 
              onClick={handleSubmit}
              disabled={checkoutMutation.isPending}
              className="w-full md:w-auto px-8 bg-[#FFD814] hover:bg-[#F7CA00] py-2 rounded-full text-sm font-normal border border-[#FCD200] shadow-sm disabled:opacity-50"
            >
              {checkoutMutation.isPending ? 'Placing...' : 'Place your order'}
            </button>
            <div>
              <p className="text-lg font-bold text-[#B12704]">Order Total: ₹{Number(orderTotal).toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-600 mt-1">By placing your order, you agree to Amazon's <span className="text-blue-600 hover:underline">privacy notice</span> and <span className="text-blue-600 hover:underline">conditions of use</span>.</p>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE: Summary Sticky Sidebar */}
        <div className="md:w-[30%]">
          <div className="border border-gray-300 rounded-md p-4 sticky top-4 bg-white">
            <button 
              onClick={handleSubmit}
              disabled={checkoutMutation.isPending || totalItems === 0}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] py-2 rounded-full text-sm font-normal border border-[#FCD200] shadow-sm mb-3 transition-all disabled:opacity-50"
            >
              {checkoutMutation.isPending ? 'Placing...' : 'Place your order'}
            </button>
            <p className="text-[11px] text-center text-gray-600 leading-tight border-b border-gray-200 pb-4">
              By placing your order, you agree to Amazon's <span className="text-blue-600 hover:underline cursor-pointer">privacy notice</span> and <span className="text-blue-600 hover:underline cursor-pointer">conditions of use</span>.
            </p>
            
            <div className="mt-4">
              <h3 className="font-bold text-sm mb-2">Order Summary</h3>
              <div className="space-y-1 text-xs text-gray-800">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>₹{Number(itemsTotal).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>₹{deliveryFee}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600 hover:underline cursor-pointer">Cash/Pay on Delivery fee</span>
                  <span>₹{codFee}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>₹{(Number(itemsTotal) + deliveryFee + codFee).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Free Delivery</span>
                  <span>-₹{deliveryFee}.00</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg text-[#B12704] mt-3 pt-3 border-t border-gray-200">
                <span>Order Total:</span>
                <span>₹{Number(orderTotal).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs">
              <span>Diamonds earned:</span>
              <span className="font-bold"><Gem size={12} className="inline text-blue-500 mb-0.5" fill="currentColor"/> 155</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;