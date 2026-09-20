"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CreditCard,
  Building2,
  RefreshCw,
  Key,
} from "lucide-react";

export default function SettingsPage() {
  const [envContent, setEnvContent] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setEnvContent(data.envContent || "");
      setStatus(data.status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ envContent }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchSettings();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>Dynamic Configuration Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Platform Settings & Dynamic Environment
        </h1>
        <p className="text-xs text-slate-500">
          Monitor connected API keys, Google ecosystem services, Stripe/PayPal payment routing, and edit environment variables live.
        </p>
      </div>

      {/* Integration Status Diagnostics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gemini AI Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Google Gemini AI
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {status?.geminiConnected ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <span className="text-slate-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Rubric Fallback Active
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            Model: {status?.geminiModel || "gemini-1.5-pro"}
          </span>
        </div>

        {/* Firebase Firestore Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Firebase Database
            </span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Local / Live Hybrid
          </div>
          <span className="text-[10px] text-slate-400 block font-mono truncate">
            {status?.firebaseProject}
          </span>
        </div>

        {/* Stripe Gateway Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Stripe Gateway
            </span>
            <CreditCard className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {status?.stripeActive ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live Gateway
              </span>
            ) : (
              <span className="text-amber-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Sandbox / Simulated
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            Cards & One-Click
          </span>
        </div>

        {/* PayPal Gateway Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              PayPal Gateway
            </span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {status?.paypalActive ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            ) : (
              <span className="text-amber-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> {status?.paypalMode}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            Smart Buttons Ready
          </span>
        </div>
      </div>

      {/* Dynamic .env Editor */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Dynamic `.env.local` Editor
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Update Stripe keys, PayPal secrets, Google Gemini API key, or Firebase credentials dynamically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSettings}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Reload from disk"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>{saving ? "Saving Changes..." : "Save .env Configuration"}</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>.env.local successfully updated and saved to disk.</span>
          </div>
        )}

        <div>
          <textarea
            rows={16}
            value={envContent}
            onChange={(e) => setEnvContent(e.target.value)}
            className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 border border-slate-800 leading-relaxed shadow-inner"
            placeholder="# Paste or modify your .env configuration here..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}
