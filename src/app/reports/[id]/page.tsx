"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  DollarSign,
  TrendingUp,
  FileText,
  Printer,
  ShoppingBag,
  ExternalLink,
  Code2,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
  Share2,
  Sliders,
  Users,
  Search,
  Zap,
  Check,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { AppraisalReport } from "@/lib/db/types";
import { formatCurrency, formatNumber, getGradeBadgeColor } from "@/lib/utils";
import { InstitutionalCertificate } from "@/components/certificate/InstitutionalCertificate";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [report, setReport] = useState<AppraisalReport | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "certificate" | "cim" | "rebuildLayers" | "marketing" | "competition" | "simulator">("summary");
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [askingPrice, setAskingPrice] = useState(0);
  const [selectedBoost, setSelectedBoost] = useState<"standard" | "featured" | "vip">("standard");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // "What-If" Simulator State
  const [simMrr, setSimMrr] = useState(0);
  const [simUsers, setSimUsers] = useState(0);
  const [simGrowth, setSimGrowth] = useState(15);
  const [simHourlyRate, setSimHourlyRate] = useState(110);

  useEffect(() => {
    if (id) {
      const found = store.getAppraisalById(id);
      if (found) {
        setReport(found);
        setAskingPrice(found.valuationFairMarket);
        setSimMrr(found.monthlyRecurringRevenue);
        setSimUsers(found.registeredUsers);
        setSimGrowth(found.monthlyGrowthRate);
        setSimHourlyRate(found.valuationBreakdown.costToRebuild.hourlySeniorDevRate || 110);
      }
    }
  }, [id]);

  if (!report) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Appraisal Dossier Not Found</h2>
        <p className="text-sm text-slate-500">The requested report ID does not exist or has expired.</p>
        <Link
          href="/dashboard"
          className="inline-block px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const gradeColors = getGradeBadgeColor(report.grade);

  // Calculate dynamic simulated valuation
  const simMonths = report.valuationBreakdown.costToRebuild.estimatedPersonMonths;
  const simRebuildFloor = Math.round(simMonths * 160 * simHourlyRate * (1 - (report.codeHealth.technicalDebtDiscountPercent / 100)));
  const simMarketingVal = Math.round((simUsers * 24) + 8500);
  let simValuation = 0;

  if (simMrr > 0) {
    const simArr = simMrr * 12;
    const simMultiple = 3.8 + Math.min(simGrowth * 0.08, 2.0);
    simValuation = Math.round((simArr * simMultiple * 0.55) + (simRebuildFloor * 0.30) + (simMarketingVal * 0.15));
  } else {
    simValuation = Math.round(simRebuildFloor + (simMarketingVal * 0.65));
  }

  const handlePublishToMarketplace = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appraisalId: report.id,
          askingPrice: Number(askingPrice),
          sellerName: "Paul Founder",
          sellerEmail: "founder@aiappsinstitute.com",
          boostTier: selectedBoost,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPublishSuccess(true);
        setTimeout(() => {
          setIsListingModalOpen(false);
          router.push(`/marketplace/${data.listing.id}`);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
          <span>/</span>
          <span>Reports</span>
          <span>/</span>
          <span className="font-mono text-slate-800">{report.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium text-slate-700">Accreditation: {report.certificate.status}</span>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-black font-serif ${gradeColors.bg} ${gradeColors.text} ${gradeColors.border}`}>
              Grade {report.grade}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
              {report.stage}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-medium">{report.category}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {report.projectName}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            {report.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Cert ID: {report.certificate.certificateId}</span>
            <span>•</span>
            <Link
              href={report.certificate.verificationUrl}
              target="_blank"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Public Verification Ledger</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Valuation Callout & Actions */}
        <div className="flex flex-col sm:items-end gap-3 bg-slate-50 p-5 rounded-xl border border-slate-100 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block sm:text-right">
              Fair Market Valuation
            </span>
            <span className="text-3xl font-black text-slate-900 font-serif block sm:text-right">
              {formatCurrency(report.valuationFairMarket, report.currency)}
            </span>
            <span className="text-xs text-slate-500 block sm:text-right">
              Bounds: {formatCurrency(report.valuationLow)} – {formatCurrency(report.valuationHigh)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setActiveTab("certificate")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Official Certificate</span>
            </button>

            {report.isListedOnMarketplace ? (
              <Link
                href={`/marketplace/${report.marketplaceListingId || 'list-101'}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Live on Exchange</span>
              </Link>
            ) : (
              <button
                onClick={() => setIsListingModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>List on Exchange (FREE)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs sm:text-sm font-medium space-x-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("summary")}
          className={`pb-3 border-b-2 transition-all shrink-0 ${
            activeTab === "summary"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Executive Dossier
        </button>
        <button
          onClick={() => setActiveTab("certificate")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "certificate"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>Certificate & QR</span>
        </button>
        <button
          onClick={() => setActiveTab("cim")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "cim"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Executive CIM (Teaser)</span>
        </button>
        <button
          onClick={() => setActiveTab("rebuildLayers")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "rebuildLayers"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4 text-blue-500" />
          <span>Layered Code Rebuild</span>
        </button>
        <button
          onClick={() => setActiveTab("marketing")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "marketing"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-purple-500" />
          <span>Marketing Replacement</span>
        </button>
        <button
          onClick={() => setActiveTab("competition")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "competition"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Search className="w-4 h-4 text-emerald-500" />
          <span>Competitive Landscape</span>
        </button>
        <button
          onClick={() => setActiveTab("simulator")}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "simulator"
              ? "border-slate-900 text-slate-900 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4 text-rose-500" />
          <span>"What-If" Simulator</span>
        </button>
      </div>

      {/* TAB 1: Executive Dossier */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Institutional Assessor Executive Summary
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed font-sans">
              {report.executiveSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Institutional Strengths & Moats</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Risk Factors & Dilution Hazards</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {report.riskFactors.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Certificate */}
      {activeTab === "certificate" && (
        <InstitutionalCertificate report={report} />
      )}

      {/* TAB 2.5: Confidential Information Memorandum (CIM) */}
      {activeTab === "cim" && (
        <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-xl p-6 sm:p-10 space-y-8 print:p-0 print:border-none print:shadow-none">
          {/* CIM Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-slate-900 text-amber-400 text-[10px] font-mono font-bold tracking-wider uppercase">
                  Confidential Information Memorandum (CIM)
                </span>
                <span className="text-xs font-mono text-slate-400">REF: #{report.id}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                {report.projectName} — Acquisition Memo
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Prepared by AIApps Institute for accredited institutional acquirers & syndicates
              </p>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export / Print CIM (PDF)</span>
              </button>
            </div>
          </div>

          {/* 4-Metric Institutional Scorecard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Certified Valuation</span>
              <span className="text-2xl font-black text-slate-900 font-serif block mt-1">
                {formatCurrency(report.valuationFairMarket)}
              </span>
              <span className="text-[10px] text-slate-500">Fair Market Benchmark</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Rebuild Floor</span>
              <span className="text-2xl font-black text-slate-800 font-serif block mt-1">
                {formatCurrency(report.valuationBreakdown.costToRebuild.totalRebuildCost)}
              </span>
              <span className="text-[10px] text-slate-500">
                {report.valuationBreakdown.costToRebuild.estimatedPersonMonths} senior person-months
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Code Health Grade</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xl font-black font-serif px-2 py-0.5 rounded border ${gradeColors.bg} ${gradeColors.text} ${gradeColors.border}`}>
                  {report.grade}
                </span>
                <span className="text-xs font-bold text-slate-700">{report.codeHealth.modularityScore}/100 Modularity</span>
              </div>
              <span className="text-[10px] text-slate-500">{report.codeHealth.technicalDebtDiscountPercent}% Tech Debt Discount</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Moat Defensibility</span>
              <span className="text-2xl font-black text-emerald-800 font-serif block mt-1">
                {report.valuationBreakdown.defensibilityMoatScore}/100
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Strong IP Protection</span>
            </div>
          </div>

          {/* Section 1: Executive Summary & Thesis */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              1. Executive Summary & Investment Thesis
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {report.executiveSummary}
            </p>
          </div>

          {/* Section 2: Codebase Replacement Cost & Architecture */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              2. Technical Architecture & Engineering Replacement Value
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {report.architectureSummary}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {report.valuationBreakdown.costToRebuild.layers?.map((layer, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{layer.layerName}</span>
                    <span className="font-serif">{formatCurrency(layer.cost)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{layer.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Marketing Replacement Equity & Traction */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              3. Marketing Replacement Equity & User Economics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">User Base Equity</span>
                <span className="text-base font-bold text-slate-900 font-serif">
                  {formatCurrency(report.valuationBreakdown.marketingReplacement.userAcquisitionReplacement)}
                </span>
                <span className="text-[10px] text-slate-500 block">{formatNumber(report.registeredUsers)} active users</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Organic SEO Equity</span>
                <span className="text-base font-bold text-slate-900 font-serif">
                  {formatCurrency(report.valuationBreakdown.marketingReplacement.organicSeoDomainEquity)}
                </span>
                <span className="text-[10px] text-slate-500 block">Domain age & backlinks</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Monthly Revenue</span>
                <span className="text-base font-bold text-slate-900 font-serif">
                  {report.monthlyRecurringRevenue > 0 ? `${formatCurrency(report.monthlyRecurringRevenue)}/mo` : "$0 (Pre-Rev)"}
                </span>
                <span className="text-[10px] text-slate-500 block">{report.monthlyGrowthRate}% MoM Growth</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Marketing Value</span>
                <span className="text-base font-bold text-emerald-800 font-serif">
                  {formatCurrency(report.valuationBreakdown.marketingReplacement.totalMarketingReplacement)}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block">Combined Asset Equity</span>
              </div>
            </div>
          </div>

          {/* Section 4: Acquisition Deliverables & Transition */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              4. Included Acquisition Assets & Founder Handover
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full Git Source Code & Intellectual Property Assignment</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Primary Domain Name & DNS Configuration Transfer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cloud & Server Hosting Environment (Firebase, Cloud Run, Supabase)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Stripe / Merchant Processing Account & Customer Records</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>30 Days Direct Founder Transition & Technical Advisory</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protected by AIApps Institute 5% Escrow & 7-Day Inspection</span>
              </li>
            </ul>
          </div>

          {/* CIM Footer Signoff */}
          <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <div>
              <span>VERIFICATION CHECKSUM: {report.certificate.sha256Hash}</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">ISSUED BY AIAPPS INSTITUTE ACCREDITATION BOARD</span>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-bold text-slate-900">ACCREDITATION SEAL: {report.certificate.certificateId}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Layered Code Rebuild */}
      {activeTab === "rebuildLayers" && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-subtle space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Layer-by-Layer Code Replacement Math</h3>
            <p className="text-xs text-slate-500">
              Total baseline calculated at {report.valuationBreakdown.costToRebuild.estimatedPersonMonths} senior person-months (${formatCurrency(report.valuationBreakdown.costToRebuild.totalRebuildCost)}) at ${report.valuationBreakdown.costToRebuild.hourlySeniorDevRate}/hr.
            </p>
          </div>

          <div className="space-y-3">
            {report.valuationBreakdown.costToRebuild.layers?.map((layer, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-sm">{layer.layerName}</span>
                  <p className="text-slate-500 max-w-md">{layer.description}</p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="font-bold text-slate-900 text-sm font-serif block">{formatCurrency(layer.cost)}</span>
                  <span className="text-slate-400">{layer.personMonths} Person-Months</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Marketing Replacement */}
      {activeTab === "marketing" && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-subtle space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Marketing & Go-To-Market Replacement Cost</h3>
            <p className="text-xs text-slate-500">
              Assesses the capital required for a buyer to re-acquire the user base, organic search rankings, and brand equity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">User Acquisition Replacement</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">
                {formatCurrency(report.valuationBreakdown.marketingReplacement?.userAcquisitionReplacement || 0)}
              </span>
              <span className="text-xs text-slate-400">{report.registeredUsers} Users @ Industry CAC</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Organic SEO & Domain Equity</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">
                {formatCurrency(report.valuationBreakdown.marketingReplacement?.organicSeoDomainEquity || 0)}
              </span>
              <span className="text-xs text-slate-400">Backlinks & Search Authority</span>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">Total Marketing Equity</span>
              <span className="text-xl font-black text-purple-900 font-serif mt-1 block">
                {formatCurrency(report.valuationBreakdown.marketingReplacement?.totalMarketingReplacement || 0)}
              </span>
              <span className="text-xs text-purple-600">Saved buyer marketing spend</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <strong>GTM Assessor Rationale: </strong>
            {report.valuationBreakdown.marketingReplacement?.rationale}
          </div>
        </div>
      )}

      {/* TAB 5: Competitive Landscape */}
      {activeTab === "competition" && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-subtle space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Competitive Landscape & Moat Audit</h3>
            <p className="text-xs text-slate-500">
              Evaluation of established market leaders vs. emerging indie AI alternatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Established Incumbents (Absorption Threat)
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {report.valuationBreakdown.competitiveAudit?.establishedIncumbents.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="font-semibold text-slate-800">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Emerging Rivals (Price War & Clone Risk)
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {report.valuationBreakdown.competitiveAudit?.emergingRivals.map((riv, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="font-semibold text-slate-800">{riv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Moat Defensibility Score</span>
              <span className="text-2xl font-black text-emerald-900 font-serif">
                {report.valuationBreakdown.competitiveAudit?.moatDefensibilityScore} / 100
              </span>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded bg-emerald-100 text-emerald-800">
              {report.valuationBreakdown.competitiveAudit?.threatLevel} Threat Profile
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <strong>Differentiation Rationale: </strong>
            {report.valuationBreakdown.competitiveAudit?.differentiationAnalysis}
          </div>
        </div>
      )}

      {/* TAB 6: "What-If" Sensitivity Simulator */}
      {activeTab === "simulator" && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-subtle space-y-8">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Dynamic Valuation Sensitivity Simulator</h3>
              <p className="text-xs text-slate-500">
                Adjust key commercial and operational variables to stress-test the fair market valuation in real-time.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Simulated Valuation</span>
              <span className="text-2xl font-black text-slate-900 font-serif">{formatCurrency(simValuation)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Monthly Recurring Revenue (MRR)</span>
                <span className="font-bold text-slate-900">{formatCurrency(simMrr)}/mo</span>
              </div>
              <input
                type="range"
                min="0"
                max="25000"
                step="250"
                value={simMrr}
                onChange={(e) => setSimMrr(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Active Registered Users</span>
                <span className="font-bold text-slate-900">{formatNumber(simUsers)} Users</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={simUsers}
                onChange={(e) => setSimUsers(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Month-over-Month Growth Rate</span>
                <span className="font-bold text-slate-900">{simGrowth}% MoM</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={simGrowth}
                onChange={(e) => setSimGrowth(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Engineering Rate Benchmark</span>
                <span className="font-bold text-slate-900">${simHourlyRate}/hr</span>
              </div>
              <input
                type="range"
                min="75"
                max="160"
                step="5"
                value={simHourlyRate}
                onChange={(e) => setSimHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Baseline vs. Simulated Delta</span>
              <span className="text-slate-500">
                Certified Baseline: {formatCurrency(report.valuationFairMarket)} &rarr; Simulated: {formatCurrency(simValuation)}
              </span>
            </div>
            <span className={`font-bold font-serif text-sm ${simValuation >= report.valuationFairMarket ? "text-emerald-700" : "text-rose-700"}`}>
              {simValuation >= report.valuationFairMarket ? "+" : ""}
              {formatCurrency(simValuation - report.valuationFairMarket)} Delta
            </span>
          </div>
        </div>
      )}

      {/* 1-Click Listing Modal with Pricing & Upsell Options */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Free Exchange Listing (Included with Appraisal)</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Publish to AIApps Exchange
              </h3>
              <p className="text-xs text-slate-500">
                Listing is 100% free with your appraisal. You only pay a modest 5% escrow closing fee upon a successful sale (saving you 10% compared to Flippa).
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Asking Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Certified Fair Value: {formatCurrency(report.valuationFairMarket)}</span>
                  <span>Estimated 5% Commission: {formatCurrency(askingPrice * 0.05)}</span>
                </div>
              </div>

              {/* Optional Visibility Boosts */}
              <div className="pt-2 space-y-2">
                <span className="font-bold text-slate-700 uppercase text-[10px] block">
                  Optional Visibility Boosts (One-Time)
                </span>

                <div
                  onClick={() => setSelectedBoost("standard")}
                  className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between ${
                    selectedBoost === "standard"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <div>
                      <div className="font-bold">Standard Certified Listing</div>
                      <div className="text-[10px] opacity-75">Included free with your appraisal</div>
                    </div>
                  </div>
                  <span className="font-bold">FREE</span>
                </div>

                <div
                  onClick={() => setSelectedBoost("featured")}
                  className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between ${
                    selectedBoost === "featured"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-bold">Featured Top-of-Exchange Placement</div>
                      <div className="text-[10px] opacity-75">30 days pinned atop marketplace catalog</div>
                    </div>
                  </div>
                  <span className="font-bold">+$49</span>
                </div>

                <div
                  onClick={() => setSelectedBoost("vip")}
                  className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between ${
                    selectedBoost === "vip"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="font-bold">Featured + Investor Email Blast</div>
                      <div className="text-[10px] opacity-75">Spotlight to 2,400+ accredited buyers</div>
                    </div>
                  </div>
                  <span className="font-bold">+$99</span>
                </div>
              </div>
            </div>

            {publishSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 text-center">
                ✓ Listing published successfully! Redirecting to Deal Room...
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isPublishing}
                onClick={() => setIsListingModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPublishing || publishSuccess}
                onClick={handlePublishToMarketplace}
                className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
              >
                {isPublishing ? "Publishing..." : `Confirm & Publish (${selectedBoost === "standard" ? "FREE" : selectedBoost === "featured" ? "$49" : "$99"})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
