"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Award,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ExternalLink,
  MessageSquare,
  FileText,
  Clock,
  Sparkles,
  CreditCard,
  FileCheck,
  Unlock,
  Send,
  User,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { MarketplaceListing, MarketplaceMessage, MarketplaceOffer } from "@/lib/db/types";
import { formatCurrency, formatNumber, getGradeBadgeColor } from "@/lib/utils";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [messages, setMessages] = useState<MarketplaceMessage[]>([]);
  const [newMsgContent, setNewMsgContent] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [offerMessage, setOfferMessage] = useState("");
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [offerSubmittedSuccess, setOfferSubmittedSuccess] = useState(false);

  // Digital NDA State
  const [isNdaSigned, setIsNdaSigned] = useState(false);
  const [isSigningNda, setIsSigningNda] = useState(false);

  useEffect(() => {
    if (id) {
      const found = store.getListingById(id);
      if (found) {
        setListing(found);
        setOfferAmount(found.askingPrice);
        setOffers(store.getOffersForListing(id));
        setMessages(store.getMessagesForListing(id));

        const user = store.getCurrentUser();
        if (user.buyerPreferences?.ndaSignedListings?.includes(id)) {
          setIsNdaSigned(true);
        }
      }
    }
  }, [id]);

  if (!listing) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Exchange Listing Not Found</h2>
        <p className="text-sm text-slate-500">The requested listing ID does not exist or has been acquired.</p>
        <Link
          href="/marketplace"
          className="inline-block px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
        >
          Return to Exchange
        </Link>
      </div>
    );
  }

  const gradeColors = getGradeBadgeColor(listing.appraisedGrade);

  const handleSignNda = () => {
    setIsSigningNda(true);
    setTimeout(() => {
      store.signNDA(listing.id, "Paul Founder", "founder@aiappsinstitute.com");
      setIsNdaSigned(true);
      setIsSigningNda(false);
    }, 600);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgContent.trim() || sendingMsg) return;

    setSendingMsg(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          senderName: "Accredited Buyer",
          senderEmail: "deals@venturecraft.io",
          senderRole: "BUYER",
          content: newMsgContent.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMsgContent("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleSubmitOffer = async () => {
    setIsSubmittingOffer(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          buyerName: "Paul Founder",
          buyerEmail: "founder@aiappsinstitute.com",
          offerAmount: Number(offerAmount),
          message: offerMessage || "Formal acquisition offer submitted subject to standard code inspection.",
        }),
      });
      const data = await res.json();
      if (res.ok && data.offer) {
        setOffers([data.offer, ...offers]);
        setOfferSubmittedSuccess(true);
        setTimeout(() => {
          setIsOfferModalOpen(false);
          setOfferSubmittedSuccess(false);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Verified Exchange</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details, Deal Room Gating, and Q&A Thread */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-black font-serif ${gradeColors.bg} ${gradeColors.text} ${gradeColors.border}`}>
                Grade {listing.appraisedGrade} Certified
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                {listing.stage}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">{listing.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {listing.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              {listing.description}
            </p>

            {/* Tech Stack */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                Core Architecture Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {listing.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Gated Deal Room / NDA Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Confidential Technical Due Diligence</h3>
              </div>
              {isNdaSigned ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> NDA Signed & Unlocked
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Gated Under Mutual NDA
                </span>
              )}
            </div>

            {isNdaSigned ? (
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3 text-xs text-slate-700">
                <div className="font-bold text-emerald-900">
                  ✓ Unlocked Technical Repository & Manifest Access
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 bg-white rounded border border-emerald-200">
                    <span className="text-slate-400 block text-[9px] uppercase">Git Ingestion Hash:</span>
                    <span>commit 8a91c0429f...</span>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-emerald-200">
                    <span className="text-slate-400 block text-[9px] uppercase">Verified Dependencies:</span>
                    <span>Clean Packages (0 Critical CVEs)</span>
                  </div>
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Mutual NDA executed on consensus ledger.</span>
                  <Link
                    href={`/reports/${listing.appraisalId}`}
                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Full Layered Rebuild Math</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  To protect the seller's proprietary code logic, package manifests, and live customer retention curves, prospective buyers must sign a digital mutual NDA.
                </p>
                <button
                  onClick={handleSignNda}
                  disabled={isSigningNda}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSigningNda ? "Executing Digital NDA..." : "1-Click Sign Mutual NDA to Unlock"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Deal Room Direct Q&A Thread Between Buyer & Seller */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Direct Due-Diligence Messaging ({messages.length})</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Buyer & Seller Secure Thread</span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg text-xs space-y-1 ${
                    msg.senderRole === "SELLER"
                      ? "bg-slate-100 text-slate-900 ml-4 border border-slate-200"
                      : "bg-blue-50 text-blue-950 mr-4 border border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {msg.senderName} ({msg.senderRole})
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={newMsgContent}
                onChange={(e) => setNewMsgContent(e.target.value)}
                placeholder="Ask founder about tech stack, hosting costs, or handover support..."
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
              <button
                type="submit"
                disabled={sendingMsg || !newMsgContent.trim()}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Included Assets */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Included In Acquisition</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
              {listing.includedAssets.map((asset, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{asset}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col: Deal Box & Buy Now / Make Offer */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card space-y-6 sticky top-24">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Seller Asking Price
              </span>
              <span className="text-3xl font-black text-slate-900 font-serif block">
                {formatCurrency(listing.askingPrice)}
              </span>
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-slate-500">Certified Fair Value:</span>
                <span className="font-bold text-slate-800 font-serif">
                  {formatCurrency(listing.appraisedFairMarketValue)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Monthly Recurring Revenue:</span>
                <span className="font-bold text-slate-900">
                  {listing.monthlyRevenue > 0 ? `${formatCurrency(listing.monthlyRevenue)}/mo` : "$0 (Pre-Revenue)"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Registered / Active Users:</span>
                <span className="font-bold text-slate-900">{formatNumber(listing.monthlyUsers)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Accreditation Certificate:</span>
                <Link
                  href={`/verify/${listing.verifiedCertificateId}`}
                  target="_blank"
                  className="font-mono text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <span>{listing.verifiedCertificateId}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsOfferModalOpen(true)}
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Make Acquisition Offer</span>
              </button>

              <Link
                href={`/pricing?intent=buy&listing=${listing.id}`}
                className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Instant Buy Now (Escrow)</span>
              </Link>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Protected by AIApps Institute Standard Software Escrow. 14-day code inspection guarantee.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Make Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Submit Offer for {listing.title}
              </h3>
              <p className="text-xs text-slate-500">
                Enter your proposed acquisition amount. The seller will be notified in their deal room.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Offer Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Message / Conditions to Seller
                </label>
                <textarea
                  rows={3}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="e.g. Offering $140,000 cash, 14-day technical due diligence, immediate close..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
                ></textarea>
              </div>
            </div>

            {offerSubmittedSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 text-center">
                ✓ Offer dispatched to seller deal room!
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isSubmittingOffer}
                onClick={() => setIsOfferModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingOffer || offerSubmittedSuccess}
                onClick={handleSubmitOffer}
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
              >
                {isSubmittingOffer ? "Submitting..." : "Submit Acquisition Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
