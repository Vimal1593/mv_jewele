import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, calculateTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [address, setAddress] = useState({
    fullName: '', addressLine: '', city: '', state: '', pincode: '', phone: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('UPI_QR');
  const [upiRef, setUpiRef] = useState('');

  if (cartItems.length === 0) {
    return <div className="text-center py-20 text-brand-gray text-xs uppercase tracking-widest">Bag is Empty. Returning to Shop...</div>;
  }

  const totals = calculateTotal();
  
  // Create secure UPI Intent string dynamically based on exact order sum
  const upiUrl = `upi://pay?pa=rajvimal1593@oksbi&pn=MVJewelers&cu=INR&am=${totals.totalAmount}`;
  const upiQrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'UPI_QR' && !upiRef) {
      setError('You must enter the UTR/Reference number after completing the UPI scan.');
      return;
    }

    setLoading(true);
    setError(null);

    const orderPayload = {
      items: cartItems.map(i => ({
        product: i.product._id,
        name: i.product.name,
        rentalDays: i.pricing.rentalDays,
        discountApplied: i.pricing.discountAmount,
        rentalTotal: i.pricing.rentalTotal,
        securityDeposit: i.product.securityDeposit
      })),
      totalAmount: totals.totalAmount,
      shippingAddress: address,
      paymentMethod,
      upiTransactionId: paymentMethod === 'UPI_QR' ? upiRef : undefined
    };

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('customerToken')}` 
        },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Checkout failed');
      }

      clearCart();
      if (paymentMethod === 'UPI_QR') {
        alert('UPI Order Recorded! Admin will check the UTR against the bank statement before shipping.');
      } else {
        alert('Order Placed Successfully via Cash On Delivery!');
      }
      navigate('/');

    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const [isLocating, setIsLocating] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      try {
        if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
          // Fallback simulation for Demo purposes
          setAddress({
            ...address,
            addressLine: '123 Maker Chambers (Simulated GPS)',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          });
        } else {
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
          const data = await res.json();
          if (data.status === 'OK' && data.results.length > 0) {
            const formatted = data.results[0].formatted_address;
            const components = data.results[0].address_components;
            
            let city = '', state = '', pincode = '';
            components.forEach(comp => {
                if (comp.types.includes('locality')) city = comp.long_name;
                if (comp.types.includes('administrative_area_level_1')) state = comp.long_name;
                if (comp.types.includes('postal_code')) pincode = comp.long_name;
            });

            setAddress({
              ...address,
              addressLine: formatted,
              city,
              state,
              pincode
            });
          }
        }
      } catch (err) {
         console.error("Geocoding disabled or failed", err);
      }
      setIsLocating(false);
    }, () => {
      alert("Unable to retrieve your location. Please ensure location services are enabled.");
      setIsLocating(false);
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 font-sans mb-20">
      
      {/* Checkout Form */}
      <div>
        <h2 className="text-2xl font-serif text-brand-dark mb-8 border-b border-[#E5E5E0] pb-4">Secure Checkout</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-4 text-xs font-semibold mb-6 tracking-widest uppercase">{error}</div>}

        <form onSubmit={handleCheckout} className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray">Delivery Location</h3>
            <button 
              type="button" 
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-dark hover:text-brand-gold bg-brand-cream px-3 py-2 border border-[#E5E5E0] transition-colors disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {isLocating ? 'Detecting...' : 'Detect Location'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input required placeholder="Full Name" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:border-brand-gold bg-transparent text-sm"/>
            <input required placeholder="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:border-brand-gold bg-transparent text-sm"/>
          </div>
          <input required placeholder="Full Address" value={address.addressLine} onChange={e => setAddress({...address, addressLine: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:border-brand-gold bg-transparent text-sm"/>
          
          <div className="grid grid-cols-3 gap-4">
            <input required placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:border-brand-gold bg-transparent text-sm"/>
            <input required placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:border-brand-gold bg-transparent text-sm"/>
            <input required placeholder="PINCODE" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:border-brand-gold bg-transparent text-sm font-semibold"/>
          </div>
          <p className="text-[10px] text-brand-gray tracking-widest uppercase mt-1">Location availability will be verified against supported pincodes.</p>

          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray pt-6">Payment Method</h3>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer border p-4 bg-white shadow-sm flex-1">
              <input type="radio" value="UPI_QR" checked={paymentMethod === 'UPI_QR'} onChange={() => setPaymentMethod('UPI_QR')} className="text-brand-gold"/>
              Scan & Pay (Direct UPI)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer border p-4 bg-white shadow-sm flex-1">
              <input type="radio" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="text-brand-gold"/>
              Cash On Delivery
            </label>
          </div>

          {paymentMethod === 'UPI_QR' && (
            <div className="bg-[#fcfcfa] border border-[#E5E5E0] p-6 text-center space-y-4 shadow-inner mt-4">
              <h4 className="font-serif text-lg text-brand-dark">Scan via PhonePe / GPay / Paytm</h4>
              <img src={upiQrImageSrc} alt="UPI QR Scanner" className="mx-auto w-48 h-48 border border-[#E5E5E0] p-2 bg-white" />
              <p className="text-xs text-brand-gray tracking-widest font-mono">rajvimal1593@oksbi</p>
              
              <div className="mt-6 text-left">
                <label className="block text-xs uppercase tracking-wider text-brand-gray mb-1 font-bold">Step 2: Enter UTR / Reference ID</label>
                <input type="text" placeholder="e.g. 301294875638" value={upiRef} onChange={(e) => setUpiRef(e.target.value)} className="w-full border border-[#E5E5E0] p-3 focus:outline-none focus:border-brand-gold bg-white text-sm" />
                <p className="text-[10px] text-brand-gray mt-1">We will verify this exact reference code in our books before shipping your vault.</p>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full mt-8 bg-brand-dark text-white uppercase tracking-widest text-xs py-4 hover:bg-brand-gold transition-colors disabled:opacity-50">
            {loading ? 'Processing...' : `Place Order (₹${totals.totalAmount.toLocaleString()})`}
          </button>
        </form>
      </div>

      {/* Bag Summary */}
      <div className="bg-brand-cream border border-[#E5E5E0] p-8 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-widest mb-6">Order Summary</h3>
        <div className="space-y-4 mb-6">
          {cartItems.map(item => (
            <div key={item.cartItemId} className="flex justify-between border-b border-black/5 pb-4">
              <div className="text-sm text-brand-dark">
                <span className="font-semibold block">{item.product.name}</span>
                <span className="text-xs text-brand-gray">Refundable Deposit: ₹{item.product.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="text-right text-sm">
                <span className="block font-medium">₹{item.pricing.totalCost.toLocaleString()}</span>
                <span className="text-[10px] uppercase tracking-widest text-brand-gold">For {item.pricing.days} Days</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2 text-sm uppercase tracking-widest text-brand-gray">
          <div className="flex justify-between"><span>Rental Subtotal</span><span>₹{totals.cartRentalTotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-green-600"><span>Discounts</span><span>-₹{totals.cartDiscounts.toLocaleString()}</span></div>
          <div className="flex justify-between border-b pb-4"><span>Security Deposits</span><span>₹{totals.cartDepositTotal.toLocaleString()}</span></div>
          <div className="flex justify-between font-bold text-brand-dark pt-2 text-lg">
            <span>Amount Payable</span>
            <span>₹{totals.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
