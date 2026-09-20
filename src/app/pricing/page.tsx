"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  Lock,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Percent,
} from "lucide-react";
import { APPRAISAL_PACKAGES } from "@/lib/payments/stripe";

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const pkgParam = searchParams.get("package");

  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"stripe" | "paypal">("stripe");
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(!!sessionId);

  const handleCheckout = async (packageId: string) => {
    setLoadingPkg(packageId);
    try {
      if (selectedMethod === "stripe") {
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packageId }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert("Stripe checkout initiated. Refreshing credits.");
        }
      } else {
        const res = await fetch("/api/checkout/paypal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packageId }),
        });
        const data = await res.json();
        if (data.approvalUrl) {
          window.location.href = data.approvalUrl;
        } else {
          setPaymentSuccess(true);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Payment checkout error");
    } finally {
      setLoadingPkg(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>One-Time Appraisal Credits & Zero-Fee Marketplace Listing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Simple, Transparent One-Time Pricing
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          No recurring subscriptions. Buy one-time appraisal credits whenever you ship, refactor, or prepare to exit. Every appraisal includes <strong>100% free listing rights</strong> on the AIApps Exchange.
        </p>

        {/* Payment Method Selector */}
        <div className="inline-flex items-center p-1 bg-white rounded-xl border border-slate-200 shadow-xs mt-4">
          <button
            onClick={() => setSelectedMethod("stripe")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              selectedMethod === "stripe"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Stripe (Cards & Apple Pay)</span>
          </button>
          <button
            onClick={() => setSelectedMethod("paypal")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              selectedMethod === "paypal"
                ? "bg-[#0070ba] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="font-extrabold text-white">PayPal</span>
            <span>Checkout</span>
          </button>
        </div>
      </div>

      {/* Success alert */}
      {paymentSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Payment successful! Your appraisal credits have been added to your account.</span>
          </div>
          <button
            onClick={() => router.push("/appraise")}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold shadow hover:bg-emerald-800"
          >
            Start Appraisal &rarr;
          </button>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {APPRAISAL_PACKAGES.map((pkg) => {
          const isFeatured = pkg.id === "pkg-pro";

          return (
            <div
              key={pkg.id}
              className={`rounded-2xl bg-white border p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                isFeatured
                  ? "border-2 border-slate-900 shadow-card"
                  : "border-slate-200 shadow-subtle hover:border-slate-300"
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-xs">
                  Most Popular for Founders
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>
                </div>

                <div className="flex items-baseline gap-1 py-2 border-y border-slate-100">
                  <span className="text-4xl font-black text-slate-900 font-serif">${pkg.price}</span>
                  <span className="text-xs text-slate-400 font-medium">/ one-time payment</span>
                  <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {pkg.credits} {pkg.credits === 1 ? "Appraisal" : "Appraisals"}
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
                  <li className="flex items-start gap-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Includes 100% FREE Listing on AIApps Exchange</span>
                  </li>
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleCheckout(pkg.id)}
                  disabled={loadingPkg === pkg.id}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 ${
                    isFeatured
                      ? "bg-slate-900 hover:bg-slate-800 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  } disabled:opacity-50`}
                >
                  {loadingPkg === pkg.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting {selectedMethod === "stripe" ? "Stripe" : "PayPal"}...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ${pkg.price} (One-Time)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Marketplace Exchange Fee Explainer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-subtle space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">The AIApps Exchange Fee Model: Why We Beat Flippa</h2>
            <p className="text-xs text-slate-500">Fair, founder-friendly monetization designed for fast closes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-sm block">1. \$0 Listing Fee</span>
            <p className="text-slate-600 leading-relaxed">
              Every founder who completes an appraisal gets a <strong>100% free verified listing</strong>. We never charge upfront listing fees like Flippa (\$29–\$499).
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-900 text-sm block">2. Low 5% Flat Closing Fee</span>
            <p className="text-emerald-800 leading-relaxed">
              When an acquisition closes through our Stripe/Escrow deal room, we take a fair <strong>5.0% success fee</strong>. Flippa charges 10%–15%, saving you thousands on your exit.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-sm block">3. Optional Visibility Boosts</span>
            <p className="text-slate-600 leading-relaxed">
              Want a faster exit? Pin your listing to the top of the exchange for <strong>\$49</strong> or blast it to 2,400+ accredited buyers in our weekly investor email digest for <strong>\$99</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-slate-500">Loading payment tiers...</div>}>
      <PricingContent />
    </Suspense>
  );
}
