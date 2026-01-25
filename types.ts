// Frontend Types for ConTrack Platform
import React from 'react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXISTING TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NEW: AUTH & RBAC TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type UserRole = 'CLIENT' | 'VENDOR' | 'INVESTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTRACT TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ContractStatus = 'DRAFT' | 'ACTIVE' | 'IN_VERIFICATION' | 'SETTLED' | 'DISPUTED' | 'CANCELLED';

export interface Contract {
  id: string;
  title: string;
  description?: string;
  value: number;
  status: ContractStatus;
  clientId: string;
  vendorId?: string;
  createdAt: string;
  settledAt?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INVESTOR POOL TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type PoolRiskCategory = 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'SECTORAL';

export interface Pool {
  id: string;
  name: string;
  description?: string;
  riskCategory: PoolRiskCategory;
  totalCapital: number;
  lockedCapital: number;
  availableCapital: number;
  currentNAV: number;
  totalUnits: number;
}

export interface PoolUnit {
  id: string;
  poolId: string;
  investorId: string;
  units: number;
  purchaseNAV: number;
  purchaseAmount: number;
  createdAt: string;
}

export interface PoolPerformance {
  poolId: string;
  navHistory: { timestamp: string; nav: number }[];
  totalReturn: number;
  returnPercentage: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAYMENT TRACKING TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export interface PaymentSchedule {
  id: string;
  contractId: string;
  milestoneName: string;
  description?: string;
  amount: number;
  percentage: number;
  dueDate?: string;
  order: number;
  createdAt: string;
}

export interface Payment {
  id: string;
  contractId: string;
  scheduleId?: string;
  amount: number;
  status: PaymentStatus;
  payerId: string;
  payeeId: string;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentProgress {
  totalAmount: number;
  totalPaid: number;
  remainingAmount: number;
  percentageComplete: number;
  upcomingPayments: PaymentSchedule[];
  completedPayments: Payment[];
}

export interface PaymentMilestone {
  name: string;
  description?: string;
  percentage: number;
  dueDate?: Date;
}