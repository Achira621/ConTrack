import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, CheckCircle } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import type { User, PaymentMilestone } from '../types';

interface ContractCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (contract: any) => void;
    user: User;
}

export const ContractCreationModal: React.FC<ContractCreationModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    user,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        clientEmail: user.role === 'CLIENT' ? user.email : '',
        vendorEmail: user.role === 'VENDOR' ? user.email : '',
        value: '',
        startDate: '',
        endDate: '',
        enableMilestones: false,
    });

    const [milestones, setMilestones] = useState<PaymentMilestone[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleToggleMilestones = () => {
        setFormData(prev => ({ ...prev, enableMilestones: !prev.enableMilestones }));
        if (!formData.enableMilestones && milestones.length === 0) {
            // Add default milestone
            addMilestone();
        }
    };

    const addMilestone = () => {
        setMilestones(prev => [
            ...prev,
            { name: '', description: '', percentage: 0, dueDate: undefined },
        ]);
    };

    const removeMilestone = (index: number) => {
        setMilestones(prev => prev.filter((_, i) => i !== index));
    };

    const updateMilestone = (index: number, field: keyof PaymentMilestone, value: any) => {
        setMilestones(prev =>
            prev.map((m, i) =>
                i === index ? { ...m, [field]: value } : m
            )
        );
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = 'Contract title is required';
        if (formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
        if (!formData.clientEmail.trim()) newErrors.clientEmail = 'Client email is required';
        if (!formData.vendorEmail.trim()) newErrors.vendorEmail = 'Vendor email is required';
        if (!formData.value || parseFloat(formData.value) <= 0) {
            newErrors.value = 'Contract value must be greater than 0';
        }

        if (formData.enableMilestones) {
            const totalPercentage = milestones.reduce((sum, m) => sum + (m.percentage || 0), 0);
            if (milestones.length === 0) {
                newErrors.milestones = 'Add at least one milestone';
            } else if (totalPercentage !== 100) {
                newErrors.milestones = `Total percentage must be 100% (currently ${totalPercentage}%)`;
            }

            milestones.forEach((m, i) => {
                if (!m.name.trim()) newErrors[`milestone_${i}_name`] = 'Milestone name required';
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            // Scroll to first error
            const firstError = document.querySelector('.error-message');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const contract = {
            ...formData,
            value: parseFloat(formData.value),
            milestones: formData.enableMilestones ? milestones : [],
        };

        onSubmit(contract);

        // Success animation
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onClose();
            // Reset form
            setFormData({
                title: '',
                description: '',
                clientEmail: user.role === 'CLIENT' ? user.email : '',
                vendorEmail: user.role === 'VENDOR' ? user.email : '',
                value: '',
                startDate: '',
                endDate: '',
                enableMilestones: false,
            });
            setMilestones([]);
            setErrors({});
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Success Overlay */}
                        <AnimatePresence>
                            {showSuccess && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                    >
                                        <CheckCircle className="w-20 h-20 text-emerald-500" />
                                    </motion.div>
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="mt-4 text-xl font-serif text-stone-900"
                                    >
                                        Contract Created Successfully
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header */}
                        <div className="bg-white border-b border-stone-200 px-8 py-6 flex justify-between items-start">
                            <div>
                                <h2 className="font-serif text-4xl text-stone-900 mb-2">
                                    Create New Contract
                                </h2>
                                <p className="text-stone-500 text-lg">
                                    Transform your agreement into action
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-stone-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)] px-8 py-6">
                            <div className="space-y-8">
                                {/* Contract Details */}
                                <section>
                                    <h3 className="text-xl font-semibold text-stone-900 mb-4">Contract Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Contract Title *
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="Website Redesign Project"
                                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                                            />
                                            {errors.title && (
                                                <p className="error-message mt-1 text-sm text-stone-600">{errors.title}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                placeholder="Describe the scope of work..."
                                                rows={3}
                                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Parties */}
                                <section>
                                    <h3 className="text-xl font-semibold text-stone-900 mb-4">Parties</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Client Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="clientEmail"
                                                value={formData.clientEmail}
                                                onChange={handleInputChange}
                                                placeholder="client@example.com"
                                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                                            />
                                            {errors.clientEmail && (
                                                <p className="error-message mt-1 text-sm text-stone-600">{errors.clientEmail}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Vendor Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="vendorEmail"
                                                value={formData.vendorEmail}
                                                onChange={handleInputChange}
                                                placeholder="vendor@example.com"
                                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                                            />
                                            {errors.vendorEmail && (
                                                <p className="error-message mt-1 text-sm text-stone-600">{errors.vendorEmail}</p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Financial Terms */}
                                <section>
                                    <h3 className="text-xl font-semibold text-stone-900 mb-4">Financial Terms</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                                Contract Value ($) *
                                            </label>
                                            <input
                                                type="number"
                                                name="value"
                                                value={formData.value}
                                                onChange={handleInputChange}
                                                placeholder="15000"
                                                min="0"
                                                step="0.01"
                                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                                            />
                                            {errors.value && (
                                                <p className="error-message mt-1 text-sm text-stone-600">{errors.value}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="endDate"
                                                    value={formData.endDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Milestone Toggle */}
                                        <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg border border-stone-200">
                                            <input
                                                type="checkbox"
                                                id="enableMilestones"
                                                checked={formData.enableMilestones}
                                                onChange={handleToggleMilestones}
                                                className="w-5 h-5 text-brand-600 focus:ring-brand-500 rounded"
                                            />
                                            <label htmlFor="enableMilestones" className="text-sm font-medium text-stone-900 cursor-pointer">
                                                Enable Milestone-Based Payments
                                            </label>
                                        </div>

                                        {/* Milestones */}
                                        {formData.enableMilestones && (
                                            <div className="space-y-4 pt-4 border-t border-stone-200">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-semibold text-stone-900">Payment Milestones</h4>
                                                    <button
                                                        type="button"
                                                        onClick={addMilestone}
                                                        className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-sm font-medium text-stone-700 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Add Milestone
                                                    </button>
                                                </div>

                                                {errors.milestones && (
                                                    <p className="error-message text-sm text-stone-600">{errors.milestones}</p>
                                                )}

                                                <div className="space-y-3">
                                                    {milestones.map((milestone, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-4 bg-white border border-stone-200 rounded-lg space-y-3"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <p className="text-sm font-medium text-stone-500">
                                                                    Milestone {index + 1}
                                                                </p>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeMilestone(index)}
                                                                    className="p-1 hover:bg-stone-100 rounded transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-stone-400" />
                                                                </button>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Milestone Name"
                                                                        value={milestone.name}
                                                                        onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                                                                        className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                                                                    />
                                                                    {errors[`milestone_${index}_name`] && (
                                                                        <p className="error-message mt-1 text-xs text-stone-600">
                                                                            {errors[`milestone_${index}_name`]}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Percentage %"
                                                                        value={milestone.percentage || ''}
                                                                        onChange={(e) => updateMilestone(index, 'percentage', parseFloat(e.target.value) || 0)}
                                                                        min="0"
                                                                        max="100"
                                                                        className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <textarea
                                                                placeholder="Description (optional)"
                                                                value={milestone.description || ''}
                                                                onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                                                                rows={2}
                                                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm resize-none"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                {milestones.length > 0 && (
                                                    <div className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                                                        <span className="text-sm font-medium text-stone-700">Total Percentage:</span>
                                                        <span className={`text-sm font-bold ${milestones.reduce((sum, m) => sum + (m.percentage || 0), 0) === 100 ? 'text-emerald-600' : 'text-orange-600'}`}>
                                                            {milestones.reduce((sum, m) => sum + (m.percentage || 0), 0)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </form>

                        {/* Footer Actions */}
                        <div className="bg-stone-50 border-t border-stone-200 px-8 py-6 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-3 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <MagneticButton onClick={handleSubmit} className="px-8 py-3">
                                Create Contract →
                            </MagneticButton>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
