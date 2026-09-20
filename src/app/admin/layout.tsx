import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Key,
  Sliders,
  Award,
  Activity,
  ArrowLeft,
  Building2,
  Lock,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* High-Security Admin Header */}
      <header className="bg-slate-950 text-white border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block leading-none">
                AIApps Institute • Master Admin Console
              </span>
              <span className="text-[10px] text-rose-400 font-mono uppercase tracking-wider">
                Restricted Accreditation & Operations
              </span>
            </div>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-semibold overflow-x-auto max-w-2xl py-1">
          <Link
            href="/admin"
            className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Telemetry
          </Link>
          <Link
            href="/admin/listings"
            className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Listings Moderation
          </Link>
          <Link
            href="/admin/transactions"
            className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Escrow & Transactions
          </Link>
          <Link
            href="/admin/users"
            className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Users & KYC
          </Link>
          <Link
            href="/admin/registry"
            className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Registry
          </Link>
          <Link
            href="/admin/parameters"
            className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Algorithm Math
          </Link>
          <Link
            href="/admin/integrations"
            className="px-2.5 py-1 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            API Credentials
          </Link>
        </nav>

        {/* Exit link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to App</span>
        </Link>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
