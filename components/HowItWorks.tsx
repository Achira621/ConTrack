import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, Zap, ShieldCheck } from 'lucide-react';
import { Step } from '../types';

const steps: Step[] = [
  {
    number: "01",
    title: "Import",
    description: "Drag and drop any legacy contract. Our engine digitizes static text into structured data instantly."
  },
  {
    number: "02",
    title: "Analyze",
    description: "AI extracts key financial terms, obligations, and renewal dates, highlighting risks automatically."
  },
  {
    number: "03",
    title: "Automate",
    description: "Set rules for payments and compliance. Let the system handle the execution and alerts."
  }
];

export const HowItWorks: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="py-32 px-6 bg-white relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Fluid workflow. <br />Solid results.</h2>
            <p className="text-stone-500 text-lg max-w-md">Complexity, simplified. From draft to signature to renewal.</p>
          </motion.div>
          
          <motion.div style={{ y }} className="hidden md:block">
            {/* Parallax decorative element */}
            <div className="w-32 h-32 border border-stone-100 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-brand-50 rounded-full" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-0 right-0 h-px bg-stone-100 hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative bg-white pt-8 group cursor-default"
            >
              <div className="absolute top-0 left-0 w-3 h-3 bg-brand-500 rounded-full -mt-1.5 hidden md:block transition-transform duration-300 group-hover:scale-150" />
              
              <div className="text-6xl font-serif text-stone-100 font-bold mb-6 group-hover:text-brand-100 transition-colors duration-500">
                {step.number}
              </div>
              
              <div className="mb-4 text-brand-600">
                 {index === 0 && <FileText size={32} strokeWidth={1.5} />}
                 {index === 1 && <Zap size={32} strokeWidth={1.5} />}
                 {index === 2 && <ShieldCheck size={32} strokeWidth={1.5} />}
              </div>

              <h3 className="text-2xl font-semibold text-stone-900 mb-3">{step.title}</h3>
              <p className="text-stone-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};