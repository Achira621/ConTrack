import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGetStarted, onLogin }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: "Solutions", href: "#solutions" },
    { name: "Platform", href: "#platform" },
    { name: "Customers", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" }
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 px-6 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-8'}`}
    >
      <div className={`max-w-6xl mx-auto rounded-2xl transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border border-stone-200/50 p-3 pl-6 pr-3' : 'bg-transparent p-0'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold font-serif">C</div>
            <span className="font-serif font-semibold text-xl tracking-tight text-stone-800">ConTrack</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span onClick={onLogin} className="text-sm font-medium text-stone-600 cursor-pointer hover:text-brand-600">Login</span>
            <MagneticButton onClick={onGetStarted} className="!px-6 !py-2.5 !text-sm">
              Get Started
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-stone-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 p-4 bg-white shadow-xl border-t border-stone-100 md:hidden flex flex-col gap-4 mt-2"
        >
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-lg font-medium text-stone-700 py-2 border-b border-stone-50">
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <button onClick={onLogin} className="w-full py-3 text-stone-600 font-medium border border-stone-200 rounded-lg">Login</button>
            <button onClick={onGetStarted} className="w-full py-3 bg-brand-600 text-white font-medium rounded-lg">Get Started</button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};