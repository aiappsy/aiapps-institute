"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { AppraisalReport, VerificationStatus } from "@/lib/db/types";
import { formatCurrency, getGradeBadgeColor } from "@/lib/utils";

export default function AdminRegistryPage() {
  const [appraisals, setAppraisals] = useState<AppraisalReport[]>(store.getAllAppraisals());
  const [search, setSearch] = useState("");

  const handleToggleStatus = (certId: string, currentStatus: VerificationStatus) => {
    const newStatus = currentStatus === "VERIFIED" ? "REVOKED" : "VERIFIED";
    store.updateCertificateStatus(certId, newStatus);
    setAppraisals(store.getAllAppraisals());
  };

  const filtered = appraisals.filter((a) =>
    a.projectName.toLowerCase().includes(search.toLowerCase()) ||
    a.certificate.certificateId.toLowerCase().includes(search.toLowerCase()) ||
    a.certificate.sha256Hash.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Master Institutional Certificate Registry</h1>
          <p className="text-xs text-slate-500">
            Cryptographic ledger oversight. Manage public validity, inspect SHA-256 hashes, or revoke compromised accreditations.
          </p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cert ID or hash..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Certificate ID</th>
                <th className="px-6 py-3.5">Software Project</th>
                <th className="px-6 py-3.5">Grade & Value</th>
                <th className="px-6 py-3.5">SHA-256 Checksum</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((appr) => {
                const colors = getGradeBadgeColor(appr.grade);
                const isVerified = appr.certificate.status === "VERIFIED";

                return (
                  <tr key={appr.id} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      <Link
                        href={appr.certificate.verificationUrl}
                        target="_blank"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <span>{appr.certificate.certificateId}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{appr.projectName}</div>
                      <div className="text-[11px] text-slate-400">{appr.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-black font-serif ${colors.bg} ${colors.text} ${colors.border}`}>
                        Grade {appr.grade}
                      </span>
                      <div className="font-bold text-slate-900 font-serif mt-0.5">
                        {formatCurrency(appr.valuationFairMarket)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-500 max-w-xs truncate">
                      {appr.certificate.sha256Hash}
                    </td>
                    <td className="px-6 py-4">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" /> REVOKED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(appr.certificate.certificateId, appr.certificate.status)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                          isVerified
                            ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {isVerified ? "Revoke" : "Re-Verify"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
