"use client";

import React, { useState } from "react";
import {
  Sliders,
  ShieldCheck,
  Save,
  CheckCircle2,
  DollarSign,
  Layers,
  TrendingUp,
  Percent,
} from "lucide-react";
import { store } from "@/lib/db/store";
import { PlatformParameters } from "@/lib/db/types";

export default function AdminParametersPage() {
  const [params, setParams] = useState<PlatformParameters>(store.getParameters());
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    store.updateParameters(params);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 400);
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Valuation Algorithm & Economic Math Calibration
        </h1>
        <p className="text-xs text-slate-500">
          Fine-tune the institutional quantitative formulas. All subsequent appraisals and automated replacement calculations immediately adopt these parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Engineering Cost Parameters */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Engineering Replacement Cost Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Senior Engineering Hourly Rate (USD/hr)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  value={params.seniorHourlyRate}
                  onChange={(e) => setParams({ ...params, seniorHourlyRate: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Global senior fullstack & AI developer market rate</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Hours Per Person-Month
              </label>
              <input
                type="number"
                value={params.hoursPerPersonMonth}
                onChange={(e) => setParams({ ...params, hoursPerPersonMonth: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Standard full-time development allocation (160 hrs/mo)</span>
            </div>
          </div>
        </div>

        {/* Complexity Multipliers */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Category Complexity Multipliers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                AI / Machine Learning Multiplier
              </label>
              <input
                type="number"
                step="0.05"
                value={params.aiComplexityMultiplier}
                onChange={(e) => setParams({ ...params, aiComplexityMultiplier: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Reflects model orchestration complexity (1.40x)</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Developer Tool Multiplier
              </label>
              <input
                type="number"
                step="0.05"
                value={params.devToolsMultiplier}
                onChange={(e) => setParams({ ...params, devToolsMultiplier: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Reflects systems performance complexity (1.30x)</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Standard SaaS Multiplier
              </label>
              <input
                type="number"
                step="0.05"
                value={params.saasMultiplier}
                onChange={(e) => setParams({ ...params, saasMultiplier: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Standard web app architecture (1.15x)</span>
            </div>
          </div>
        </div>

        {/* Marketing Asset Valuation Rates */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Marketing & Distribution Capitalization
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Benchmark CAC User Replacement Rate ($/User)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  value={params.cacUserValueRate}
                  onChange={(e) => setParams({ ...params, cacUserValueRate: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">What a buyer saves by buying existing active users</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Qualified B2B Lead / Waitlist Value ($/Lead)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  value={params.leadValuationRate}
                  onChange={(e) => setParams({ ...params, leadValuationRate: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Capitalized value for pre-launch waitlists</span>
            </div>
          </div>
        </div>

        {/* Exchange Governance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Percent className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Exchange Take-Rate & Certificate Expiration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Exchange Marketplace Commission (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={params.platformTakeRatePercent}
                onChange={(e) => setParams({ ...params, platformTakeRatePercent: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Flippa charges 10-15%; AIApps Institute standard is 5.0%</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Certificate Validity Duration (Days)
              </label>
              <input
                type="number"
                value={params.certificateValidityDays}
                onChange={(e) => setParams({ ...params, certificateValidityDays: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Standard annual re-appraisal period (365 days)</span>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4">
          {saveSuccess ? (
            <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Valuation parameters calibrated and committed!</span>
            </div>
          ) : (
            <div></div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{saving ? "Saving..." : "Save Algorithm Parameters"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
