import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'price-asc', 'price-desc'
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching catalog", error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter 
      ? p.category.toLowerCase() === categoryFilter.toLowerCase()
      : true;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.productCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.basePricePerDay - b.basePricePerDay;
    if (sortBy === 'price-desc') return b.basePricePerDay - a.basePricePerDay;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="min-h-screen bg-brand-cream pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 border border-[#E5E5E0]">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by Code or Piece Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-b border-[#E5E5E0] focus:outline-none focus:border-brand-gold text-sm bg-transparent"
            />
            <span className="absolute left-0 top-2 text-brand-gray">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <label className="text-[10px] uppercase tracking-widest text-brand-gray font-bold">Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border-b border-[#E5E5E0] bg-transparent text-xs py-1 focus:outline-none uppercase tracking-widest">
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-brand-dark mb-4 filter">
            {categoryFilter ? categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1) : 'Complete Collection'}
          </h1>
          <p className="text-xs tracking-widest uppercase text-brand-gray">Viewing {filteredProducts.length} pieces of {products.length} in vault</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-brand-gold uppercase tracking-widest text-xs">Accessing Vault...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.map(product => (
              <Link to={`/shop/${product._id}`} key={product._id} className="group flex flex-col">
                <div className="relative aspect-[4/5] bg-white overflow-hidden mb-6 border border-[#E5E5E0]">
                  <img 
                    src={product.imageUrls[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                </div>
                
                <div className="text-center">
                  <p className="text-[10px] text-brand-gold font-mono tracking-widest mb-1">{product.productCode}</p>
                  <h3 className="text-lg font-serif text-brand-dark mb-2 group-hover:text-brand-gold transition-colors">{product.name}</h3>
                  <p className="text-brand-gray text-xs uppercase tracking-widest mb-2">{product.category}</p>
                  <p className="text-brand-dark font-medium">₹{product.basePricePerDay.toLocaleString()} <span className="text-xs text-brand-gray font-normal">/ day</span></p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-brand-gray uppercase tracking-widest text-xs">No pieces found in this collection.</div>
        )}

      </div>
    </div>
  );
};

export default Shop;
