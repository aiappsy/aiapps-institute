"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Code2,
  DollarSign,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Upload,
  FileCode,
  Check,
} from "lucide-react";
import { AppraisalStage } from "@/lib/db/types";

const STAGES: { id: AppraisalStage; label: string; desc: string }[] = [
  { id: "idea", label: "Architecture / Spec", desc: "Detailed specs or design before full code" },
  { id: "mvp", label: "Working MVP", desc: "Functional codebase with 0 to few test users" },
  { id: "pre-revenue", label: "Pre-Revenue Active", desc: "Active free users, no monetization yet" },
  { id: "early-traction", label: "Early Traction", desc: "Active users and early revenue under $5k/mo" },
  { id: "cash-flow", label: "Cash Flowing", desc: "Consistent MRR above $5,000/mo" },
];

const CATEGORIES = [
  "AI / Machine Learning",
  "SaaS",
  "Developer Tool",
  "Mobile App",
  "E-commerce / Marketplace",
  "API Service",
];

const POPULAR_TECH = [
  "Next.js 14",
  "React",
  "React Native",
  "TypeScript",
  "Tailwind CSS",
  "Python",
  "Gemini 3.8 Flash",
  "Go (Golang)",
  "PostgreSQL",
  "Firebase",
  "Node.js",
  "Rust",
  "Docker",
  "FastAPI",
  "Supabase",
  "Expo",
];

