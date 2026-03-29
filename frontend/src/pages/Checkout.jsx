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

  // State is now pre-filled with the Scaler address but remains fully editable
  const [formData, setFormData] = useState({
    addressLine1: '14, 3rd cross, Parappana Agrahar, Electronic City Phase 1',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560100'
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

  // Handle typing in the input fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e?.preventDefault(); // Prevent page reload
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

  const deliveryFee = 79;
  const codFee = 14;
  const orderTotal = Number(itemsTotal) + codFee; 

  if (!buyNowItem && isLoading) return <div className="p-10 text-center">Loading checkout...</div>;

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
          
          {/* 1. ACTUAL ADDRESS FORM */}
          <div className="border border-gray-300 rounded-md p-6 bg-white">
            <h2 className="text-xl font-bold mb-4 text-[#C45500]">1. Delivery address</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-bold mb-1">Street Address</label>
                <input required type="text" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} className="w-full border border-gray-400 rounded p-2 text-sm focus:border-orange-500 outline-none shadow-sm transition-colors" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-400 rounded p-2 text-sm focus:border-orange-500 outline-none shadow-sm transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">State</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full border border-gray-400 rounded p-2 text-sm focus:border-orange-500 outline-none shadow-sm transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Pincode</label>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-1/2 border border-gray-400 rounded p-2 text-sm focus:border-orange-500 outline-none shadow-sm transition-colors" />
              </div>
            </form>
          </div>

          {/* 2. Payment Block (Static) */}
          <div className="border border-gray-300 rounded-md p-4 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold">Pay on delivery (Cash/Card)</h2>
              <p className="text-sm text-blue-600 hover:underline cursor-pointer mt-2">Use a gift card, voucher or promo code</p>
            </div>
          </div>

          {/* 3. Review Items Block */}
          <div className="border border-gray-300 rounded-md overflow-hidden mt-4">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#C45500]">2. Review items and shipping</h2>
            </div>

            {productsToRender.map((item, index) => (
              <div key={index} className="p-4 flex flex-col md:flex-row gap-6 border-b border-gray-200 last:border-0">
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
                    <p className="text-xs text-gray-600 mt-1">Sold by <span className="text-blue-600 hover:underline cursor-pointer">Cocoblu Retail</span></p>
                    <p className="text-xs mt-2 font-bold">Quantity: {item.quantity}</p>
                  </div>
                </div>

                <div className="md:w-1/3 text-sm">
                  <div className="flex items-start gap-2">
                    <input type="radio" checked readOnly className="mt-1" />
                    <div>
                      <p className="font-bold text-green-700">Standard Delivery</p>
                      <p className="text-gray-500 line-through">₹79 per unit</p>
                      <p className="text-gray-800">FREE delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Summary Sticky Sidebar */}
        <div className="md:w-[30%]">
          <div className="border border-gray-300 rounded-md p-4 sticky top-4 bg-white">
            {/* IMPORTANT: form="checkout-form" allows this button to submit the form in the left column */}
            <button 
              form="checkout-form"
              type="submit"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;