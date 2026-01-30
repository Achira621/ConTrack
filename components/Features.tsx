import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Layers, Lock, BarChart3, Globe, Zap, Users } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: "Unified Repository",
    description: "A single source of truth for every agreement, amendment, and addendum.",
    icon: Layers
  },
  {
    title: "Bank-Grade Security",
    description: "SOC2 Type II certified. Your data is encrypted at rest and in transit.",
    icon: Lock
  },
  {
    title: "Real-time Analytics",
    description: "Visualize exposure, renewal cliffs, and spending obligations instantly.",
    icon: BarChart3
  },
  {
    title: "Global Compliance",
    description: "Multi-jurisdictional support with automated regulatory updates.",
    icon: Globe
  },
  {
    title: "Smart Triggers",
    description: "Automate payments or notifications based on contract milestones.",
    icon: Zap
  },
  {
    title: "Collaborative Workspaces",
    description: "Negotiate in real-time with internal stakeholders and external counsel.",
    icon: Users
  }
];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-stone-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-stone-100 group"
    >
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm text-stone-600 group-hover:text-brand-600 group-hover:scale-110 transition-all duration-300">
        <feature.icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-stone-900 mb-3">{feature.title}</h3>
      <p className="text-stone-500 leading-relaxed text-sm">{feature.description}</p>
    </motion.div>
  );
};

export const Features: React.FC = () => {
  return (
    <section id="platform" className="py-32 px-6 bg-warm-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="font-serif text-4xl text-stone-900 mb-6">Engineered for control</h2>
          <p className="text-stone-500 text-lg">
            Every feature is designed to reduce friction and increase visibility across your contract lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};