export default function AppraisePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [detectedFileMsg, setDetectedFileMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    projectName: "",
    tagline: "",
    category: "AI / Machine Learning",
    stage: "mvp" as AppraisalStage,
    targetAudience: "",
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS"],
    pricingModel: "Subscription",
    monthlyRecurringRevenue: 0,
    monthlyGrowthRate: 15,
    registeredUsers: 250,
    payingUsers: 0,
    burnRate: 50,
    repoUrl: "",
    architectureSummary: "",
    codeSnippetOrManifest: "",
  });

  const toggleTech = (tech: string) => {
    if (formData.techStack.includes(tech)) {
      setFormData({
        ...formData,
        techStack: formData.techStack.filter((t) => t !== tech),
      });
    } else {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, tech],
      });
    }
  };

  // Drag and drop parser for package.json / requirements.txt / go.mod
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let file: File | undefined;
    if ("dataTransfer" in e) {
      e.preventDefault();
      file = e.dataTransfer.files?.[0];
    } else {
      file = e.target.files?.[0];
    }

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const detectedStack: string[] = [...formData.techStack];
      let packageCount = 0;

      if (file.name.endsWith(".json")) {
        try {
          const pkg = JSON.parse(content);
          const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
          packageCount = Object.keys(allDeps).length;

          // Auto detect frameworks
          if (allDeps["next"]) detectedStack.push("Next.js 14");
          if (allDeps["react"]) detectedStack.push("React");
          if (allDeps["react-native"]) detectedStack.push("React Native");
          if (allDeps["expo"]) detectedStack.push("Expo");
          if (allDeps["tailwindcss"]) detectedStack.push("Tailwind CSS");
          if (allDeps["typescript"]) detectedStack.push("TypeScript");
          if (allDeps["firebase"] || allDeps["firebase-admin"]) detectedStack.push("Firebase");
          if (allDeps["@google/generative-ai"] || allDeps["@google/genai"]) detectedStack.push("Gemini 3.8 Flash");
          if (allDeps["pg"] || allDeps["@prisma/client"]) detectedStack.push("PostgreSQL");

          const unique = Array.from(new Set(detectedStack));
          setFormData((prev) => ({
            ...prev,
            techStack: unique,
            codeSnippetOrManifest: content.slice(0, 800),
            architectureSummary: prev.architectureSummary || `Production architecture with ${packageCount} verified dependencies including ${unique.slice(0, 3).join(", ")}.`,
          }));

          setDetectedFileMsg(`✓ Ingested ${file.name}: ${packageCount} dependencies parsed and frameworks auto-tagged!`);
        } catch {
          setDetectedFileMsg(`Ingested raw ${file.name}`);
        }
      } else {
        // Python or Go
        if (content.includes("fastapi")) detectedStack.push("FastAPI");
        if (content.includes("torch") || content.includes("google")) detectedStack.push("Gemini 3.8 Flash");
        if (content.includes("django") || content.includes("flask")) detectedStack.push("Python");

        setFormData((prev) => ({
          ...prev,
          techStack: Array.from(new Set(detectedStack)),
          codeSnippetOrManifest: content.slice(0, 800),
        }));
        setDetectedFileMsg(`✓ Ingested ${file.name} successfully!`);
      }
    };
    reader.readAsText(file);
  };

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!formData.projectName.trim()) {
        setError("Please enter the name of your software project.");
        return;
      }
      if (!formData.tagline.trim()) {
        setError("Please enter a short tagline or summary.");
        return;
      }
    }
    if (step === 2) {
      if (formData.techStack.length === 0) {
        setError("Please select at least one core technology in your stack.");
        return;
      }
      if (!formData.architectureSummary.trim()) {
        setError("Please provide a brief architectural or technical summary.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/appraise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate appraisal.");
      }

      router.push(`/reports/${data.report.id}`);
    } catch (err: any) {
      setError(err.message || "An error occurred during evaluation.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Institutional Appraisal Protocol v2.8</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Appraise Software, Codebase, or Platform
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Evaluates replacement cost (person-hours), architectural code health, early traction, and fair market acquisition multiples.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex items-center justify-between">
        {[
          { num: 1, label: "Asset Identity" },
          { num: 2, label: "Code & Architecture" },
          { num: 3, label: "Users & Financials" },
          { num: 4, label: "Audit & Valuation" },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? "bg-slate-900 text-amber-400 ring-4 ring-amber-400/20"
                  : step > s.num
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === s.num ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {s.label}
            </span>
            {idx < 3 && <div className="h-0.5 bg-slate-100 flex-1 mx-2"></div>}
          </div>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Form Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle p-6 sm:p-8 space-y-6">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Project Identity & Maturity Stage</h2>
              <p className="text-xs text-slate-500">Define the core classification of the software asset.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Software Project / Platform Name *
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. PromptEngine Pro, DevPulse, LeadAutomate"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tagline / Executive Description *
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Autonomous AI lead enrichment engine for B2B sales pipelines"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Customer / Audience
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="e.g. Growth marketing teams, solo founders, DevOps"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Development & Traction Stage *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STAGES.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setFormData({ ...formData, stage: s.id })}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        formData.stage === s.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-bold text-xs">{s.label}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          formData.stage === s.id ? "text-slate-300" : "text-slate-400"
                        }`}
                      >
                        {s.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Code & Architecture with Drag-and-Drop Ingestion */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Codebase & Technical Architecture</h2>
              <p className="text-xs text-slate-500">
                Upload your package manifest or select your stack to calculate replacement costs and modularity.
              </p>
            </div>

            <div className="space-y-4">
              {/* Drag and drop file ingestion box */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileUpload}
                className="p-5 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/70 text-center space-y-2 cursor-pointer transition-all"
                onClick={() => document.getElementById("manifest-upload")?.click()}
              >
                <input
                  id="manifest-upload"
                  type="file"
                  accept=".json,.txt,.mod,.toml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-600 shadow-xs">
                  <Upload className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">
                    Drop package.json, requirements.txt, or go.mod here
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Instant dependency parsing & automated tech-stack tagging
                  </span>
                </div>
              </div>

              {detectedFileMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{detectedFileMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Core Technologies in Stack *
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {POPULAR_TECH.map((tech) => {
                    const isSelected = formData.techStack.includes(tech);
                    return (
                      <button
                        type="button"
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-slate-900 text-amber-400 border border-slate-800 shadow-xs"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Public or Private Repository URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  placeholder="https://github.com/organization/project"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Architectural Summary & Modularity Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.architectureSummary}
                  onChange={(e) => setFormData({ ...formData, architectureSummary: e.target.value })}
                  placeholder="Describe your design patterns (e.g. Next.js App Router, microservices, REST/GraphQL, database schemas, background worker queues, external API dependencies)..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 font-sans"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Code Snippet, Dependency Manifest, or Key File
                </label>
                <textarea
                  rows={3}
                  value={formData.codeSnippetOrManifest}
                  onChange={(e) => setFormData({ ...formData, codeSnippetOrManifest: e.target.value })}
                  placeholder="Dependencies automatically populate when uploading above..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 font-mono"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Users & Financials */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Users, Commercial Traction & Financials</h2>
              <p className="text-xs text-slate-500">
                Accurate numbers allow the engine to benchmark user asset capitalization and market ARR multiples.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Monetization Model
                </label>
                <select
                  value={formData.pricingModel}
                  onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                >
                  <option value="Subscription">Monthly / Annual Subscription (SaaS)</option>
                  <option value="Usage-Based">Usage / Token-Based Billing</option>
                  <option value="One-Time License">One-Time License / Source Code Sale</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Free / Open">Free / Pre-Monetization</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Monthly Recurring Revenue (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.monthlyRecurringRevenue}
                    onChange={(e) => setFormData({ ...formData, monthlyRecurringRevenue: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Registered / Active Users (Free & Paid)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.registeredUsers}
                  onChange={(e) => setFormData({ ...formData, registeredUsers: Number(e.target.value) })}
                  placeholder="e.g. 500"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Paying Clients / Subscribers
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.payingUsers}
                  onChange={(e) => setFormData({ ...formData, payingUsers: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Month-Over-Month Growth Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.monthlyGrowthRate}
                  onChange={(e) => setFormData({ ...formData, monthlyGrowthRate: Number(e.target.value) })}
                  placeholder="15"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Monthly Infrastructure Burn / Server Cost (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.burnRate}
                    onChange={(e) => setFormData({ ...formData, burnRate: Number(e.target.value) })}
                    placeholder="50"
                    className="w-full pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Execute */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Execute Institutional Audit</h2>
              <p className="text-xs text-slate-500">
                Dispatching to Gemini 3.8 Flash with Real-Time Google Search Grounding.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4 text-xs text-slate-700">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Project Name</span>
                <span className="font-bold text-slate-900 text-sm">{formData.projectName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Category & Stage</span>
                <span className="font-medium text-slate-800">{formData.category} ({formData.stage.toUpperCase()})</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Tech Stack</span>
                <span className="font-medium text-slate-800">{formData.techStack.join(", ")}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Revenue & Users</span>
                <span className="font-medium text-slate-800">
                  ${formData.monthlyRecurringRevenue}/mo | {formData.registeredUsers} Users
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Accreditation Deliverable</span>
                <span className="font-bold text-emerald-700">Official Certificate + Verifiable QR Registry + Full Dossier + FREE Exchange Listing</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                By clicking <strong>Generate Institutional Appraisal</strong>, the system will execute Google Gemini 3.8 Flash, perform live online competitor research, calculate replacement costs, and mint a cryptographically signed certificate.
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Auditing with Gemini 3.8 Flash & Grounding...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Institutional Appraisal</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
