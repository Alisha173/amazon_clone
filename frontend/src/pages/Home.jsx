import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categoryId = searchParams.get('category_id');

  const isSearching = searchQuery || categoryId;

  // If searching, pass the params object. Otherwise, fetch trending.
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery, categoryId],
    queryFn: () => isSearching 
      ? productService.getProducts({ search: searchQuery, category_id: categoryId })
      : productService.getTrending()
  });

  // Your backend getProducts returns { products: [...] }, but getTrending returns an array directly.
  const productsList = isSearching ? data?.products : data;

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
          <div className="bg-blue-200 h-64 mb-6 rounded-md flex items-center justify-center">
            <h2 className="text-4xl font-bold text-gray-800">Big Deals Start Here</h2>
          </div>
        )}

        {/* Product Grid */}
        {productsList?.length === 0 ? (
          <div className="bg-white p-10 text-center text-lg rounded-sm border border-gray-200 shadow-sm">
            No products match your search. Try checking your spelling or using more general terms.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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