import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const ProductShowcase: React.FC = () => {
  return (
    <section className="py-32 px-6 overflow-hidden bg-stone-900 text-white relative">
       {/* Background noise texture or gradient */}
       <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 opacity-80" />
       
       <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
         >
           <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
             See the whole picture. <br />
             <span className="text-brand-400">Before you sign.</span>
           </h2>
           <p className="text-stone-400 text-lg mb-8 max-w-md leading-relaxed">
             Our interface prioritizes human readability while maintaining machine precision. Catch risks that standard redlines miss.
           </p>
           
           <ul className="space-y-4">
             {["Semantic Analysis", "Risk Scoring", "Automated Approval Chains"].map((item, i) => (
               <motion.li 
                 key={i}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.4 + (i * 0.1) }}
                 className="flex items-center gap-3 text-stone-300"
               >
                 <CheckCircle2 className="text-brand-500" size={20} />
                 {item}
               </motion.li>
             ))}
           </ul>
         </motion.div>

         <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
         >
            {/* Abstract UI representation */}
            <div className="relative rounded-xl bg-stone-800 border border-stone-700 shadow-2xl overflow-hidden aspect-[4/3]">
              <div className="absolute top-0 left-0 right-0 h-14 bg-stone-800 border-b border-stone-700 flex items-center justify-between px-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="h-2 w-32 bg-stone-700 rounded-full"></div>
              </div>
              
              <div className="p-8 flex gap-8 h-full">
                {/* Sidebar */}
                <div className="w-16 flex flex-col items-center gap-6 pt-4 border-r border-stone-700/50 h-full">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-8 rounded-lg bg-stone-700/50 hover:bg-brand-500/50 transition-colors"></div>
                   ))}
                </div>
                
                {/* Main Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-6 w-48 bg-stone-600 rounded"></div>
                      <div className="h-3 w-32 bg-stone-700 rounded"></div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold">JD</div>
                  </div>
                  
                  <div className="h-px w-full bg-stone-700"></div>

                  <div className="space-y-3">
                     {[1,2,3].map(i => (
                       <motion.div 
                         key={i}
                         initial={{ x: 20, opacity: 0 }}
                         whileInView={{ x: 0, opacity: 1 }}
                         transition={{ delay: 0.8 + (i * 0.2) }}
                         className="p-4 rounded-lg bg-stone-700/30 border border-stone-700 hover:border-brand-500/50 transition-colors flex gap-4"
                       >
                         <div className="w-8 h-8 rounded bg-stone-600 shrink-0"></div>
                         <div className="flex-1 space-y-2">
                           <div className="h-3 w-3/4 bg-stone-600 rounded"></div>
                           <div className="h-2 w-1/2 bg-stone-700 rounded"></div>
                         </div>
                       </motion.div>
                     ))}
                  </div>
                </div>
              </div>
              
              {/* Floating notification */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
                className="absolute bottom-8 right-8 bg-brand-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                2 Risks Detected
              </motion.div>
            </div>
         </motion.div>
       </div>
    </section>
  );
};