import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categoryId = searchParams.get('category_id');

  const isSearching = searchQuery || categoryId;

  // UPDATED: Now fetches all products by default if not searching
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, categoryId],
    queryFn: () => isSearching 
      ? productService.getProducts({ search: searchQuery, category_id: categoryId })
      : productService.getProducts() // Changed from getTrending to getProducts
  });

  // Since both calls now use getProducts, the data structure is consistent { products: [...] }
  const productsList = data?.products || [];

  if (isLoading) return <div className="p-10 text-center">Loading amazing deals...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error loading products.</div>;

  return (
    <div className="bg-[#EAEDED] min-h-screen pb-10">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        
        {/* Dynamic Header */}
        {isSearching ? (
          <div className="bg-white p-4 shadow-sm mb-4 rounded-sm border border-gray-200">
            <h2 className="text-xl font-bold">
              {productsList?.length} results {searchQuery && <span>for <span className="text-orange-700">"{searchQuery}"</span></span>}
            </h2>
          </div>
        ) : (
          /* Amazon-style Hero Banner */
          <div className="relative mb-6">
             <div className="absolute w-full h-32 bg-gradient-to-t from-[#EAEDED] to-transparent bottom-0 z-20" />
             <img 
               src="https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg" 
               alt="Hero" 
               className="w-full h-[300px] object-cover z-10"
             />
             <div className="absolute top-10 left-10 z-30">
                <h2 className="text-4xl font-extrabold text-gray-800">Big Deals Start Here</h2>
                <p className="text-lg text-gray-700 mt-2">Explore our full catalog of amazing products.</p>
             </div>
          </div>
        )}

        {/* Product Grid */}
        {productsList?.length === 0 ? (
          <div className="bg-white p-10 text-center text-lg rounded-sm border border-gray-200 shadow-sm">
            No products found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative z-30">
            {productsList?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;