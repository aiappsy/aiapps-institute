"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ShieldCheck, Download, Printer, ExternalLink, CheckCircle2, Lock } from "lucide-react";
import { AppraisalReport } from "@/lib/db/types";
import { formatCurrency, getGradeBadgeColor } from "@/lib/utils";

interface Props {
  report: AppraisalReport;
  showActions?: boolean;
}

export function InstitutionalCertificate({ report, showActions = true }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://aiappsinstitute.com";
    const verifyUrl = `${origin}/verify/${report.certificate.certificateId}`;
    QRCode.toDataURL(verifyUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [report.certificate.certificateId]);

  const handlePrint = () => {
    window.print();
  };

  const gradeColors = getGradeBadgeColor(report.grade);

  return (
    <div className="space-y-4">
      {showActions && (
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cryptographically sealed under AIApps Institute Standard AAI-2026</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
          </div>
        </div>
      )}

      {/* Certificate Sheet (Standard 8.5 x 11 ratio preview) */}
      <div
        id="certificate-print-area"
        className="relative bg-[#fcfcfb] border-8 border-double border-slate-700 p-8 sm:p-12 rounded-sm shadow-certificate text-slate-900 mx-auto max-w-3xl select-none"
        style={{
          boxShadow: "0 0 0 2px #c5a059, 0 10px 30px rgba(15, 23, 42, 0.1)",
        }}
      >
        {/* Ornate Corner Accents */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-600"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-600"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-600"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-600"></div>

        {/* Certificate Header / Crest */}
        <div className="text-center space-y-2 pb-6 border-b border-slate-200">
          <div className="flex justify-center mb-1">
            <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">
            AIApps Institute for Software Accreditation
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Institutional Certificate of Appraisal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 italic max-w-md mx-auto">
            This certifies that the codebase, architecture, and commercial viability of the stated digital asset have been independently evaluated.
          </p>
        </div>

        {/* Certificate Body */}
        <div className="py-6 space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Evaluated Software Asset
            </span>
            <div className="text-2xl font-bold font-serif text-slate-900">
              {report.projectName}
            </div>
            <div className="text-sm text-slate-700 max-w-lg mx-auto">
              {report.tagline}
            </div>
          </div>

          {/* Core Appraisal Matrix Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded border border-slate-200 shadow-subtle max-w-xl mx-auto">
            <div className="text-center p-2 border-b sm:border-b-0 sm:border-r border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Assigned Grade
              </span>
              <span className={`text-xl font-black font-serif inline-block px-2 py-0.5 rounded border mt-1 ${gradeColors.bg} ${gradeColors.text} ${gradeColors.border}`}>
                {report.grade}
              </span>
            </div>

            <div className="text-center p-2 border-b sm:border-b-0 sm:border-r border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Fair Market Value
              </span>
              <span className="text-xl font-black text-emerald-700 font-serif block mt-1">
                {formatCurrency(report.valuationFairMarket, report.currency)}
              </span>
              <span className="text-xs text-emerald-800 block font-medium mt-0.5">
                Appraised Asset Value
              </span>
            </div>

            <div className="text-center p-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Rebuild Baseline Floor
              </span>
              <span className="text-xl font-bold text-slate-800 font-serif block mt-1">
                {formatCurrency(report.valuationBreakdown.costToRebuild.totalRebuildCost, report.currency)}
              </span>
              <span className="text-xs text-slate-600 block font-medium mt-0.5">
                {report.valuationBreakdown.costToRebuild.estimatedPersonMonths} senior mos @ $110/hr
              </span>
            </div>
          </div>

          {/* Details & Metadata */}
          <div className="text-sm text-slate-600 grid grid-cols-2 gap-4 max-w-md mx-auto text-left py-3 border-y border-slate-200">
            <div>
              <span className="text-slate-500 block text-xs uppercase font-semibold">Category & Stage</span>
              <span className="font-semibold text-slate-900">{report.category} ({report.stage.toUpperCase()})</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs uppercase font-semibold">Code Modularity Index</span>
              <span className="font-semibold text-slate-900">{report.codeHealth.modularityScore} / 100 ({report.codeHealth.securityVulnerabilityIndex} Risk)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs uppercase font-semibold">Date of Valuation</span>
              <span className="font-semibold text-slate-900">{report.certificate.issuedDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs uppercase font-semibold">Valid Through</span>
              <span className="font-semibold text-slate-900">{report.certificate.validThrough}</span>
            </div>
          </div>
        </div>

        {/* Certificate Footer / Seal, Signatures & QR */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Holographic Embossed Seal */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-full border-4 border-amber-500/80 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-400 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 border border-amber-600/30 rounded-full m-1 pointer-events-none"></div>
              <ShieldCheck className="w-5 h-5 text-amber-800" />
              <span className="text-[7px] font-black uppercase tracking-tighter text-amber-900 leading-none mt-0.5">
                AIAPPS
              </span>
              <span className="text-[6px] font-bold uppercase tracking-widest text-amber-800 leading-none">
                SEAL OF AUDIT
              </span>
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-800 block uppercase tracking-wider">
                Accreditation Seal
              </span>
              <span className="text-xs text-slate-600 font-mono block">
                ID: {report.certificate.certificateId}
              </span>
              <div className="flex items-center gap-1 text-xs text-emerald-800 font-semibold mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified by Authority</span>
              </div>
            </div>
          </div>

          {/* QR Code & Checksum */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Verification QR Code"
                className="w-16 h-16 rounded border border-slate-100"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-100 animate-pulse rounded"></div>
            )}
            <div className="text-left space-y-0.5 max-w-[170px]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Instant Verification
              </span>
              <span className="text-[10px] text-slate-600 font-mono break-all line-clamp-2 block leading-tight">
                {report.certificate.sha256Hash}
              </span>
              <span className="text-xs text-blue-700 font-semibold block underline">
                Scan with any camera
              </span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Micro-text */}
        <div className="mt-6 pt-3 border-t border-slate-200 text-xs text-slate-500 text-center uppercase tracking-wider leading-relaxed">
          Issued by AIApps Institute for Technical & Economic Codebase Appraisal. Valid for informational due diligence and private M&A negotiation. Not registered financial or securities advice.
        </div>
      </div>
    </div>
  );
}
