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
} from "lucide-react";
import { store } from "@/lib/db/store";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function AdminDashboardPage() {
  const appraisals = store.getAllAppraisals();
  const listings = store.getAllListings();
  const ndas = store.getAllNDAs();

  const totalAppraisedGMV = appraisals.reduce((acc, curr) => acc + curr.valuationFairMarket, 0);
  const totalMarketplaceVolume = listings.reduce((acc, curr) => acc + curr.askingPrice, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Institutional Governance Console</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Operational
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Monitor real-time appraisal volume, platform fee take-rate, cryptographic certificate validity, and master API connections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/integrations"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Manage API Keys</span>
          </Link>
          <Link
            href="/admin/parameters"
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Algorithm Math</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
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
            <span>{appraisals.length} Verified Reports</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Exchange Asking Volume
          </span>
          <div className="text-2xl font-black text-slate-900 font-serif mt-1">
            {formatCurrency(totalMarketplaceVolume)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Across {listings.length} Active Listings
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Executed Mutual NDAs
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {ndas.length} Signed
          </div>
          <span className="text-xs text-blue-600 mt-1 block">
            Cryptographic Tamper-Proof
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Platform Take-Rate (5%)
          </span>
          <div className="text-2xl font-black text-purple-700 font-serif mt-1">
            {formatCurrency(totalMarketplaceVolume * 0.05)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Estimated Commission Potential
          </span>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/integrations"
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle hover:border-slate-400 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
            API Keys & Integrations &rarr;
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure Google Gemini 1.5, Firebase Firestore, Stripe Payment Element, and PayPal REST API credentials.
          </p>
        </Link>

        <Link
          href="/admin/parameters"
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle hover:border-slate-400 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Valuation Parameters &rarr;
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Calibrate senior hourly dev rates ($110/hr), category multipliers, ARR ceilings, and CAC user replacement rates.
          </p>
        </Link>

        <Link
          href="/admin/registry"
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle hover:border-slate-400 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            Master Certificate Registry &rarr;
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Oversee, re-certify, or revoke SHA-256 certificate hashes and public verification endpoints.
          </p>
        </Link>
      </div>
    </div>
  );
}
