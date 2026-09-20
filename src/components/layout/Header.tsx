"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Bell, Search, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-subtle">
      {/* Left / Search bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search appraisals, listings, or certificate IDs..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Right / Status & Actions */}
      <div className="flex items-center gap-4">
        {/* Live Network Pill */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Accreditation Node Active</span>
        </div>

        {/* Action Button */}
        <Link
          href="/appraise"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Appraise New App</span>
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-semibold text-xs flex items-center justify-center shadow-inner">
            PF
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">Paul Founder</span>
            <span className="text-[10px] text-slate-500 font-medium">Accredited Member</span>
          </div>
        </div>
      </div>
    </header>
  );
}
