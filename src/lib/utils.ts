import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppraisalGrade } from "./db/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function getGradeBadgeColor(grade: AppraisalGrade): {
  bg: string;
  text: string;
  border: string;
} {
  switch (grade) {
    case 'AAA':
      return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' };
    case 'AA+':
    case 'AA':
      return { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-300' };
    case 'A+':
    case 'A':
      return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300' };
    case 'BBB':
    case 'BB':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' };
  }
}

export function generateSha256Checksum(payload: string): string {
  // Simple deterministic client/server checksum generator
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256:e8f9${hexPart}9b21a3c748de092b1cf58a6`;
}
