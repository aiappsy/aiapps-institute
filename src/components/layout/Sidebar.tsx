"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  Award,
  ShieldCheck,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserCircle,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isExternal?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "New AI Appraisal", href: "/appraise", icon: Sparkles, badge: "AI" },
  { label: "Verified Exchange", href: "/marketplace", icon: ShoppingBag, badge: "Live" },
  { label: "Verification Registry", href: "/verify/AAI-2026-8821-INST", icon: ShieldCheck },
  { label: "My Account & Hub", href: "/account", icon: UserCircle },
  { label: "Billing & Credits", href: "/pricing", icon: CreditCard },
  { label: "Institutional Admin", href: "/admin", icon: ShieldAlert, badge: "Admin" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [credits, setCredits] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-white border-r border-slate-200 transition-all duration-300 z-30 flex flex-col justify-between shadow-subtle select-none",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm border border-slate-800">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-slate-900 text-sm tracking-tight truncate">
                  AIApps Institute
                </span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider truncate">
                  Appraisal Authority
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-700")} />
                {!collapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      isActive
                        ? "bg-slate-800 text-amber-300 border border-slate-700"
                        : item.badge === "Admin"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Account / Credits Status */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        {!collapsed ? (
          <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Appraisal Credits</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {credits} Available
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full w-3/4"></div>
            </div>
            <Link
              href="/pricing"
              className="text-[11px] text-slate-600 hover:text-slate-900 font-medium block text-center pt-1"
            >
              + Add Credits (Stripe/PayPal)
            </Link>
          </div>
        ) : (
          <Link
            href="/pricing"
            className="w-10 h-10 mx-auto rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs"
            title={`${credits} Appraisal Credits Available`}
          >
            {credits}
          </Link>
        )}
      </div>
    </aside>
  );
}
