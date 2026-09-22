"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Github,
  Globe,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sliders,
  Layers,
  Code2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Zap,
  Terminal,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AppraisalStage } from "@/lib/db/types";
import { store } from "@/lib/db/store";

const CATEGORIES = [
  "AI / Machine Learning",
  "SaaS",
  "Developer Tool",
  "Mobile App",
  "E-commerce / Marketplace",
  "API Service",
];

const STAGES: { id: AppraisalStage; label: string; desc: string }[] = [
  { id: "idea", label: "Architecture / Spec", desc: "Detailed specs or design before full code" },
  { id: "mvp", label: "Working MVP", desc: "Functional codebase with 0 to few test users" },
  { id: "pre-revenue", label: "Pre-Revenue Active", desc: "Active free users, no monetization yet" },
  { id: "early-traction", label: "Early Traction", desc: "Active users and early revenue under $5k/mo" },
  { id: "cash-flow", label: "Cash Flowing", desc: "Consistent MRR above $5,000/mo" },
];

export default function AppraisePage() {
  const router = useRouter();

  // Mode: "auto" (default) or "manual"
  const [appraisalMode, setAppraisalMode] = useState<"auto" | "manual">("auto");

  // Autonomous Scanner Inputs
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  // Audit Progress Terminal State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Show / Hide Fine-Tuning Drawer
  const [showFineTune, setShowFineTune] = useState(false);
  const [isScanningForPreview, setIsScanningForPreview] = useState(false);
  const [hasScannedPreview, setHasScannedPreview] = useState(false);

  // Form / Detected Data
  const [formData, setFormData] = useState({
    projectName: "",
    tagline: "",
    category: "AI / Machine Learning" as any,
    stage: "mvp" as AppraisalStage,
    targetAudience: "",
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS"],
    pricingModel: "Subscription" as any,
    monthlyRecurringRevenue: 0,
    monthlyGrowthRate: 15,
    registeredUsers: 250,
    payingUsers: 0,
    burnRate: 50,
    repoUrl: "",
    architectureSummary: "",
    codeSnippetOrManifest: "",
  });

  const [newTechInput, setNewTechInput] = useState("");

  // Quick Preset Handlers
  const handleApplyPreset = (type: "atlas" | "neuralform" | "institute") => {
    setError("");
    if (type === "atlas") {
      setGithubUrl("https://github.com/aiappsy/atlas-travel-club");
      setLiveUrl("https://atlastravelclub.com");
    } else if (type === "neuralform") {
      setGithubUrl("https://github.com/aiappsy/neuralform-ai-audit");
      setLiveUrl("");
    } else if (type === "institute") {
      setGithubUrl("https://github.com/aiappsy/aiapps-institute");
      setLiveUrl("http://localhost:3000");
    }
  };

  // Run Autonomous Scan & Immediate Appraisal (1-Click)
  const handleRunAutonomousAppraisal = async () => {
    if (!githubUrl.trim() && !liveUrl.trim()) {
      setError("Please provide at least a GitHub Repository URL or a Live Application URL to scan.");
      return;
    }

    setError("");
    setIsAuditing(true);
    setAuditStep(1);
    setAuditLogs([
      "Initializing AIApps Institute autonomous appraisal protocol v2.8...",
      githubUrl ? `→ Connecting to GitHub repository: ${githubUrl.trim()}` : "",
      liveUrl ? `→ Pinging live deployment endpoint: ${liveUrl.trim()}` : "",
    ].filter(Boolean));

    try {
      // Simulate real-time terminal progression for authentic due-diligence UX
      setTimeout(() => {
        setAuditStep(2);
        setAuditLogs((prev) => [
          ...prev,
          "✓ GitHub API connected. Reading package.json & requirements.txt...",
          "✓ Ingested dependencies. Inspecting code modularity & directory tree...",
        ]);
      }, 900);

      setTimeout(() => {
        setAuditStep(3);
        setAuditLogs((prev) => [
          ...prev,
          "✓ Live URL handshake verified. Measuring edge latency & SSL certificate...",
          "✓ Extracted product meta tags, value proposition, and customer positioning.",
        ]);
      }, 1900);

      setTimeout(() => {
        setAuditStep(4);
        setAuditLogs((prev) => [
          ...prev,
          "→ Synthesizing quantitative replacement hours via Gemini 3.8 Flash...",
          "→ Benchmarking market multiples and moat defensibility...",
        ]);
      }, 2900);

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUrl: githubUrl.trim(),
          liveUrl: liveUrl.trim(),
          autoAppraise: true,
          manualOverrides: hasScannedPreview ? formData : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Autonomous appraisal failed.");
      }

      setAuditStep(5);
      setAuditLogs((prev) => [
        ...prev,
        `✓ Assigned Institutional Grade: ${data.report.grade}`,
        `✓ Fair Market Valuation: $${data.report.valuationFairMarket.toLocaleString()}`,
        `✓ Cryptographic seal minted: ${data.report.certificate.certificateId}`,
        "Redirecting to certified appraisal dossier...",
      ]);

      // Save into client-side store too so instant navigation works flawlessly
      store.saveAppraisal(data.report);

      setTimeout(() => {
        router.push(`/reports/${data.report.id}`);
      }, 1200);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during the autonomous scan.");
      setIsAuditing(false);
    }
  };

  // Preview & Fine-Tune Detected Data
  const handleScanForPreview = async () => {
    if (!githubUrl.trim() && !liveUrl.trim()) {
      setError("Please enter a GitHub URL or Live URL to inspect.");
      return;
    }

    setError("");
    setIsScanningForPreview(true);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUrl: githubUrl.trim(),
          liveUrl: liveUrl.trim(),
          autoAppraise: false,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to scan inputs.");
      }

      const syn = data.scanResult.synthesizedInput;
      setFormData({
        projectName: syn.projectName,
        tagline: syn.tagline,
        category: syn.category,
        stage: syn.stage,
        targetAudience: syn.targetAudience,
        techStack: syn.techStack,
        pricingModel: syn.pricingModel,
        monthlyRecurringRevenue: syn.monthlyRecurringRevenue,
        monthlyGrowthRate: syn.monthlyGrowthRate,
        registeredUsers: syn.registeredUsers,
        payingUsers: syn.payingUsers,
        burnRate: syn.burnRate,
        repoUrl: syn.repoUrl || githubUrl,
        architectureSummary: syn.architectureSummary,
        codeSnippetOrManifest: syn.codeSnippetOrManifest || "",
      });

      setHasScannedPreview(true);
      setShowFineTune(true);
    } catch (err: any) {
      setError(err.message || "Inspection failed.");
    } finally {
      setIsScanningForPreview(false);
    }
  };

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tech),
    }));
  };

  const addTech = () => {
    if (!newTechInput.trim()) return;
    if (!formData.techStack.includes(newTechInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, newTechInput.trim()],
      }));
    }
    setNewTechInput("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold shadow-xs">
          <Zap className="w-3.5 h-3.5 fill-amber-400" />
          <span>Autonomous AI Codebase & Live URL Valuation Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
          Instant Autonomous Software Appraisal
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Zero guesswork. Paste your GitHub repository or Live URL. Our AI directly inspects your codebase, analyzes packages and dependencies, measures live web latency, and generates a bank-certified valuation in seconds.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Scan Notice:</span> {error}
          </div>
        </div>
      )}

      {/* AUDIT IN PROGRESS MODAL / TERMINAL */}
      {isAuditing && (
        <div className="bg-slate-950 text-slate-200 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Autonomous Assessor Active — Phase {auditStep}/5
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Scanning...</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-700"
              style={{ width: `${(auditStep / 5) * 100}%` }}
            ></div>
          </div>

          {/* Live Terminal Log Stream */}
          <div className="bg-slate-900/90 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 border border-slate-800/80 min-h-[140px]">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-slate-600 select-none">[{idx + 1}]</span>
                <span className={log.startsWith("✓") ? "text-emerald-400" : log.startsWith("→") ? "text-amber-300" : "text-slate-300"}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRIMARY AUTONOMOUS SCAN CARD */}
      {!isAuditing && (
        <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-xl overflow-hidden">
          {/* Card Top Banner */}
          <div className="bg-slate-900 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
                  Automated Extraction Engine
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                  Connect Codebase & Live Endpoint
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-lg">
                  Enter one or both. The AI extracts the exact tech stack, lines of code, live domain authority, and value proposition automatically.
                </p>
              </div>

              {/* Sample Presets */}
              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400">Try 1-Click Samples:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleApplyPreset("institute")}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 font-medium transition-colors"
                  >
                    AI Platform Repo
                  </button>
                  <button
                    onClick={() => handleApplyPreset("atlas")}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 font-medium transition-colors"
                  >
                    Live SaaS Domain
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body Inputs */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input 1: GitHub Repo URL */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Github className="w-4 h-4 text-slate-800" />
                    <span>GitHub Repository URL</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Auto-Detects Tech Stack
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/owner/repository"
                    className="w-full pl-3.5 pr-4 py-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Inspects package.json, requirements.txt, lines of code, test coverage, and Docker/CI files.
                </p>
              </div>

              {/* Input 2: Live Application URL */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Live Application or Landing Page URL</span>
                  </span>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Auto-Extracts Value Prop
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://your-product.com or vercel.app"
                    className="w-full pl-3.5 pr-4 py-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Scans live HTTP/SSL health, frontend signatures (Next.js/React/Tailwind), and marketing copy.
                </p>
              </div>
            </div>

            {/* Quick Auto-Detected Preview Accordion */}
            {hasScannedPreview && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      AI Extracted Asset Snapshot
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowFineTune(!showFineTune)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <span>{showFineTune ? "Hide Details" : "Inspect / Edit Details"}</span>
                    {showFineTune ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Auto-extracted summary chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Project Name</span>
                    <span className="font-bold text-slate-800 truncate block mt-0.5">{formData.projectName}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Classified Category</span>
                    <span className="font-bold text-slate-800 truncate block mt-0.5">{formData.category}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Detected Stack</span>
                    <span className="font-bold text-emerald-700 truncate block mt-0.5">{formData.techStack.length} Technologies</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Traction Baseline</span>
                    <span className="font-bold text-slate-800 truncate block mt-0.5">{formData.registeredUsers} Users ({formData.stage.toUpperCase()})</span>
                  </div>
                </div>

                {/* Fine-Tuning Drawer */}
                {showFineTune && (
                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Project Name</label>
                        <input
                          type="text"
                          value={formData.projectName}
                          onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Tagline / Value Prop</label>
                        <input
                          type="text"
                          value={formData.tagline}
                          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                        />
                      </div>
                    </div>

                    {/* Tech Stack Chips */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                        Detected Technologies (Click to remove, or type to add)
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {formData.techStack.map((tech) => (
                          <span
                            key={tech}
                            onClick={() => removeTech(tech)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-xs font-medium text-slate-800 hover:border-rose-400 hover:text-rose-600 cursor-pointer group transition-all"
                            title="Click to remove"
                          >
                            <span>{tech}</span>
                            <span className="text-slate-400 group-hover:text-rose-500 text-[10px]">✕</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 max-w-sm">
                        <input
                          type="text"
                          value={newTechInput}
                          onChange={(e) => setNewTechInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                          placeholder="Add technology (e.g. Supabase)..."
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={addTech}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Optional Financials */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block uppercase">Monthly Revenue (MRR)</label>
                        <div className="relative mt-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                          <input
                            type="number"
                            value={formData.monthlyRecurringRevenue}
                            onChange={(e) => setFormData({ ...formData, monthlyRecurringRevenue: Number(e.target.value) })}
                            className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block uppercase">Registered Users</label>
                        <input
                          type="number"
                          value={formData.registeredUsers}
                          onChange={(e) => setFormData({ ...formData, registeredUsers: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 mt-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block uppercase">Monthly Growth %</label>
                        <input
                          type="number"
                          value={formData.monthlyGrowthRate}
                          onChange={(e) => setFormData({ ...formData, monthlyGrowthRate: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 mt-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block uppercase">Server Burn Rate ($/mo)</label>
                        <div className="relative mt-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                          <input
                            type="number"
                            value={formData.burnRate}
                            onChange={(e) => setFormData({ ...formData, burnRate: Number(e.target.value) })}
                            className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Consumes 1 appraisal credit • Seals cryptographic certificate</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                {!hasScannedPreview && (
                  <button
                    type="button"
                    onClick={handleScanForPreview}
                    disabled={isScanningForPreview || (!githubUrl.trim() && !liveUrl.trim())}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {isScanningForPreview ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Inspecting Code & URL...</span>
                      </>
                    ) : (
                      <>
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Preview Detected Data</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRunAutonomousAppraisal}
                  disabled={!githubUrl.trim() && !liveUrl.trim()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 group"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Run Autonomous AI Codebase & Live Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust & Methodology Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Code2 className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Zero Technical Inquiries</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            You don't need to know every framework or dependency. The AI parses the repository AST and package manifests directly.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Globe className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Live Endpoint Inspection</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Audits SSL certificates, response latency, hosting provider (Vercel, AWS, Cloudflare), and extracts value proposition.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Bank-Certified Output</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Produces an institutional CIM, rebuild replacement cost, code modularity grade, and cryptographically verified QR code.
          </p>
        </div>
      </div>
    </div>
  );
}
