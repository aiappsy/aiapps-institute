"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  ExternalLink,
  Eye,
  DollarSign,
  TrendingUp,
  Tag,
  Filter,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { MarketplaceListing } from "@/lib/db/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<MarketplaceListing[]>(store.getAllListings());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const handleUpdateModeration = (
    id: string,
    newStatus: MarketplaceListing["moderationStatus"],
    isFeatured?: boolean
  ) => {
    store.updateListingModeration(id, newStatus, isFeatured);
    setListings([...store.getAllListings()]);
  };

  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    store.updateListingModeration(id, undefined, !currentFeatured);
    setListings([...store.getAllListings()]);
  };

  const filtered = listings.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.sellerName.toLowerCase().includes(search.toLowerCase()) ||
      l.sellerEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase());

    const currentModStatus = l.moderationStatus || "APPROVED";
    const matchesStatus =
      statusFilter === "ALL" || currentModStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalListings = listings.length;
  const approvedCount = listings.filter((l) => (l.moderationStatus || "APPROVED") === "APPROVED").length;
  const pendingCount = listings.filter((l) => l.moderationStatus === "PENDING_REVIEW").length;
  const flaggedCount = listings.filter((l) => l.moderationStatus === "FLAGGED" || l.moderationStatus === "DELISTED").length;

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900">Exchange Listings Moderation Desk</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review code submission listings, certify asking prices against certified appraisal valuations, and curate featured apps.
          </p>
        </div>

        {/* Quick Stat Pills */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
            {approvedCount} Approved
          </span>
          {pendingCount > 0 && (
            <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold">
              {pendingCount} Pending Review
            </span>
          )}
          {flaggedCount > 0 && (
            <span className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold">
              {flaggedCount} Flagged
            </span>
          )}
        </div>
      </div>

      {/* Controls Bar: Search & Status Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, seller, or tech stack..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {["ALL", "APPROVED", "PENDING_REVIEW", "FLAGGED", "DELISTED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                statusFilter === status
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Moderation Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Listing & Seller</th>
                <th className="px-5 py-3.5">Asking vs Appraised</th>
                <th className="px-5 py-3.5">Metrics</th>
                <th className="px-5 py-3.5">Moderation Status</th>
                <th className="px-5 py-3.5">Featured</th>
                <th className="px-5 py-3.5 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No listings match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const currentMod = item.moderationStatus || "APPROVED";
                  const priceDiscrepancy = Math.round(
                    ((item.askingPrice - item.appraisedFairMarketValue) / item.appraisedFairMarketValue) * 100
                  );
                  const isDiscount = priceDiscrepancy <= 0;
                  const isFeatured = !!item.isFeatured;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{item.title}</span>
                          <Link
                            href={`/marketplace/${item.id}`}
                            target="_blank"
                            className="text-slate-400 hover:text-blue-600"
                            title="Inspect Deal Room"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-medium text-slate-600">{item.sellerName}</span>
                          <span>•</span>
                          <span className="font-mono">{item.sellerEmail}</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 bg-slate-100 rounded text-[10px]">{item.category}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-black text-slate-900 font-serif text-sm">
                          {formatCurrency(item.askingPrice)}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span>FMV: {formatCurrency(item.appraisedFairMarketValue)}</span>
                          <span
                            className={`font-bold font-mono px-1 rounded text-[10px] ${
                              isDiscount ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
                            }`}
                          >
                            {isDiscount ? `${priceDiscrepancy}%` : `+${priceDiscrepancy}%`}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-[11px] font-medium text-slate-700">
                          {item.monthlyRevenue > 0 ? `${formatCurrency(item.monthlyRevenue)}/mo` : "$0 MRR"}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {formatNumber(item.monthlyUsers)} Users • {item.viewsCount} Views
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {currentMod === "APPROVED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> APPROVED
                          </span>
                        )}
                        {currentMod === "PENDING_REVIEW" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> PENDING
                          </span>
                        )}
                        {currentMod === "FLAGGED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <ShieldAlert className="w-3 h-3" /> FLAGGED
                          </span>
                        )}
                        {currentMod === "DELISTED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
                            <XCircle className="w-3 h-3" /> DELISTED
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleFeatured(item.id, isFeatured)}
                          className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] font-bold ${
                            isFeatured
                              ? "bg-amber-50 text-amber-700 border-amber-300 shadow-xs"
                              : "bg-white text-slate-400 border-slate-200 hover:text-slate-600"
                          }`}
                          title="Toggle featured banner on exchange homepage"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFeatured ? "fill-amber-400 text-amber-500" : ""}`} />
                          <span>{isFeatured ? "Featured" : "Standard"}</span>
                        </button>
                      </td>

                      <td className="px-5 py-4 text-right space-x-1.5">
                        {currentMod !== "APPROVED" && (
                          <button
                            onClick={() => handleUpdateModeration(item.id, "APPROVED")}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs"
                          >
                            Approve
                          </button>
                        )}
                        {currentMod !== "FLAGGED" && (
                          <button
                            onClick={() => handleUpdateModeration(item.id, "FLAGGED")}
                            className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold transition-all"
                          >
                            Flag
                          </button>
                        )}
                        {currentMod !== "DELISTED" && (
                          <button
                            onClick={() => handleUpdateModeration(item.id, "DELISTED")}
                            className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition-all"
                          >
                            Delist
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
