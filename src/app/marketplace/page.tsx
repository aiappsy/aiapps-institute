"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Tag,
  DollarSign,
  Users,
  Code2,
  CheckCircle2,
  ArrowUpDown,
  Zap,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { formatCurrency, formatNumber, getGradeBadgeColor } from "@/lib/utils";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "discount" | "price_asc" | "price_desc" | "grade">("discount");

  const listings = store.getAllListings();

  const filteredAndSorted = useMemo(() => {
    let result = listings.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesStage = selectedStage === "All" || item.stage === selectedStage;

      return matchesSearch && matchesCategory && matchesStage;
    });

    result.sort((a, b) => {
      if (sortBy === "discount") {
        const discountA = (a.appraisedFairMarketValue - a.askingPrice) / a.appraisedFairMarketValue;
        const discountB = (b.appraisedFairMarketValue - b.askingPrice) / b.appraisedFairMarketValue;
        return discountB - discountA; // Highest discount first
      }
      if (sortBy === "price_asc") return a.askingPrice - b.askingPrice;
      if (sortBy === "price_desc") return b.askingPrice - a.askingPrice;
      if (sortBy === "grade") {
        const gradeRank: Record<string, number> = { AAA: 5, 'AA+': 4, AA: 3, 'A+': 2, A: 1, BBB: 0 };
        return (gradeRank[b.appraisedGrade] || 0) - (gradeRank[a.appraisedGrade] || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [listings, searchQuery, selectedCategory, selectedStage, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pre-Audited Software Exchange • 100% Certified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            The AIApps Exchange
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The curated software marketplace where <strong>every asset is backed by an official AIApps Institute Appraisal</strong>. Browse audited codebases, verified replacement costs, and clear Fair Market Benchmarks.
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
          <Link
            href="/appraise"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all"
          >
            <span>Get Appraised & List (FREE)</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </Link>
          <span className="text-[11px] text-slate-400">
            Free listing included with every appraisal report
          </span>
        </div>
      </div>

      {/* Filters, Search & Sorting Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps, tech stacks, keywords..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="AI / Machine Learning">AI / Machine Learning</option>
            <option value="Developer Tool">Developer Tool</option>
            <option value="Mobile App">Mobile App</option>
            <option value="SaaS">SaaS</option>
          </select>

          {/* Stage Dropdown */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-700"
          >
            <option value="All">All Maturity Stages</option>
            <option value="mvp">Working MVP ($0 MRR)</option>
            <option value="early-traction">Early Traction (&lt;$5k MRR)</option>
            <option value="cash-flow">Cash Flowing ($5k+ MRR)</option>
          </select>

          {/* Sort By Dropdown (Bargain Hunter) */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-700 font-semibold"
            >
              <option value="discount">🔥 Greatest Discount vs. Appraisal</option>
              <option value="featured">✨ Newest / Featured</option>
              <option value="grade">🏛️ Highest Accreditation Grade</option>
              <option value="price_asc">💵 Price: Low to High</option>
              <option value="price_desc">💎 Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSorted.map((listing) => {
          const colors = getGradeBadgeColor(listing.appraisedGrade);
          const isBelowValue = listing.askingPrice < listing.appraisedFairMarketValue;
          const discountPct = Math.round(
            ((listing.appraisedFairMarketValue - listing.askingPrice) / listing.appraisedFairMarketValue) * 100
          );

          return (
            <div
              key={listing.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {listing.category} • {listing.stage.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5 line-clamp-1">
                      {listing.title}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-black font-serif ${colors.bg} ${colors.text} ${colors.border} shrink-0`}>
                    Grade {listing.appraisedGrade}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {listing.tagline}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {listing.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600"
                    >
                      {tech}
                    </span>
                  ))}
                  {listing.techStack.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                      +{listing.techStack.length - 4}
                    </span>
                  )}
                </div>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-100 text-xs text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Revenue</span>
                    <span className="font-bold text-slate-900 font-serif">
                      {listing.monthlyRevenue > 0 ? `${formatCurrency(listing.monthlyRevenue)}/mo` : "$0 (MVP)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Users</span>
                    <span className="font-bold text-slate-900">
                      {formatNumber(listing.monthlyUsers)} Users
                    </span>
                  </div>
                </div>

                {/* Price & Certified Valuation Benchmark */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Asking Price
                    </span>
                    <span className="text-lg font-black text-slate-900 font-serif">
                      {formatCurrency(listing.askingPrice)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Appraised Fair Value
                    </span>
                    <span className="text-xs font-bold text-slate-700 font-serif">
                      {formatCurrency(listing.appraisedFairMarketValue)}
                    </span>
                    {isBelowValue && (
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        Save {discountPct}% vs. Appraisal
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer / Deal Room CTA */}
              <div className="bg-slate-50/70 p-3 px-6 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{listing.verifiedCertificateId}</span>
                </div>

                <Link
                  href={`/marketplace/${listing.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Enter Room</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAndSorted.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Listings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active exchange listings match your search criteria. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
