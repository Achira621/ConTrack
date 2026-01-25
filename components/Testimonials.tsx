import React from 'react';
import { motion } from 'framer-motion';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    quote: "ConTrack cut our audit time by 70%. It's the first legal tech tool that our finance team actually enjoys using.",
    author: "Elena Rodriguez",
    role: "CFO",
    company: "Apex Ventures"
  },
  {
    quote: "The clarity it brings to our obligations is unmatched. We haven't missed a renewal date in two years.",
    author: "Marcus Chen",
    role: "Head of Legal",
    company: "TechFlow Systems"
  },
  {
    quote: "Clean, fast, and incredibly smart. It feels less like software and more like a capable partner.",
    author: "Sarah Jenkins",
    role: "Operations Director",
    company: "Novus Group"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-16 text-center"
        >
          <h2 className="font-serif text-4xl text-stone-900">Trusted by modern teams</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-warm-50 p-8 rounded-2xl border border-stone-100 flex flex-col justify-between"
            >
              <p className="text-stone-600 text-lg leading-relaxed mb-8 italic">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 font-serif font-bold text-xl">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-stone-900">{t.author}</div>
                  <div className="text-sm text-stone-500">{t.role}, {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};