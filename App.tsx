import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { ProductShowcase } from './components/ProductShowcase';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { CursorFollower } from './components/CursorFollower';
import { Login } from './components/Login';
import { ClientDashboard } from './components/ClientDashboard';
import { VendorDashboard } from './components/VendorDashboard';
import { InvestorDashboard } from './components/InvestorDashboard';
import { PaymentDemo } from './components/PaymentDemo';
import type { User, UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleLogin = (role: UserRole, email: string) => {
    setUser({
      id: Math.random().toString(36),
      email,
      role,
    });
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowLogin(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowDemo(false);
  };

  const handleShowDemo = () => {
    setShowDemo(true);
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
  };

  // If user is logged in, show role-specific dashboard
  if (user) {
    switch (user.role) {
      case 'CLIENT':
        return <ClientDashboard user={user} onLogout={handleLogout} />;
      case 'VENDOR':
        return <VendorDashboard user={user} onLogout={handleLogout} />;
      case 'INVESTOR':
        return <InvestorDashboard user={user} onLogout={handleLogout} />;
      default:
        return <div>Invalid Role</div>;
    }
  }

  // Show login screen
  if (showLogin) {
    return <Login onLogin={handleLogin} />;
  }

  // Show landing page
  return (
    <div className="font-sans bg-warm-50 text-stone-900 selection:bg-brand-200 selection:text-brand-900 cursor-none md:cursor-auto">
      <CursorFollower />
      <Navbar onGetStarted={handleShowLogin} onLogin={handleShowLogin} />
      <main>
        <Hero onGetStarted={handleShowLogin} onWatchDemo={handleShowDemo} />
        <HowItWorks />
        <Features />
        <ProductShowcase />
        <Testimonials />
      </main>
      <Footer />

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={handleCloseDemo}>
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Live Platform Preview</h2>
              <button onClick={handleCloseDemo} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="bg-gray-100 rounded-lg h-[600px] overflow-hidden border border-gray-200">
              <PaymentDemo />
            </div>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Try interacting with the payment buttons to see real-time updates.
              </p>
              <button
                onClick={handleShowLogin}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold transition"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default App;