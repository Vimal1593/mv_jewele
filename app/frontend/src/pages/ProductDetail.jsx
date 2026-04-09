import React, { useState, useMemo, useEffect } from 'react';
import { differenceInDays, addDays } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useCart();
  
  const isWishlisted = wishlist.some(p => p._id === id);
  
  const [product, setProduct] = useState(null);
  const [loadingDb, setLoadingDb] = useState(true);
  
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(addDays(new Date(), 1).toISOString().split('T')[0]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.data);
        } else {
          navigate('/shop');
        }
      } catch (err) {
        navigate('/shop');
      }
      setLoadingDb(false);
    };
    fetchProduct();
  }, [id, navigate]);

  const pricingDetails = useMemo(() => {
    if (!product || !startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInDays(end, start);
    
    if (days <= 0) return { error: "End date must be after start date" };

    let discountPercent = 0;
    if (days >= 7) discountPercent = 0.20;
    else if (days >= 3) discountPercent = 0.10;

    const baseCost = days * product.basePricePerDay;
    const discountAmount = baseCost * discountPercent;
    const rentalCost = baseCost - discountAmount;
    const totalCost = rentalCost + product.securityDeposit;

    return { days, baseCost, discountPercent, discountAmount, rentalCost, totalCost };
  }, [startDate, endDate, product]);

  if (loadingDb) {
    return <div className="min-h-screen bg-brand-cream flex items-center justify-center text-brand-gold uppercase tracking-widest text-xs">Accessing Vault...</div>;
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark font-sans antialiased pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 text-sm lg:text-base">
        
        {/* Image Display */}
        <div className="w-full aspect-[4/5] bg-white rounded-sm shadow-sm overflow-hidden border border-[#E5E5E0]">
          <img 
            src={product.imageUrls[0]} 
            alt={product.name} 
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 ease-in-out" 
          />
        </div>

        {/* Product Information & Live Calculator */}
        <div className="flex flex-col justify-center space-y-10">
          <div>
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] text-brand-gold font-mono tracking-widest">{product.productCode}</p>
              <p className="text-[10px] bg-brand-dark text-white px-2 py-0.5 tracking-widest uppercase">{product.metalType}</p>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif tracking-tight text-brand-dark mb-3">{product.name}</h1>
            <p className="text-brand-gray italic text-xs tracking-widest mb-6">For your best moments.</p>
            
            {product.quantityAvailable <= 0 && (
              <div className="mb-6 inline-block bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-1 font-semibold tracking-widest uppercase">
                Currently Out of Stock / Rented
              </div>
            )}

            <p className="text-[#4A4A48] leading-relaxed mb-6 font-light">{product.description}</p>
            <p className="text-3xl font-light text-brand-gold">₹{product.basePricePerDay.toLocaleString()} <span className="text-sm text-brand-gray tracking-widest uppercase">/ Day</span></p>
          </div>

          {/* Date Picker */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-[#E5E5E0] space-y-5">
            <h3 className="font-semibold text-brand-dark uppercase tracking-widest text-xs">Select Rental Period</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-gray mb-2">Start Date</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold transition-colors bg-transparent cursor-pointer text-brand-dark"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-gray mb-2">End Date</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold transition-colors bg-transparent cursor-pointer text-brand-dark"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Live Price Breakdown */}
          {pricingDetails && !pricingDetails.error && (
            <div className="bg-[#FAF9F6] p-6 rounded-sm border border-[#EBEBE6] space-y-4 shadow-inner">
              <div className="flex justify-between text-[#4A4A48] text-sm">
                <span>Rental Period ({pricingDetails.days} days)</span>
                <span>₹{pricingDetails.baseCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              
              {pricingDetails.discountAmount > 0 && (
                <div className="flex justify-between text-brand-gold text-sm font-medium">
                  <span>Extended Discount ({pricingDetails.discountPercent * 100}%)</span>
                  <span>-₹{pricingDetails.discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}
              
              <div className="flex justify-between text-[#4A4A48] text-sm border-b border-[#EBEBE6] pb-4">
                <span>Refundable Security Deposit</span>
                <span>₹{product.securityDeposit.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              
              <div className="flex justify-between text-xl font-serif text-brand-dark pt-2">
                <span>Total Upfront</span>
                <span>₹{pricingDetails.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          )}

          {pricingDetails?.error && (
            <div className="text-red-500 text-sm font-medium bg-red-50 p-3 border border-red-100 rounded-sm">{pricingDetails.error}</div>
          )}

          <div className="flex gap-4">
            <button 
              onClick={() => addToCart(product, pricingDetails)}
              disabled={pricingDetails?.error || product.quantityAvailable <= 0}
              className="flex-grow bg-brand-dark text-white py-4 hover:bg-brand-gold transition-colors duration-300 uppercase tracking-[0.2em] text-xs font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
              {product.quantityAvailable <= 0 ? 'Unavailable' : 'Place In Bag'}
            </button>
            <button 
              onClick={() => toggleWishlist(product)}
              className={`p-4 border transition-all duration-300 ${isWishlisted ? 'bg-brand-gold border-brand-gold text-white' : 'border-[#E5E5E0] text-brand-gray hover:border-brand-gold hover:text-brand-gold'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
