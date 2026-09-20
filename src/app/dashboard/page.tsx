import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Award,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Code2,
  DollarSign,
  FileText,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { formatCurrency, formatNumber, getGradeBadgeColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const appraisals = store.getAllAppraisals();
  const listings = store.getAllListings();
  const user = store.getCurrentUser();

  const totalPortfolioValue = appraisals.reduce((acc, curr) => acc + curr.valuationFairMarket, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Institutional Appraisal Portfolio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Accredited Node
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Welcome back, {user.displayName}. Oversee your certified codebases, valuation certificates, and exchange deal-room flow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/appraise"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Appraise New Software</span>
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-semibold transition-all shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-slate-500" />
            <span>Browse Exchange</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Appraised Assets
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-serif">
              {formatCurrency(totalPortfolioValue)}
            </span>
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across {appraisals.length} certified codebases</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Issued Certificates
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {appraisals.length}
            </span>
            <span className="text-xs text-slate-400">100% Cryptographically verified</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Public QR registry active
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Exchange Listings
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {listings.length} Active
            </span>
          </div>
          <p className="mt-1 text-xs text-amber-700 font-medium">
            1 Offer pending review
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Appraisal Credits
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {user.appraisalCredits}
            </span>
            <span className="text-xs text-slate-400">runs remaining</span>
          </div>
          <Link
            href="/pricing"
            className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium inline-block"
          >
            Refill balance via Stripe / PayPal &rarr;
          </Link>
        </div>
      </div>

      {/* Main Section: Recent Certified Appraisals Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Certified Codebases & MVPs
            </h2>
            <p className="text-xs text-slate-500">
              Audited according to AIApps Institute quantitative replacement and market comps rubric.
            </p>
          </div>
          <Link
            href="/appraise"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            <span>Run New Valuation</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Software Project</th>
                <th className="px-6 py-3.5">Stage & Category</th>
                <th className="px-6 py-3.5">Accreditation Grade</th>
                <th className="px-6 py-3.5">Fair Market Valuation</th>
                <th className="px-6 py-3.5">Certificate ID</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appraisals.map((appr) => {
                const colors = getGradeBadgeColor(appr.grade);
                return (
                  <tr key={appr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{appr.projectName}</div>
                      <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">{appr.tagline}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                        {appr.stage}
                      </span>
                      <div className="text-xs text-slate-400 mt-0.5">{appr.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-bold ${colors.bg} ${colors.text} ${colors.border}`}>
                        Grade {appr.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 font-serif">
                        {formatCurrency(appr.valuationFairMarket, appr.currency)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {formatCurrency(appr.valuationLow)} – {formatCurrency(appr.valuationHigh)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      <Link
                        href={appr.certificate.verificationUrl}
                        className="hover:text-blue-600 inline-flex items-center gap-1"
                      >
                        <span>{appr.certificate.certificateId}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/reports/${appr.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Dossier</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: AIApps Exchange Highlight */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>The AIApps Exchange</span>
          </div>
          <h3 className="text-xl font-bold font-serif tracking-tight">
            Buy or Sell Verified Software Without Broker Fluff
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike legacy listing boards where code quality is hidden and asking prices are inflated, every listing on the AIApps Exchange is backed by an official Institutional Appraisal Grade, replacement cost math, and verified code health.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/marketplace"
            className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow transition-all"
          >
            Explore Verified Listings &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
