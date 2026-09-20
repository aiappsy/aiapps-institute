"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  PlusCircle,
  X,
  Award,
  Lock,
  Check,
  AlertCircle,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { AppraisalReport, MarketplaceListing } from "@/lib/db/types";
import { formatCurrency, formatNumber, getGradeBadgeColor } from "@/lib/utils";

export default function MarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "discount" | "price_asc" | "price_desc" | "grade">("discount");

  // Dynamic state
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [appraisals, setAppraisals] = useState<AppraisalReport[]>([]);

  // Listing Wizard Modal State
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedAppraisalId, setSelectedAppraisalId] = useState<string>("");
  const [customAskingPrice, setCustomAskingPrice] = useState<number>(0);
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([
    "Complete Source Code & Git Repository",
    "Domain Name & DNS Configuration",
    "Architecture & Deployment Documentation",
    "30 Days Founder Transition Support",
  ]);
  const [isSubmittingListing, setIsSubmittingListing] = useState(false);
  const [listingSuccess, setListingSuccess] = useState<MarketplaceListing | null>(null);

  const refreshData = () => {
    setListings(store.getAllListings());
    setAppraisals(store.getAllAppraisals());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const openListingModal = () => {
    const allAppraisals = store.getAllAppraisals();
    setAppraisals(allAppraisals);
    if (allAppraisals.length > 0) {
      setSelectedAppraisalId(allAppraisals[0].id);
      setCustomAskingPrice(allAppraisals[0].valuationFairMarket);
    }
    setListingSuccess(null);
    setIsListModalOpen(true);
  };

  const handleSelectAppraisal = (apprId: string) => {
    setSelectedAppraisalId(apprId);
    const chosen = appraisals.find((a) => a.id === apprId);
    if (chosen) {
      setCustomAskingPrice(chosen.valuationFairMarket);
    }
  };

  const toggleInclusion = (item: string) => {
    if (selectedInclusions.includes(item)) {
      setSelectedInclusions(selectedInclusions.filter((i) => i !== item));
    } else {
      setSelectedInclusions([...selectedInclusions, item]);
    }
  };

  const handlePublishListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppraisalId) return;

    setIsSubmittingListing(true);
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appraisalId: selectedAppraisalId,
          askingPrice: Number(customAskingPrice),
          sellerName: "Paul Founder",
          sellerEmail: "founder@aiappsinstitute.com",
          includedAssets: selectedInclusions,
        }),
      });

      const data = await res.json();
      if (res.ok && data.listing) {
        setListingSuccess(data.listing);
        refreshData();
      }
    } catch (err) {
      console.error("Failed to publish listing:", err);
    } finally {
      setIsSubmittingListing(false);
    }
  };

  const selectedAppraisal = appraisals.find((a) => a.id === selectedAppraisalId);
  const escrowFee = Math.round(Number(customAskingPrice || 0) * 0.05);
  const netSellerPayout = Math.max(0, Number(customAskingPrice || 0) - escrowFee);

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

        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={openListingModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List App on Exchange (FREE)</span>
          </button>

          <Link
            href="/appraise"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all"
          >
            <span>Appraise New Codebase</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>

      {/* Trust & Guarantee Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Zero Unverified Listings</h4>
            <p className="text-[11px] text-slate-500">Every app is verified with Senior Dev Rebuild math and SHA-256 certs.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Flat 5% Closing Fee (0 Upfront)</h4>
            <p className="text-[11px] text-slate-500">Sellers save 10% compared to Flippa. Free listing included with appraisal.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">7-Day Technical Inspection</h4>
            <p className="text-[11px] text-slate-500">Buyer escrow funds held securely until code & domain transfer is verified.</p>
          </div>
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

                {/* Valuation Anchor Bar */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Seller Asking Price
                      </span>
                      <span className="text-lg font-black text-slate-900 font-serif">
                        {formatCurrency(listing.askingPrice)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Certified Fair Value
                      </span>
                      <span className="text-xs font-bold text-slate-700 font-serif">
                        {formatCurrency(listing.appraisedFairMarketValue)}
                      </span>
                    </div>
                  </div>

                  {/* Buyer Advantage Pill */}
                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    {isBelowValue ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        <span>Save {discountPct}% vs. Rebuild Cost</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">
                        ⚖️ Priced at Fair Market Value
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">5% Escrow Fee</span>
                  </div>
                </div>

                {/* Asset Inclusions Checklist */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Includes:</span>
                  <div className="flex flex-wrap gap-1">
                    {listing.includedAssets.slice(0, 3).map((asset, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                        <span className="truncate max-w-[150px]">{asset}</span>
                      </span>
                    ))}
                    {listing.includedAssets.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-medium">
                        +{listing.includedAssets.length - 3} more
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
                  <span>Enter Deal Room</span>
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
            No active exchange listings match your search criteria. Try adjusting your filters or list an app.
          </p>
          <button
            onClick={openListingModal}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold mt-2"
          >
            + List Your App (FREE)
          </button>
        </div>
      )}

      {/* 1-CLICK LISTING WIZARD MODAL */}
      {isListModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative my-8">
            <button
              onClick={() => setIsListModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {listingSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Your App is Now Live on the Exchange!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Listing <strong>{listingSuccess.title}</strong> has been published with 100% Free Listing status. Accredited buyers can now sign NDAs and enter the deal room.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsListModalOpen(false);
                      router.push(`/marketplace/${listingSuccess.id}`);
                    }}
                    className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow"
                  >
                    Go to Your Deal Room &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePublishListing} className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Zero Upfront Fees • Free Listing</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">List Your App on The Exchange</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select one of your certified applications, configure your financial terms, and publish to accredited buyers in 60 seconds.
                  </p>
                </div>

                {/* Step 1: Select Appraised Application */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    1. Select Certified App to List
                  </label>
                  {appraisals.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {appraisals.map((appr) => {
                        const isSelected = appr.id === selectedAppraisalId;
                        const gradeCol = getGradeBadgeColor(appr.grade);
                        return (
                          <div
                            key={appr.id}
                            onClick={() => handleSelectAppraisal(appr.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-serif font-black text-xs ${gradeCol.bg} ${gradeCol.text} border ${gradeCol.border}`}>
                                {appr.grade}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">{appr.projectName}</h5>
                                <p className="text-[11px] text-slate-500 line-clamp-1">{appr.tagline}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] text-slate-400 block uppercase">Certified Value</span>
                              <span className="text-xs font-bold text-slate-900 font-serif">
                                {formatCurrency(appr.valuationFairMarket)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                      <p>You do not have any appraised apps yet. All listings on the Exchange must have an accredited appraisal.</p>
                      <Link
                        href="/appraise"
                        className="inline-block px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold"
                      >
                        Start Free Appraisal (2 mins) &rarr;
                      </Link>
                    </div>
                  )}
                </div>

                {selectedAppraisal && (
                  <>
                    {/* Step 2: Asking Price & Financial Transparency */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-700 block">
                        2. Set Your Asking Price & Financial Terms
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] text-slate-500 block mb-1">Your Asking Price ($ USD)</span>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              min={1000}
                              step={500}
                              value={customAskingPrice}
                              onChange={(e) => setCustomAskingPrice(Number(e.target.value))}
                              className="w-full pl-7 pr-3 py-2 text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Certified Valuation</span>
                          <span className="text-sm font-black text-slate-800 font-serif">
                            {formatCurrency(selectedAppraisal.valuationFairMarket)}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            Grade {selectedAppraisal.grade} Certified
                          </span>
                        </div>
                      </div>

                      {/* Transparent Closing Economics Breakdown */}
                      <div className="bg-emerald-50/60 p-3.5 rounded-lg border border-emerald-200/60 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-700">
                          <span>Upfront Listing Fee:</span>
                          <span className="font-bold text-emerald-700">$0.00 (100% FREE)</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                          <span>Institute 5% Escrow Success Fee (Upon Sale Only):</span>
                          <span className="font-mono text-slate-600">-{formatCurrency(escrowFee)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-emerald-200 font-bold text-slate-900">
                          <span>Estimated Net Payout to Seller:</span>
                          <span className="text-sm font-serif text-emerald-800">{formatCurrency(netSellerPayout)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: What's Included in the Sale */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-700 block">
                        3. What is Included in the Sale? (Handoff Checklist)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "Complete Source Code & Git Repository",
                          "Domain Name & DNS Configuration",
                          "Architecture & Deployment Documentation",
                          "30 Days Founder Transition Support",
                          "Customer & User Database",
                          "Stripe / Merchant Account Setup",
                        ].map((item) => {
                          const isChecked = selectedInclusions.includes(item);
                          return (
                            <div
                              key={item}
                              onClick={() => toggleInclusion(item)}
                              className={`p-2 rounded-lg border cursor-pointer flex items-center gap-2 text-xs transition-colors ${
                                isChecked
                                  ? "bg-slate-50 border-slate-900 text-slate-900 font-medium"
                                  : "border-slate-200 text-slate-500 hover:border-slate-300"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                isChecked ? "bg-slate-900 border-slate-900 text-white" : "border-slate-300"
                              }`}>
                                {isChecked && <Check className="w-3 h-3" />}
                              </div>
                              <span className="text-[11px] leading-tight">{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsListModalOpen(false)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingListing || customAskingPrice <= 0}
                        className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow flex items-center gap-2"
                      >
                        {isSubmittingListing ? "Publishing..." : "Publish Live to Exchange Now (FREE)"}
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
