import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { GeminiAssistant } from "@/components/ai/GeminiAssistant";

export const metadata: Metadata = {
  title: "AIApps Institute | Institutional Software Appraisal & Exchange",
  description: "Accredited AI-driven code audit, valuation certification, and verified software asset exchange.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="h-full flex overflow-hidden">
        {/* Collapsible Institutional Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header />
          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Global Gemini 1.5 Valuation Copilot */}
        <GeminiAssistant />
      </body>
    </html>
  );
}
