"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
  Users,
  Key,
  Sliders,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function AdminDashboardPage() {
  const appraisals = store.getAllAppraisals();
  const listings = store.getAllListings();
  const ndas = store.getAllNDAs();
  const transactions = store.getAllTransactions();
  const users = store.getAllUsers();

  const totalAppraisedGMV = appraisals.reduce((acc, curr) => acc + curr.valuationFairMarket, 0);
  const totalMarketplaceVolume = listings.reduce((acc, curr) => acc + curr.askingPrice, 0);
  const activeEscrowVault = transactions
    .filter((t) => t.status === "IN_ESCROW" || t.status === "INSPECTION_PERIOD")
    .reduce((acc, curr) => acc + curr.grossAmount, 0);
  const totalFeesEarned = transactions.reduce((acc, curr) => acc + curr.platformFeeAmount, 0);
  const accreditedBuyersCount = users.filter((u) => u.isAccreditedBuyer).length;
  const pendingModerationCount = listings.filter((l) => l.moderationStatus === "PENDING_REVIEW").length;

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Institutional Governance & Operations Console</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Operational
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Unified management of appraisal volume, deal room escrow pipelines, listing moderation, accredited buyer verification, and economic math.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/listings"
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Moderate Listings</span>
          </Link>
          <Link
            href="/admin/transactions"
            className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Escrow Vault</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Appraised Asset GMV
          </span>
          <div className="text-2xl font-black text-slate-900 font-serif mt-1">
            {formatCurrency(totalAppraisedGMV)}
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{appraisals.length} Certified Reports</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Escrow In Custody
          </span>
          <div className="text-2xl font-black text-blue-900 font-serif mt-1">
            {formatCurrency(activeEscrowVault)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Across {transactions.length} Escrow Deals
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Platform Closing Fees (5%)
          </span>
          <div className="text-2xl font-black text-purple-700 font-serif mt-1">
            {formatCurrency(totalFeesEarned)}
          </div>
          <span className="text-xs text-purple-600 mt-1 block font-medium">
            Take-rate revenue collected
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Accredited Institutional Buyers
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {accreditedBuyersCount} Verified
          </div>
          <span className="text-xs text-emerald-600 mt-1 block">
            {users.length} Total Platform Members
          </span>
        </div>
      </div>

      {/* Operational Modules Launchpad */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Operational Management Suites
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/listings"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle hover:border-slate-400 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Listings Moderation Desk &rarr;
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review code listings, verify seller asking prices against certified appraisal valuations, and feature standout software assets.
            </p>
          </Link>

          <Link
            href="/admin/transactions"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle hover:border-slate-400 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Escrow & Fee Reconciliation &rarr;
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track 4-phase custody milestones, 5% Institute take-rate accounting, 7-day inspection windows, and release disbursements.
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle hover:border-slate-400 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Users & Accreditation &rarr;
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Manage member accounts, certify Accredited Institutional Buyers for repository inspection, grant appraisal credits, and enforce bans.
            </p>
          </Link>

          <Link
            href="/admin/registry"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle hover:border-slate-400 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Master Certificate Registry &rarr;
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Oversee cryptographic SHA-256 certificate hashes, re-certify valid valuations, or revoke compromised accreditations.
            </p>
          </Link>

          <Link
            href="/admin/parameters"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle hover:border-slate-400 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
              Valuation Parameters Math &rarr;
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calibrate senior hourly dev rates ($110/hr), category multipliers (AI/DevTools), ARR ceilings, and CAC user replacement rates.
            </p>
          </Link>

          <Link
            href="/admin/integrations"
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle hover:border-slate-400 transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
              Master API Credentials Vault &rarr;
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Configure Google Gemini 3.8 Flash, Google Search Grounding, Firebase Firestore, Stripe, and PayPal REST API credentials.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
