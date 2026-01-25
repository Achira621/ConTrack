import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface HeroProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onWatchDemo }) => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-100/50 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-stone-200/50 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-stone-200 bg-white/50 backdrop-blur-sm text-stone-500 text-xs font-semibold tracking-wide uppercase"
        >
          The Future of Contract Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-900 leading-[1.1] mb-8"
        >
          Financial clarity <br />
          <span className="italic text-brand-600 font-light">in every clause.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          ConTrack transforms static documents into dynamic financial workflows.
          Manage, audit, and execute agreements with precision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton onClick={onGetStarted} className="w-full sm:w-auto text-lg px-8 py-5">
            Start Free Trial <ArrowRight size={18} />
          </MagneticButton>
          <MagneticButton onClick={onGetStarted} variant="secondary" className="w-full sm:w-auto text-lg px-8 py-5 group">
            <PlayCircle size={18} className="text-stone-400 group-hover:text-stone-600 transition-colors" /> Watch Demo
          </MagneticButton>
        </motion.div>
      </div>

      {/* Abstract Dashboard Hint - Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 100, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.2, delay: 0.8, type: "spring" }}
        style={{ perspective: 1000 }}
        className="mt-20 relative w-full max-w-5xl mx-auto"
      >
        <div className="relative rounded-t-2xl border border-stone-200 bg-white shadow-2xl shadow-stone-200/50 overflow-hidden h-[300px] md:h-[500px]">
          {/* Mock UI Elements */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-stone-50 border-b border-stone-100 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-stone-300"></div>
            <div className="w-3 h-3 rounded-full bg-stone-300"></div>
            <div className="w-3 h-3 rounded-full bg-stone-300"></div>
          </div>

          <div className="p-8 grid grid-cols-12 gap-6 opacity-60">
            <div className="col-span-3 space-y-4">
              <div className="h-8 w-3/4 bg-stone-100 rounded"></div>
              <div className="h-4 w-full bg-stone-50 rounded"></div>
              <div className="h-4 w-5/6 bg-stone-50 rounded"></div>
              <div className="h-4 w-4/5 bg-stone-50 rounded"></div>
            </div>
            <div className="col-span-9 space-y-6">
              <div className="flex justify-between">
                <div className="h-10 w-1/3 bg-stone-100 rounded"></div>
                <div className="h-10 w-24 bg-brand-100/50 rounded"></div>
              </div>
              <div className="h-64 w-full bg-stone-50 rounded border border-stone-100"></div>
            </div>
          </div>

          {/* Floating "Card" overlay */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="absolute top-1/3 right-12 w-64 bg-white p-4 rounded-xl shadow-xl border border-stone-100 z-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
              <div>
                <div className="text-xs text-stone-400">Status</div>
                <div className="text-sm font-semibold text-stone-800">Approved</div>
              </div>
            </div>
            <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full w-full bg-green-500"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>

    </section>
  );
};