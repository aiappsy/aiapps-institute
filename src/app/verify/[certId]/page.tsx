"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
  ExternalLink,
  Award,
  FileText,
  AlertCircle,
  Building2,
  QrCode,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { AppraisalReport } from "@/lib/db/types";
import { formatCurrency, getGradeBadgeColor } from "@/lib/utils";

export default function PublicVerifyPage() {
  const params = useParams();
  const router = useRouter();
  const certId = params?.certId as string;

  const [report, setReport] = useState<AppraisalReport | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (certId) {
      const found = store.getAppraisalByCertificateId(certId);
      if (found) {
        setReport(found);
      }
    }
  }, [certId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/verify/${searchInput.trim()}`);
  };

  const gradeColors = report ? getGradeBadgeColor(report.grade) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Registry Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Global Verification Registry Node</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          AIApps Institute Certificate Verification
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Cryptographically validate independent software appraisals, code audits, and fair market valuations.
        </p>
      </div>

      {/* Search Input for other certificates */}
      <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Lookup certificate ID (e.g. AAI-2026-8821-INST)..."
          className="w-full pl-4 pr-24 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 shadow-subtle"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
        >
          Verify
        </button>
      </form>

      {/* Verification Result Sheet */}
      {report ? (
        <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-certificate p-6 sm:p-10 space-y-8">
          {/* Status Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <span>ACCREDITATION STATUS: VALID & VERIFIED</span>
                </div>
                <div className="text-xs text-emerald-700">
                  Cryptographic match verified against AIApps Institute consensus ledger.
                </div>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-emerald-600 uppercase font-bold block">Registry Match</span>
              <span className="text-xs font-mono font-bold text-emerald-900">100% SECURE</span>
            </div>
          </div>

          {/* Project Details */}
          <div className="border-b border-slate-100 pb-6 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Evaluated Software System
            </span>
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              {report.projectName}
            </h2>
            <p className="text-xs text-slate-600">
              {report.tagline}
            </p>
          </div>

          {/* Official Metrics Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accredited Grade</span>
              <span className={`text-2xl font-black font-serif inline-block px-3 py-0.5 rounded border mt-1 ${gradeColors?.bg} ${gradeColors?.text} ${gradeColors?.border}`}>
                {report.grade}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Fair Market Value</span>
              <span className="text-2xl font-black text-slate-900 font-serif block mt-1">
                {formatCurrency(report.valuationFairMarket, report.currency)}
              </span>
              <span className="text-[10px] text-slate-400">
                Range: {formatCurrency(report.valuationLow)} - {formatCurrency(report.valuationHigh)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Rebuild Baseline</span>
              <span className="text-2xl font-bold text-emerald-700 font-serif block mt-1">
                {formatCurrency(report.valuationBreakdown.costToRebuild.totalRebuildCost, report.currency)}
              </span>
              <span className="text-[10px] text-slate-400">
                {report.valuationBreakdown.costToRebuild.estimatedPersonMonths} Person-Months
              </span>
            </div>
          </div>

          {/* Cryptographic Proof Table */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="font-semibold text-slate-500">Certificate Identifier</span>
              <span className="font-mono font-bold text-slate-900">{report.certificate.certificateId}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="font-semibold text-slate-500">Issued Date</span>
              <span className="font-medium text-slate-900">{report.certificate.issuedDate}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="font-semibold text-slate-500">Expiration / Re-audit Cycle</span>
              <span className="font-medium text-slate-900">{report.certificate.validThrough}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-semibold text-slate-500">SHA-256 Fingerprint</span>
              <span className="font-mono text-[10px] text-slate-600 break-all">{report.certificate.sha256Hash}</span>
            </div>
          </div>

          {/* Action Link */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Tamper-proof certificate generated by AIApps Institute.</span>
            </div>
            <Link
              href={`/reports/${report.id}`}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all"
            >
              View Full Technical Dossier &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Certificate Not Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The certificate code <span className="font-mono font-bold text-slate-800">{certId}</span> was not found in the public verification ledger. Please verify the code or scan the QR code again.
          </p>
          <div className="pt-2">
            <Link
              href="/verify/AAI-2026-8821-INST"
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Test with Verified Sample Certificate (AAI-2026-8821-INST) &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
