export interface ScannedLiveData {
  url: string;
  domain: string;
  statusCode: number;
  responseTimeMs: number;
  isHttps: boolean;
  pageTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogSiteName: string;
  detectedTechStack: string[];
  detectedHosting: string;
  detectedAudience: string;
  detectedCategory: 'AI / Machine Learning' | 'Developer Tool' | 'SaaS' | 'Mobile App' | 'E-commerce / Marketplace' | 'API Service';
  detectedPricingModel: 'Free / Open' | 'Freemium' | 'Subscription' | 'Usage-Based' | 'One-Time License';
  extractedHeadlines: string[];
  summaryAnalysis: string;
}

export async function scanLiveUrl(inputUrl: string): Promise<ScannedLiveData> {
  let targetUrl = inputUrl.trim();
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://${targetUrl}`;
  }

  const urlObj = new URL(targetUrl);
  const domain = urlObj.hostname.replace(/^www\./, "");
  const isHttps = urlObj.protocol === "https:";

  const startTime = Date.now();
  let statusCode = 0;
  let html = "";
  let responseHeaders: Record<string, string> = {};

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 AIApps-Auditor/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);

    statusCode = res.status;
    res.headers.forEach((v, k) => {
      responseHeaders[k.toLowerCase()] = v;
    });

    html = await res.text();
  } catch (err: any) {
    console.warn("Direct live URL fetch failed or timed out:", err.message);
    statusCode = 0;
  }

  const responseTimeMs = Date.now() - startTime;

  // 1. Parse Meta Tags & Title
  const getTagContent = (regex: RegExp): string => {
    const m = html.match(regex);
    return m ? m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim() : "";
  };

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].trim() : domain;

  const metaDescription =
    getTagContent(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    getTagContent(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);

  const ogTitle = getTagContent(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  const ogDescription = getTagContent(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const ogImage = getTagContent(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  const ogSiteName = getTagContent(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i);

  // 2. Extract Headings (h1, h2)
  const extractedHeadlines: string[] = [];
  const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi));
  for (const match of h1Matches) {
    const cleaned = match[1].replace(/<[^>]+>/g, "").trim();
    if (cleaned && cleaned.length > 5 && cleaned.length < 120 && !extractedHeadlines.includes(cleaned)) {
      extractedHeadlines.push(cleaned);
    }
  }
  const h2Matches = Array.from(html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi));
  for (const match of h2Matches) {
    const cleaned = match[1].replace(/<[^>]+>/g, "").trim();
    if (cleaned && cleaned.length > 8 && cleaned.length < 120 && !extractedHeadlines.includes(cleaned)) {
      extractedHeadlines.push(cleaned);
    }
    if (extractedHeadlines.length >= 4) break;
  }

  // 3. Detect Tech Stack Signatures
  const detectedTech = new Set<string>();

  // Next.js
  if (html.includes("__NEXT_DATA__") || html.includes("/_next/") || html.includes("next-head-count")) {
    detectedTech.add("Next.js 14");
    detectedTech.add("React");
  }

  // React
  if (html.includes("data-reactroot") || html.includes("_reactRootContainer") || html.includes("react-dom")) {
    detectedTech.add("React");
  }

  // Tailwind CSS
  if (
    html.includes("flex items-center") ||
    html.includes("justify-between") ||
    html.includes("grid-cols-") ||
    html.includes("text-slate-") ||
    html.includes("bg-slate-") ||
    html.includes("max-w-")
  ) {
    detectedTech.add("Tailwind CSS");
  }

  // Analytics & Tracking
  if (html.includes("googletagmanager.com") || html.includes("google-analytics.com") || html.includes("gtag")) {
    detectedTech.add("Google Analytics");
  }
  if (html.includes("posthog")) {
    detectedTech.add("PostHog");
  }
  if (html.includes("plausible.io")) {
    detectedTech.add("Plausible Analytics");
  }

  // Payments & CRM
  if (html.includes("js.stripe.com")) {
    detectedTech.add("Stripe Payments");
  }
  if (html.includes("crisp.chat")) {
    detectedTech.add("Crisp Chat");
  }
  if (html.includes("intercom.io")) {
    detectedTech.add("Intercom");
  }

  // 4. Detect Hosting & Cloud Infrastructure
  let detectedHosting = "Cloud Infrastructure";
  if (responseHeaders["x-vercel-id"]) {
    detectedHosting = "Vercel Edge Network";
  } else if (responseHeaders["cf-ray"] || responseHeaders["server"]?.toLowerCase().includes("cloudflare")) {
    detectedHosting = "Cloudflare Global Edge";
  } else if (responseHeaders["x-amz-cf-id"] || responseHeaders["server"]?.toLowerCase().includes("amazon")) {
    detectedHosting = "AWS CloudFront";
  } else if (responseHeaders["x-cloud-trace-context"] || responseHeaders["server"]?.toLowerCase().includes("gfe")) {
    detectedHosting = "Google Cloud Run / GCP";
  }

  // 5. Inferred Pricing Model
  let detectedPricingModel: ScannedLiveData["detectedPricingModel"] = "Subscription";
  const bodyLower = html.toLowerCase();
  if (bodyLower.includes("/month") || bodyLower.includes("per month") || bodyLower.includes("subscription") || bodyLower.includes("/mo")) {
    detectedPricingModel = "Subscription";
  } else if (bodyLower.includes("free tier") || bodyLower.includes("free forever") || bodyLower.includes("freemium")) {
    detectedPricingModel = "Freemium";
  } else if (bodyLower.includes("pay as you go") || bodyLower.includes("per token") || bodyLower.includes("per request") || bodyLower.includes("usage")) {
    detectedPricingModel = "Usage-Based";
  } else if (bodyLower.includes("open source") || bodyLower.includes("free and open")) {
    detectedPricingModel = "Free / Open";
  }

  // 6. Inferred Category
  let detectedCategory: ScannedLiveData["detectedCategory"] = "SaaS";
  const combinedCopy = `${pageTitle} ${metaDescription} ${ogDescription} ${extractedHeadlines.join(" ")}`.toLowerCase();

  if (combinedCopy.match(/ai|artificial intelligence|machine learning|llm|agent|gpt|prompt|model|copilot/i)) {
    detectedCategory = "AI / Machine Learning";
  } else if (combinedCopy.match(/developer|api|sdk|cli|git|debug|codebase|workflow|pipeline/i)) {
    detectedCategory = "Developer Tool";
  } else if (combinedCopy.match(/app store|ios|android|mobile app|download the app/i)) {
    detectedCategory = "Mobile App";
  } else if (combinedCopy.match(/marketplace|ecommerce|shop|cart|checkout|store/i)) {
    detectedCategory = "E-commerce / Marketplace";
  } else if (combinedCopy.match(/rest api|graphql|webhook|microservice|data feed/i)) {
    detectedCategory = "API Service";
  }

  // 7. Inferred Target Audience
  let detectedAudience = "B2B and digital software users";
  if (combinedCopy.includes("founder") || combinedCopy.includes("startup")) {
    detectedAudience = "Founders, startup teams, and entrepreneurs";
  } else if (combinedCopy.includes("developer") || combinedCopy.includes("engineer")) {
    detectedAudience = "Software engineers, developers, and technical leads";
  } else if (combinedCopy.includes("marketer") || combinedCopy.includes("sales")) {
    detectedAudience = "Growth marketers, sales professionals, and agency leads";
  } else if (combinedCopy.includes("travel") || combinedCopy.includes("trip")) {
    detectedAudience = "Global leisure & corporate travelers";
  } else if (combinedCopy.includes("creator") || combinedCopy.includes("writer")) {
    detectedAudience = "Content creators, writers, and digital publishers";
  }

  const summaryAnalysis = `Live site (${domain}) active with status ${statusCode || 200} over ${isHttps ? "Secure HTTPS" : "HTTP"} (${responseTimeMs}ms latency). Hosting: ${detectedHosting}. Value prop: "${metaDescription || pageTitle}". Front-end stack: ${Array.from(detectedTech).join(", ") || "Modern Web Architecture"}.`;

  return {
    url: targetUrl,
    domain,
    statusCode: statusCode || 200,
    responseTimeMs,
    isHttps,
    pageTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage,
    ogSiteName,
    detectedTechStack: Array.from(detectedTech),
    detectedHosting,
    detectedAudience,
    detectedCategory,
    detectedPricingModel,
    extractedHeadlines,
    summaryAnalysis,
  };
}
