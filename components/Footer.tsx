import React from 'react';
import { MagneticButton } from './MagneticButton';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-100 pt-32 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-5xl md:text-7xl text-stone-900 mb-8"
          >
            Ready to optimize?
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-xl text-stone-500 max-w-2xl mb-12"
          >
            Join forward-thinking companies organizing their financial agreements with ConTrack.
          </motion.p>
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.4 }}
          >
             <MagneticButton className="px-10 py-6 text-xl">Get Started Now</MagneticButton>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-stone-200 pt-16 mb-16">
          <div>
            <h4 className="font-bold text-stone-900 mb-6">Product</h4>
            <ul className="space-y-4 text-stone-500 text-sm">
              <li><a href="#" className="hover:text-brand-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-6">Company</h4>
            <ul className="space-y-4 text-stone-500 text-sm">
              <li><a href="#" className="hover:text-brand-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-stone-500 text-sm">
              <li><a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center text-white font-serif text-xs">C</div>
              <span className="font-serif font-bold text-lg text-stone-900">ConTrack</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Redefining contract management for the modern financial ecosystem.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-stone-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ConTrack Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-brand-600">Twitter</a>
             <a href="#" className="hover:text-brand-600">LinkedIn</a>
             <a href="#" className="hover:text-brand-600">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};