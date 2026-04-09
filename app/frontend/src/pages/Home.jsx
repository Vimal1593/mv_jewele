import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1599643478514-4a5202334f66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Luxury Jewelry" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div> {/* Dark overlay for text contrast */}
        
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-6 drop-shadow-md">The Vintage Collection</h2>
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight mb-8 max-w-4xl drop-shadow-lg">
            Adorn yourself in history.
          </h1>
          <Link 
            to="/shop" 
            className="bg-white/90 backdrop-blur-sm text-brand-dark px-12 py-4 uppercase text-xs font-semibold tracking-widest hover:bg-brand-gold hover:text-white transition-all duration-500 shadow-xl">
            Explore Rentals
          </Link>
        </div>
      </div>

      {/* Market Standard: How It Works */}
      <div className="bg-white py-24 border-y border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-brand-dark">
          <h2 className="text-3xl font-serif mb-4">How It Works</h2>
          <p className="text-xs tracking-widest uppercase text-brand-gray mb-16">The MV Jewelers Experience</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm leading-relaxed">
            <div className="space-y-4">
              <div className="text-2xl font-serif text-brand-gold italic">01</div>
              <h4 className="uppercase tracking-widest font-bold text-xs">Browse the Vault</h4>
              <p className="text-brand-gray">Select your luxury piece and choose your rental dates for your specific Indian occasion.</p>
            </div>
            <div className="space-y-4">
              <div className="text-2xl font-serif text-brand-gold italic">02</div>
              <h4 className="uppercase tracking-widest font-bold text-xs">Secure Deposit</h4>
              <p className="text-brand-gray">Place a refundable security deposit to ensure the safety of our high-value artifacts.</p>
            </div>
            <div className="space-y-4">
              <div className="text-2xl font-serif text-brand-gold italic">03</div>
              <h4 className="uppercase tracking-widest font-bold text-xs">Adorn in Luxury</h4>
              <p className="text-brand-gray">Receive your piece via secure courier. Shine in your best moments.</p>
            </div>
            <div className="space-y-4">
              <div className="text-2xl font-serif text-brand-gold italic">04</div>
              <h4 className="uppercase tracking-widest font-bold text-xs">Returns & Refunds</h4>
              <p className="text-brand-gray">Return the piece within your window. Your deposit is refunded within 48 hours of inspection.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof: Testimonials */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-serif text-brand-dark mb-6 italic">"A regal experience that transformed my wedding into a timeless memory."</h2>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-4 w-4 text-brand-gold fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              ))}
            </div>
            <p className="text-xs uppercase tracking-widest text-brand-gray font-bold">Deepika S. — Mumbai, India</p>
          </div>
          <div className="bg-brand-dark p-8 text-white space-y-8">
            <h3 className="text-xs uppercase tracking-[0.3em] font-light">As Seen In</h3>
            <div className="flex flex-wrap gap-8 opacity-50 grayscale invert">
              <span className="text-xl font-serif italic">VOGUE</span>
              <span className="text-xl font-serif uppercase tracking-widest">Bazaar</span>
              <span className="text-xl font-serif">ELLE</span>
              <span className="text-xl font-serif font-bold italic">GQ</span>
            </div>
            <p className="text-[10px] leading-relaxed tracking-widest uppercase opacity-70">
              Recognized globally for setting the benchmark in sustainable luxury and heritage rental accessibility.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-brand-dark">Curated For You</h2>
          <div className="h-px w-16 bg-brand-gold mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative h-96 overflow-hidden cursor-pointer">
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
            <div className="absolute bottom-8 left-8">
              <h3 className="text-xl font-serif text-white mb-2">Bracelets</h3>
              <p className="text-xs tracking-widest uppercase text-white/80 group-hover:text-brand-gold transition-colors">Rent Now</p>
            </div>
          </div>
          
          <div className="group relative h-96 overflow-hidden cursor-pointer">
            <img src="https://plus.unsplash.com/premium_photo-1673356302067-aac3b545a362?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
            <div className="absolute bottom-8 left-8">
              <h3 className="text-xl font-serif text-white mb-2">Fine Watches</h3>
              <p className="text-xs tracking-widest uppercase text-white/80 group-hover:text-brand-gold transition-colors">Rent Now</p>
            </div>
          </div>
          
          <div className="group relative h-96 overflow-hidden cursor-pointer">
            <img src="https://images.unsplash.com/photo-1605100804763-247f67b2548e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
            <div className="absolute bottom-8 left-8">
              <h3 className="text-xl font-serif text-white mb-2">Engagement</h3>
              <p className="text-xs tracking-widest uppercase text-white/80 group-hover:text-brand-gold transition-colors">Rent Now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
