import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // DigiLocker Simulation State
  const [showDigilocker, setShowDigilocker] = useState(false);
  const [digilockerData, setDigilockerData] = useState(null);
  
  const navigate = useNavigate();

  const handleDigilockerAuth = (e) => {
    e.preventDefault();
    setShowDigilocker(true);
  };

  const simulateDigilockerSuccess = () => {
    setDigilockerData({
      aadharVerified: true,
      aadharNumber: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
      digilockerId: `DL_AUTH_${Date.now()}`
    });
    setShowDigilocker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && !digilockerData) {
      setError('Aadhar verification via DigiLocker is mandatory for new Vault accounts.');
      return;
    }

    setLoading(true);
    setError('');
    const endpoint = isLogin ? '/api/auth/customer-login' : '/api/auth/register';
    
    // Combine standard form data with DigiLocker artifacts
    const payload = isLogin ? formData : { ...formData, ...digilockerData };
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('customerToken', data.token);
        localStorage.setItem('customerName', data.user.firstName);
        navigate('/'); // Redirect to Home securely logged in
      } else {
        setError(data.message || 'Authentication Failed');
      }
    } catch (err) {
      setError('Network connection error.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex bg-brand-cream font-sans relative">
      
      {/* DigiLocker Simulation Modal */}
      {showDigilocker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white max-w-md w-full border border-gray-300 shadow-2xl overflow-hidden rounded-md">
            <div className="bg-indigo-700 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/DigiLocker_logo.svg" alt="Digilocker" className="h-8 bg-white p-1 rounded" />
                <span className="font-semibold text-sm">Secure Authentication</span>
              </div>
              <button onClick={() => setShowDigilocker(false)} className="text-white hover:text-gray-300">&times;</button>
            </div>
            <div className="p-8 text-center space-y-6">
              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png" alt="Aadhar" className="h-12 mx-auto" />
              <p className="text-sm text-gray-600 leading-relaxed">
                MV Jewelers is requesting access to verify your Aadhar credentials for secure vault rentals.
              </p>
              
              <div className="border border-indigo-100 bg-indigo-50 p-4 rounded-sm">
                <p className="text-xs text-indigo-800 font-mono">Consenting to share:</p>
                <ul className="text-xs text-indigo-700 mt-2 text-left list-disc pl-5">
                  <li>Full Name & KYC Status</li>
                  <li>Aadhar Masked ID</li>
                </ul>
              </div>

              <button 
                onClick={simulateDigilockerSuccess}
                className="w-full bg-green-600 text-white py-3 rounded text-sm font-semibold hover:bg-green-700 transition">
                Approve & Share (Simulated)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left side Image Pane */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1599643478514-4a5202334f66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Luxury Auth"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
        />
        <div className="absolute inset-0 bg-brand-dark/40 mix-blend-multiply"></div>
        <div className="absolute bottom-16 left-16 text-white max-w-md">
          <h2 className="font-serif text-4xl mb-4 leading-tight">Welcome to the inner circle.</h2>
          <p className="text-xs uppercase tracking-widest text-brand-gold">Curated elegance.</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-10 shadow-sm border border-[#E5E5E0]">
          
          <div className="text-center">
            <h1 className="text-3xl font-serif text-brand-dark mb-2">{isLogin ? 'Sign In' : 'Create Account'}</h1>
            <p className="text-xs uppercase tracking-widest text-brand-gray">
              {isLogin ? 'Access your Vault' : 'Join MV Jewelers'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            {error && <div className="text-red-500 text-xs uppercase tracking-widest bg-red-50 p-3 text-center">{error}</div>}
            
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-gray mb-1">First Name</label>
                  <input required type="text" onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-gray mb-1">Last Name</label>
                  <input required type="text" onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-xs uppercase tracking-wider text-brand-gray mb-1">Email</label>
              <input required type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-brand-gray mb-1">Password</label>
              <input required type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
            </div>

            {!isLogin && (
              <div className="pt-4 border-t border-[#E5E5E0]">
                <label className="block text-[10px] uppercase tracking-wider text-brand-gray mb-2 font-bold">Mandatory Govt. KYC</label>
                {digilockerData ? (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 p-3">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <div className="text-xs text-green-800">
                      <span className="font-bold">Aadhar Verified</span>
                      <br/> ID: {digilockerData.aadharNumber}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={handleDigilockerAuth}
                    type="button" 
                    className="w-full flex items-center justify-center gap-3 border border-[#E5E5E0] bg-[#FAF9F6] text-brand-dark py-3 hover:border-brand-gold hover:text-brand-gold transition-colors text-xs font-semibold">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/DigiLocker_logo.svg" alt="DL" className="h-4" />
                    Verify via DigiLocker
                  </button>
                )}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-brand-dark text-white uppercase tracking-widest text-xs py-4 hover:bg-brand-gold transition-colors mt-6 disabled:opacity-50">
              {loading ? 'Authenticating...' : (isLogin ? 'Secure Entry' : 'Register Securely')}
            </button>
          </form>

          <div className="text-center mt-8 border-t border-[#E5E5E0] pt-6">
            <button onClick={() => setIsLogin(!isLogin)} className="text-xs uppercase tracking-widest text-brand-gray hover:text-brand-dark">
              {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Auth;
