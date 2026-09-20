"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  DollarSign,
  Award,
  Filter,
  UserCheck,
  Building,
  Mail,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { UserProfile } from "@/lib/db/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>(store.getAllUsers());
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const handleToggleAccreditation = (id: string, current: boolean) => {
    store.updateUser(id, { isAccreditedBuyer: !current });
    setUsers([...store.getAllUsers()]);
  };

  const handleToggleKyc = (id: string, current: boolean) => {
    store.updateUser(id, { isKycVerified: !current });
    setUsers([...store.getAllUsers()]);
  };

  const handleToggleStatus = (id: string, currentStatus: "ACTIVE" | "SUSPENDED" = "ACTIVE") => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    store.updateUser(id, { status: newStatus });
    setUsers([...store.getAllUsers()]);
  };

  const handleAddCredits = (id: string, amount: number) => {
    store.updateUserCredits(amount, id);
    setUsers([...store.getAllUsers()]);
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.organization && u.organization.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "ALL" || u.activeRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const accreditedCount = users.filter((u) => u.isAccreditedBuyer).length;
  const totalCredits = users.reduce((acc, curr) => acc + curr.appraisalCredits, 0);

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900">
              User Directory & Accreditation Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage registered founders, institutional buyers, and brokers. Certify Accredited Buyer status for private code manifest access.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Members Registered
          </span>
          <div className="text-2xl font-black text-slate-900 font-serif mt-1">
            {totalUsers} Accounts
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Founders, Buyers & M&A Brokers
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Accredited Institutional Buyers
          </span>
          <div className="text-2xl font-black text-emerald-700 font-serif mt-1">
            {accreditedCount} Verified
          </div>
          <span className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Eligible for SafeHarbor™ Escrow</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Outstanding Appraisal Credits
          </span>
          <div className="text-2xl font-black text-blue-700 font-serif mt-1">
            {totalCredits} Credits
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Across active member wallets
          </span>
        </div>
      </div>

      {/* Search and Role Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or org..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Role:
          </span>
          {["ALL", "SELLER", "BUYER", "BROKER", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                roleFilter === role
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {role === "SELLER" ? "Founders / Sellers" : role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Member & Organization</th>
                <th className="px-5 py-3.5">Active Role</th>
                <th className="px-5 py-3.5">Accreditation & KYC</th>
                <th className="px-5 py-3.5">Appraisal Credits</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No members match search query.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const isAccredited = !!user.isAccreditedBuyer;
                  const isKyc = !!user.isKycVerified;
                  const isSuspended = user.status === "SUSPENDED";

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{user.displayName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                          <span>{user.email}</span>
                          {user.organization && (
                            <>
                              <span>•</span>
                              <span className="font-sans text-slate-600 font-medium flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {user.organization}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            user.activeRole === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : user.activeRole === "BUYER"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {user.activeRole}
                        </span>
                      </td>

                      <td className="px-5 py-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleAccreditation(user.id, isAccredited)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 ${
                              isAccredited
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700"
                            }`}
                          >
                            <ShieldCheck className={`w-3 h-3 ${isAccredited ? "text-emerald-600" : ""}`} />
                            <span>{isAccredited ? "Accredited Buyer" : "Standard Tier"}</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <span>KYC:</span>
                          <button
                            onClick={() => handleToggleKyc(user.id, isKyc)}
                            className={`font-semibold hover:underline ${isKyc ? "text-emerald-700" : "text-amber-700"}`}
                          >
                            {isKyc ? "✓ Verified" : "Pending"}
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm font-serif">
                            {user.appraisalCredits}
                          </span>
                          <button
                            onClick={() => handleAddCredits(user.id, 1)}
                            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-300 flex items-center gap-0.5"
                            title="Grant 1 Appraisal Credit"
                          >
                            <Plus className="w-2.5 h-2.5" /> 1
                          </button>
                          <button
                            onClick={() => handleAddCredits(user.id, 5)}
                            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-300 flex items-center gap-0.5"
                            title="Grant 5 Appraisal Credits"
                          >
                            <Plus className="w-2.5 h-2.5" /> 5
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" /> SUSPENDED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> ACTIVE
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                            isSuspended
                              ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {isSuspended ? "Reactivate" : "Suspend"}
                        </button>
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
