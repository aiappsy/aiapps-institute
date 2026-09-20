"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Shield,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { TransactionRecord } from "@/lib/db/types";
import { formatCurrency } from "@/lib/utils";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(store.getAllTransactions());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const handleUpdateStatus = (
    id: string,
    newStatus: TransactionRecord["status"],
    notes?: string
  ) => {
    store.updateTransactionStatus(id, newStatus, notes);
    setTransactions([...store.getAllTransactions()]);
  };

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.listingTitle.toLowerCase().includes(search.toLowerCase()) ||
      t.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      t.sellerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalGrossVolume = transactions.reduce((acc, curr) => acc + curr.grossAmount, 0);
  const totalPlatformFees = transactions.reduce((acc, curr) => acc + curr.platformFeeAmount, 0);
  const totalDisbursed = transactions
    .filter((t) => t.status === "PAYOUT_RELEASED")
    .reduce((acc, curr) => acc + curr.netSellerPayout, 0);
  const activeEscrowVolume = transactions
    .filter((t) => t.status === "IN_ESCROW" || t.status === "INSPECTION_PERIOD")
    .reduce((acc, curr) => acc + curr.grossAmount, 0);

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900">
              Escrow & Fee Reconciliation Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time custody tracking, 5% Institute closing fee accounting, 7-day technical inspection windows, and automated seller disbursements.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Vault Custody
          </span>
          <div className="text-2xl font-black text-slate-900 font-serif mt-1">
            {formatCurrency(activeEscrowVolume)}
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SafeHarbor™ Protected</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Platform Take-Rate (5%)
          </span>
          <div className="text-2xl font-black text-purple-700 font-serif mt-1">
            {formatCurrency(totalPlatformFees)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Net Institute Closing Revenue
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Disbursed to Sellers
          </span>
          <div className="text-2xl font-black text-slate-900 font-serif mt-1">
            {formatCurrency(totalDisbursed)}
          </div>
          <span className="text-xs text-emerald-600 mt-1 block">
            Clean Technical Handover
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Transacted GMV
          </span>
          <div className="text-2xl font-black text-slate-900 font-serif mt-1">
            {formatCurrency(totalGrossVolume)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Across {transactions.length} Escrow Deals
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deal ID, asset, or party..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {["ALL", "IN_ESCROW", "INSPECTION_PERIOD", "PAYOUT_RELEASED", "DISPUTED"].map((status) => (
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

      {/* Transactions Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Deal & Asset</th>
                <th className="px-5 py-3.5">Buyer & Seller</th>
                <th className="px-5 py-3.5">Financial Split</th>
                <th className="px-5 py-3.5">Phase & Status</th>
                <th className="px-5 py-3.5">Inspection Window</th>
                <th className="px-5 py-3.5 text-right">Escrow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No transactions match current query.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {tx.id}
                        </div>
                        <div className="font-semibold text-slate-800 mt-0.5 max-w-xs truncate">
                          <Link
                            href={`/marketplace/${tx.listingId}`}
                            target="_blank"
                            className="hover:text-blue-600 inline-flex items-center gap-1"
                          >
                            <span>{tx.listingTitle}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block mt-0.5">
                          Method: {tx.paymentMethod.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Buyer:</span>
                          <span className="font-semibold text-slate-900">{tx.buyerName}</span>
                        </div>
                        <div className="mt-1.5">
                          <span className="text-[10px] text-slate-400 block uppercase">Seller:</span>
                          <span className="font-medium text-slate-700">{tx.sellerName}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-black text-slate-900 font-serif text-sm">
                          Gross: {formatCurrency(tx.grossAmount)}
                        </div>
                        <div className="text-[11px] text-purple-700 font-bold font-mono">
                          Fee (5%): +{formatCurrency(tx.platformFeeAmount)}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-bold font-mono">
                          Seller Net: {formatCurrency(tx.netSellerPayout)}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 uppercase font-mono">
                            Phase {tx.escrowPhase}/4
                          </span>
                        </div>
                        {tx.status === "IN_ESCROW" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            <Clock className="w-3 h-3 text-blue-600 animate-spin" /> IN ESCROW
                          </span>
                        )}
                        {tx.status === "INSPECTION_PERIOD" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600 animate-pulse" /> INSPECTION
                          </span>
                        )}
                        {tx.status === "PAYOUT_RELEASED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> DISBURSED
                          </span>
                        )}
                        {tx.status === "DISPUTED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            <ShieldAlert className="w-3 h-3 text-rose-600" /> DISPUTED
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-[11px] font-mono text-slate-700 block">
                          {new Date(tx.inspectionDeadline).toLocaleDateString()}
                        </span>
                        {tx.notes && (
                          <span className="text-[10px] text-slate-400 max-w-xs block truncate mt-0.5" title={tx.notes}>
                            {tx.notes}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right space-y-1">
                        {tx.status !== "PAYOUT_RELEASED" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                tx.id,
                                "PAYOUT_RELEASED",
                                "Administrative release executed via Institute Console"
                              )
                            }
                            className="w-full px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs block"
                          >
                            Disburse 95%
                          </button>
                        )}
                        {tx.status !== "DISPUTED" && tx.status !== "PAYOUT_RELEASED" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                tx.id,
                                "DISPUTED",
                                "SafeHarbor inspection paused pending code audit"
                              )
                            }
                            className="w-full px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold transition-all block"
                          >
                            Pause / Audit
                          </button>
                        )}
                        {tx.status === "DISPUTED" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                tx.id,
                                "INSPECTION_PERIOD",
                                "SafeHarbor dispute resolved, inspection resumed"
                              )
                            }
                            className="w-full px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold transition-all block"
                          >
                            Resume Deal
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
