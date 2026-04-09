import React, { useState, useMemo } from 'react';
import { differenceInDays, addDays } from 'date-fns';

const ProductDetail = ({ product }) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(addDays(new Date(), 1).toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const pricingDetails = useMemo(() => {
    if (!startDate || !endDate) return null;
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

  const handleReserve = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Connect to our secure backend API endpoint using relative URL
      // Nginx will internally proxy this to the backend container over the overlay_net network
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          basePricePerDay: product.basePricePerDay,
          securityDeposit: product.securityDeposit,
          category: product.category,
          imageUrls: product.imageUrls
        })
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: `Success! Checked with MongoDB backend (ID: ${data.data.id})` });
      } else {
        setMessage({ type: 'error', text: 'Backend validation rejected this request.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network Error: Cannot reach backend server on port 5000.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark font-sans antialiased">
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 text-sm lg:text-base">
        
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
            <h1 className="text-4xl lg:text-5xl font-serif tracking-tight text-brand-dark mb-3">{product.name}</h1>
            <p className="text-brand-gray italic text-xs tracking-widest mb-6">For your best moments.</p>
            <p className="text-[#4A4A48] leading-relaxed mb-6 font-light">{product.description}</p>
            <p className="text-3xl font-light text-brand-gold">₹{product.basePricePerDay.toLocaleString()} <span className="text-sm text-brand-gray tracking-widest uppercase">/ Day</span></p>
          </div>

          {/* Date Picker using native inputs for wide compatibility & accessibility */}
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
          
          {message && (
            <div className={`p-4 rounded-sm text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          <button 
            onClick={handleReserve}
            disabled={loading || pricingDetails?.error}
            className="w-full bg-brand-dark text-white py-4 hover:bg-brand-gold transition-colors duration-300 uppercase tracking-[0.2em] text-xs font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Processing...' : 'Reserve For Your Moment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
