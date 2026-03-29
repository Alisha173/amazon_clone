import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { orderService } from '../api/orderService';
import { productService } from '../api/productService';

const Orders = () => {
  // Fetch the user's past orders
  const { data: ordersData, isLoading: loadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getUserOrders
  });

  // Fetch featured products for the Sidebar and Carousel
  const { data: featuredData } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: productService.getFeatured
  });

  // Ensure we have an array to map over
  const orders = Array.isArray(ordersData) ? ordersData : ordersData?.orders || [];
  const featuredProducts = Array.isArray(featuredData) ? featuredData : featuredData?.products || [];

  if (loadingOrders) return <div className="p-10 text-center text-xl">Loading your orders...</div>;

  return (
    <div className="bg-white min-h-screen font-sans pb-10">
      <div className="max-w-[1200px] mx-auto px-4 pt-4">
        
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-600 mb-4">
          <Link to="#" className="hover:underline hover:text-orange-700">Your Account</Link> › <span className="text-[#C45500]">Your Orders</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* LEFT COLUMN: Orders List */}
          <div className="md:w-[75%]">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-3xl font-normal">Your Orders</h1>
              
              {/* Dummy Search Bar */}
              <div className="hidden sm:flex items-center border border-gray-400 rounded-md overflow-hidden h-8 w-64 shadow-sm">
                <div className="px-2 text-gray-500 bg-[#F3F3F3] border-r border-gray-400 h-full flex items-center justify-center">
                  <Search size={16} />
                </div>
                <input type="text" placeholder="Search all orders" className="flex-grow px-2 text-sm outline-none" />
                <button className="bg-gray-800 text-white px-3 text-sm h-full hover:bg-gray-700">Search Orders</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 text-sm mb-4">
              <span className="font-bold text-black border-b-2 border-orange-500 pb-1 cursor-pointer">Orders</span>
              <span className="text-[#007185] hover:underline hover:text-orange-700 cursor-pointer pb-1">Buy Again</span>
              <span className="text-[#007185] hover:underline hover:text-orange-700 cursor-pointer pb-1">Not Yet Shipped</span>
              <span className="text-[#007185] hover:underline hover:text-orange-700 cursor-pointer pb-1">Cancelled Orders</span>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm font-medium">
              <span className="text-black font-bold">{orders.length} order{orders.length === 1 ? '' : 's'}</span> placed in
              <select className="bg-[#F0F2F2] border border-gray-300 rounded-md p-1 ml-1 focus:ring-2 focus:ring-cyan-500 outline-none shadow-sm cursor-pointer">
                <option>past 3 months</option>
                <option>past 6 months</option>
                <option>2026</option>
              </select>
            </div>

            {/* Orders Feed */}
            {orders.length === 0 ? (
              <p className="text-gray-600 mt-4">You have not placed any orders yet.</p>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="border border-[#D5D9D9] rounded-lg overflow-hidden">
                    {/* Order Header (Gray Area) */}
                    <div className="bg-[#F0F2F2] border-b border-[#D5D9D9] p-4 flex flex-wrap gap-6 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="text-xs uppercase">Order Placed</span>
                        <span className="text-black">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase">Total</span>
                        <span className="text-black">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase">Ship To</span>
                        <span className="text-[#007185] hover:underline cursor-pointer">Scaler ▾</span>
                      </div>
                      <div className="flex flex-col ml-auto text-right">
                        <span className="text-xs uppercase">Order # {order.id}</span>
                        <div className="flex gap-2 justify-end">
                          <span className="text-[#007185] hover:underline cursor-pointer">View order details</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-[#007185] hover:underline cursor-pointer">Invoice</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Body (White Area) */}
                    <div className="p-4 bg-white">
                      <h2 className="font-bold text-lg mb-4 text-green-700">
                        {order.status === 'PLACED' ? 'Arriving Soon' : order.status}
                      </h2>
                      
                      {order.items?.map(item => (
                        <div key={item.id} className="flex gap-4 mb-4 last:mb-0">
                          <img src={item.product?.images?.[0]?.imageUrl || 'https://placehold.co/100'} alt={item.product?.name} className="w-20 h-20 object-contain" />
                          <div className="flex-grow">
                            <Link to={`/product/${item.productId}`} className="text-[#007185] hover:underline hover:text-orange-700 font-medium line-clamp-2">
                              {item.product?.name || 'Product Name'}
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">Sold by: Cocoblu Retail</p>
                            <div className="mt-2 space-x-2">
                              <button className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] px-3 py-1.5 rounded-full text-sm shadow-sm">
                                Track package
                              </button>
                              <button className="border border-[#D5D9D9] hover:bg-gray-50 px-3 py-1.5 rounded-full text-sm shadow-sm">
                                View your item
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar Recommendations */}
          <div className="md:w-[25%]">
            <div className="border border-[#D5D9D9] rounded-lg p-4 sticky top-4">
              <h3 className="font-bold text-base mb-4 text-center">Recommended for you</h3>
              <div className="space-y-4">
                {featuredProducts.slice(0, 4).map(product => (
                  <Link to={`/product/${product.id}`} key={product.id} className="flex gap-3 group">
                    <img src={product.images?.[0]?.imageUrl || 'https://placehold.co/50'} alt={product.name} className="w-16 h-16 object-contain" />
                    <div>
                      <p className="text-[#007185] group-hover:underline group-hover:text-orange-700 text-xs line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-[#B12704] font-bold text-sm mt-1">₹{Number(product.discountedPrice || product.price).toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM CAROUSEL */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold mb-4">Keep shopping for</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {featuredProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="min-w-[160px] max-w-[160px] group flex flex-col items-center">
                <div className="h-32 flex items-center justify-center mb-2">
                  <img src={product.images?.[0]?.imageUrl || 'https://placehold.co/100'} alt={product.name} className="max-h-full object-contain mix-blend-multiply" />
                </div>
                <p className="text-[#007185] group-hover:underline group-hover:text-orange-700 text-xs text-center line-clamp-2 w-full px-2">
                  {product.name}
                </p>
                <p className="text-[#B12704] font-bold text-sm mt-1">₹{Number(product.discountedPrice || product.price).toLocaleString('en-IN')}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Orders;