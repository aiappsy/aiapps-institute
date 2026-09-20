"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCircle,
  Award,
  ShoppingBag,
  Briefcase,
  ShieldCheck,
  CreditCard,
  FileText,
  ExternalLink,
  DollarSign,
  Copy,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Settings,
  Bell,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { AppraisalReport, MarketplaceListing, MarketplaceOffer, SignedNDA, UserProfile } from "@/lib/db/types";
import { formatCurrency, formatNumber, getGradeBadgeColor } from "@/lib/utils";

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile>(store.getCurrentUser());
  const [activeTab, setActiveTab] = useState<"appraisals" | "seller" | "buyer" | "payouts">("appraisals");
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null);

  const appraisals = store.getAllAppraisals();
  const listings = store.getAllListings();
  const ndas = store.getAllNDAs();

  // Filter listings for this user
  const userListings = listings.filter((l) => l.sellerEmail === user.email);

  // Offers on user's listings
  const incomingOffers = listings.flatMap((l) => store.getOffersForListing(l.id));

  // Payout state
  const [payoutEmail, setPayoutEmail] = useState(user.payoutMethod?.accountEmail || user.email);
  const [payoutType, setPayoutType] = useState<"stripe_connect" | "paypal">(user.payoutMethod?.type || "stripe_connect");
  const [payoutSaved, setPayoutSaved] = useState(false);

  const handleSavePayout = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = store.updateUserProfile({
      payoutMethod: {
        type: payoutType,
        accountEmail: payoutEmail,
        status: "ACTIVE",
      },
    });
    setUser(updated);
    setPayoutSaved(true);
    setTimeout(() => setPayoutSaved(false), 2500);
  };

  const copyEmbedBadge = (appr: AppraisalReport) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://aiappsinstitute.com";
    const badgeCode = `<!-- AIApps Institute Accreditation Badge -->
<a href="${origin}/verify/${appr.certificate.certificateId}" target="_blank" rel="noopener noreferrer">
  <img src="${origin}/api/badge/${appr.certificate.certificateId}" alt="Verified Grade ${appr.grade} by AIApps Institute" />
</a>`;
    navigator.clipboard.writeText(badgeCode);
    setCopiedBadge(appr.id);
    setTimeout(() => setCopiedBadge(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-amber-400 font-serif font-black text-xl flex items-center justify-center border-2 border-slate-800 shadow-sm">
            {user.displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user.displayName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {user.organization || "Independent Founder"}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Appraisal Credits</span>
            <span className="text-xl font-black text-emerald-700 font-serif">{user.appraisalCredits} Available</span>
          </div>
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all"
          >
            + Buy Credits
          </Link>
        </div>
      </div>

      {/* Role Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-sm font-medium space-x-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("appraisals")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "appraisals"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Appraisals & Certificates ({appraisals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("seller")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "seller"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <span>Seller Command Center ({userListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("buyer")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "buyer"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Briefcase className="w-4 h-4 text-blue-600" />
          <span>Buyer Deal Hub ({ndas.length} NDAs)</span>
        </button>

        <button
          onClick={() => setActiveTab("payouts")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "payouts"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CreditCard className="w-4 h-4 text-purple-600" />
          <span>Payouts (Stripe / PayPal)</span>
        </button>
      </div>

      {/* TAB 1: Appraisals & Certificates */}
      {activeTab === "appraisals" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Accredited Appraisal Portfolio</h2>
              <p className="text-xs text-slate-500">
                Official certificates, downloadable dossiers, and embeddable verification badges for your pitch deck and site.
              </p>
            </div>
            <Link
              href="/appraise"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold shadow hover:bg-slate-800"
            >
              <span>+ New Appraisal</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appraisals.map((appr) => {
              const colors = getGradeBadgeColor(appr.grade);
              return (
                <div
                  key={appr.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{appr.projectName}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{appr.tagline}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded border text-xs font-black font-serif ${colors.bg} ${colors.text} ${colors.border}`}>
                        Grade {appr.grade}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">Fair Market Value</span>
                        <span className="font-black text-slate-900 font-serif block">{formatCurrency(appr.valuationFairMarket)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">Rebuild Floor</span>
                        <span className="font-bold text-slate-700 font-serif block">{formatCurrency(appr.valuationBreakdown.costToRebuild.totalRebuildCost)}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1">
                      <span>Cert ID: {appr.certificate.certificateId}</span>
                      <span className="text-emerald-700 font-semibold">{appr.certificate.status}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/reports/${appr.id}`}
                      className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs"
                    >
                      View Dossier
                    </Link>

                    <button
                      onClick={() => copyEmbedBadge(appr)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      {copiedBadge === appr.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBadge === appr.id ? "Badge HTML Copied!" : "Embed Badge"}</span>
                    </button>

                    <Link
                      href={appr.certificate.verificationUrl}
                      className="p-1.5 text-slate-400 hover:text-slate-600"
                      title="Open Public Verification"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Seller Portal */}
      {activeTab === "seller" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Seller Deal Room & Listings</h2>
              <p className="text-xs text-slate-500">
                Manage your active exchange listings, review incoming cash offers, and approve deal-room access.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold shadow hover:bg-slate-800"
            >
              <span>View Exchange</span>
            </Link>
          </div>

          {/* Active Listings */}
          <div className="space-y-4">
            {userListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Live on AIApps Exchange
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{listing.title}</h3>
                    <p className="text-xs text-slate-500">{listing.tagline}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Asking Price</span>
                    <span className="text-2xl font-black text-slate-900 font-serif">{formatCurrency(listing.askingPrice)}</span>
                    <span className="text-[11px] text-slate-400 block">Appraised: {formatCurrency(listing.appraisedFairMarketValue)}</span>
                  </div>
                </div>

                {/* Offer notifications */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Deal Room Activity & Cash Offers</span>
                    <span className="text-xs font-semibold text-amber-700">1 Pending Review</span>
                  </div>
                  {incomingOffers.map((off) => (
                    <div
                      key={off.id}
                      className="p-3 bg-white rounded border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{off.buyerName}</div>
                        <div className="text-slate-500">{off.message}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-slate-900 font-serif block">{formatCurrency(off.offerAmount)}</span>
                        <div className="space-x-2 mt-1">
                          <button className="px-2.5 py-1 rounded bg-emerald-700 text-white text-[10px] font-bold">
                            Accept
                          </button>
                          <button className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            Counter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Buyer Deal Hub */}
      {activeTab === "buyer" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Buyer Deal Room & Signed NDAs</h2>
            <p className="text-xs text-slate-500">
              Access unlocked technical manifests, track signed mutual NDAs, and manage submitted acquisition offers.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Executed Mutual NDAs
              </h3>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {ndas.map((nda) => (
                <div key={nda.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{nda.listingTitle}</div>
                    <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                      Hash: {nda.ndaHash} • Signed: {new Date(nda.signedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Deal Room Unlocked
                    </span>
                    <Link
                      href={`/marketplace/${nda.listingId}`}
                      className="px-3 py-1.5 rounded bg-slate-900 text-white text-xs font-bold"
                    >
                      Enter Room &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Payouts */}
      {activeTab === "payouts" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Payout Preferences (Stripe & PayPal)</h2>
            <p className="text-xs text-slate-500">
              Configure where proceeds from software sales on the AIApps Exchange will be routed.
            </p>
          </div>

          <form onSubmit={handleSavePayout} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1.5">
                Payout Gateway
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setPayoutType("stripe_connect")}
                  className={`p-3 rounded-lg border cursor-pointer font-bold flex items-center gap-2 ${
                    payoutType === "stripe_connect"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span>Stripe Connect</span>
                </div>
                <div
                  onClick={() => setPayoutType("paypal")}
                  className={`p-3 rounded-lg border cursor-pointer font-bold flex items-center gap-2 ${
                    payoutType === "paypal"
                      ? "bg-[#0070ba] text-white border-[#0070ba]"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  <span className="font-black text-white">PayPal</span>
                  <span>Direct Transfer</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1.5">
                {payoutType === "stripe_connect" ? "Stripe Account Email" : "PayPal Email"}
              </label>
              <input
                type="email"
                required
                value={payoutEmail}
                onChange={(e) => setPayoutEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
            </div>

            {payoutSaved && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Payout destination updated successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all"
            >
              Save Payout Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
