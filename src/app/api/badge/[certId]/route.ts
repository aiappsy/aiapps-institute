import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/db/store";
import { formatCurrency } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { certId: string } }
) {
  const certId = params.certId;
  const appraisal = store.getAppraisalByCertificateId(certId);

  const grade = appraisal?.grade || "AAA";
  const value = appraisal ? formatCurrency(appraisal.valuationFairMarket) : "$168,000";
  const status = appraisal?.certificate.status || "VERIFIED";
  const statusColor = status === "VERIFIED" ? "#10b981" : "#ef4444";

  // Institutional SVG badge design
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="34" viewBox="0 0 380 34" fill="none" role="img" aria-label="AIApps Institute Accredited">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>

  <!-- Background container -->
  <rect width="380" height="34" rx="6" fill="url(#grad1)" stroke="#334155" stroke-width="1"/>

  <!-- Left Icon & Brand Label -->
  <path d="M14 11 L18 8 L22 11 L22 20 L18 23 L14 20 Z" fill="url(#goldGrad)" />
  <path d="M16 13 L18 11.5 L20 13 L20 18.5 L18 20 L16 18.5 Z" fill="#0f172a" />
  <text x="28" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="800" fill="#f8fafc" letter-spacing="0.5">AIAPPS INSTITUTE</text>

  <!-- Vertical Divider 1 -->
  <line x1="140" y1="7" x2="140" y2="27" stroke="#334155" stroke-width="1"/>

  <!-- Grade Block -->
  <rect x="148" y="7" width="60" height="20" rx="3" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="0.8"/>
  <text x="178" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900" fill="#fbbf24" text-anchor="middle" letter-spacing="0.5">GRADE ${grade}</text>

  <!-- Vertical Divider 2 -->
  <line x1="216" y1="7" x2="216" y2="27" stroke="#334155" stroke-width="1"/>

  <!-- Appraised Value Block -->
  <text x="260" y="21" font-family="Georgia, serif" font-size="11" font-weight="800" fill="#f8fafc" text-anchor="middle">${value}</text>

  <!-- Vertical Divider 3 -->
  <line x1="304" y1="7" x2="304" y2="27" stroke="#334155" stroke-width="1"/>

  <!-- Verified Status Pill -->
  <circle cx="316" cy="17" r="3.5" fill="${statusColor}"/>
  <text x="325" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" font-weight="800" fill="${statusColor}" letter-spacing="0.5">${status}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
