export interface ScannedGithubData {
  owner: string;
  repo: string;
  fullName: string;
  name: string;
  description: string;
  topics: string[];
  stars: number;
  forks: number;
  openIssues: number;
  license: string;
  defaultBranch: string;
  primaryLanguage: string;
  detectedLanguages: string[];
  estimatedLinesOfCode: number;
  filesCount: number;
  hasTests: boolean;
  hasCiCd: boolean;
  hasDocker: boolean;
  detectedTechStack: string[];
  dependenciesCount: number;
  rawManifestSnippet: string;
  suggestedCategory: 'AI / Machine Learning' | 'Developer Tool' | 'SaaS' | 'Mobile App' | 'E-commerce / Marketplace' | 'API Service';
  suggestedStage: 'mvp' | 'early-traction' | 'cash-flow' | 'pre-revenue';
  architecturalBreakdown: string;
}

export async function scanGithubRepository(repoUrl: string): Promise<ScannedGithubData> {
  const regex = /github\.com\/([^\/]+)\/([^\/\?\#]+)/i;
  const match = repoUrl.trim().match(regex);

  if (!match) {
    throw new Error("Invalid GitHub URL. Please provide a link in the format https://github.com/owner/repo");
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");
  const fullName = `${owner}/${repo}`;

  const headers: Record<string, string> = {
    "User-Agent": "AIApps-Institute-Auditor",
    Accept: "application/vnd.github.v3+json",
  };

  const ghToken = process.env.GITHUB_TOKEN;
  if (ghToken) {
    headers["Authorization"] = `Bearer ${ghToken}`;
  }

  // 1. Fetch Repository Metadata
  let repoData: any = null;
  let languagesData: Record<string, number> = {};
  
  try {
    const [repoRes, langRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers, next: { revalidate: 60 } }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers, next: { revalidate: 60 } }),
    ]);

    if (repoRes.ok) {
      repoData = await repoRes.json();
    }
    if (langRes.ok) {
      languagesData = await langRes.json();
    }
  } catch (err) {
    console.warn("GitHub API metadata fetch failed, proceeding to raw inspection:", err);
  }

  const name = repoData?.name || repo;
  const description = repoData?.description || `Software repository for ${name}`;
  const topics: string[] = repoData?.topics || [];
  const stars = repoData?.stargazers_count || 0;
  const forks = repoData?.forks_count || 0;
  const openIssues = repoData?.open_issues_count || 0;
  const license = repoData?.license?.name || "Proprietary / Closed Source";
  const defaultBranch = repoData?.default_branch || "main";
  const primaryLanguage = repoData?.language || Object.keys(languagesData)[0] || "TypeScript";
  const detectedLanguages = Object.keys(languagesData).length > 0 ? Object.keys(languagesData) : [primaryLanguage];

  // 2. Fetch Manifest Files (package.json, requirements.txt, go.mod, Cargo.toml)
  const branchesToTry = [defaultBranch, "main", "master"];
  let packageJson: any = null;
  let requirementsTxt: string = "";
  let goMod: string = "";
  let cargoToml: string = "";

  for (const branch of branchesToTry) {
    if (!packageJson) {
      try {
        const pkgRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/package.json`, { headers });
        if (pkgRes.ok) {
          packageJson = await pkgRes.json();
        }
      } catch (e) {
        // continue
      }
    }

    if (!requirementsTxt) {
      try {
        const reqRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/requirements.txt`, { headers });
        if (reqRes.ok) {
          requirementsTxt = await reqRes.text();
        }
      } catch (e) {
        // continue
      }
    }

    if (!goMod) {
      try {
        const goRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/go.mod`, { headers });
        if (goRes.ok) {
          goMod = await goRes.text();
        }
      } catch (e) {
        // continue
      }
    }

    if (!cargoToml) {
      try {
        const cargoRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/Cargo.toml`, { headers });
        if (cargoRes.ok) {
          cargoToml = await cargoRes.text();
        }
      } catch (e) {
        // continue
      }
    }

    if (packageJson || requirementsTxt || goMod || cargoToml) break;
  }

  // 3. Inspect Dependencies & Detect Tech Stack
  const detectedTech = new Set<string>();
  let rawManifestSnippet = "";
  let dependenciesCount = 0;
  let hasTests = false;

  if (packageJson) {
    const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
    dependenciesCount = Object.keys(deps).length;
    const depKeys = Object.keys(deps).map(k => k.toLowerCase());

    rawManifestSnippet = `package.json [${packageJson.name || name}]: ${dependenciesCount} dependencies. Scripts: ${Object.keys(packageJson.scripts || {}).join(", ")}`;

    // Framework detection
    if (deps["next"]) detectedTech.add("Next.js 14");
    if (deps["react"]) detectedTech.add("React");
    if (deps["react-native"]) detectedTech.add("React Native");
    if (deps["expo"]) detectedTech.add("Expo");
    if (deps["vue"]) detectedTech.add("Vue");
    if (deps["nuxt"]) detectedTech.add("Nuxt");
    if (deps["svelte"] || deps["@sveltejs/kit"]) detectedTech.add("SvelteKit");
    if (deps["astro"]) detectedTech.add("Astro");
    if (deps["express"]) detectedTech.add("Express");
    if (deps["@nestjs/core"]) detectedTech.add("NestJS");
    if (deps["fastify"]) detectedTech.add("Fastify");

    // Styling
    if (deps["tailwindcss"] || depKeys.some(k => k.includes("tailwind"))) detectedTech.add("Tailwind CSS");
    if (deps["styled-components"]) detectedTech.add("Styled Components");
    if (deps["@radix-ui/react-slot"] || depKeys.some(k => k.includes("@radix-ui"))) detectedTech.add("Radix UI / Shadcn");

    // Language
    if (deps["typescript"] || depKeys.some(k => k.includes("typescript") || k.includes("@types/"))) detectedTech.add("TypeScript");
    else detectedTech.add("JavaScript");

    // AI & Machine Learning
    if (deps["@google/generative-ai"] || deps["@google/genai"]) detectedTech.add("Gemini 3.8 Flash");
    if (deps["openai"]) detectedTech.add("OpenAI API");
    if (deps["langchain"] || deps["@langchain/core"]) detectedTech.add("LangChain");
    if (deps["@anthropic-ai/sdk"]) detectedTech.add("Anthropic Claude");
    if (deps["replicate"]) detectedTech.add("Replicate AI");

    // Databases & ORMs
    if (deps["@prisma/client"] || deps["prisma"]) detectedTech.add("Prisma ORM");
    if (deps["drizzle-orm"]) detectedTech.add("Drizzle ORM");
    if (deps["@supabase/supabase-js"]) detectedTech.add("Supabase");
    if (deps["firebase"] || deps["firebase-admin"]) detectedTech.add("Firebase");
    if (deps["pg"] || deps["postgres"]) detectedTech.add("PostgreSQL");
    if (deps["ioredis"] || deps["redis"]) detectedTech.add("Redis");
    if (deps["mongoose"] || deps["mongodb"]) detectedTech.add("MongoDB");

    // Auth & Payments
    if (deps["next-auth"] || deps["@auth/core"]) detectedTech.add("NextAuth");
    if (deps["@clerk/nextjs"] || deps["@clerk/clerk-react"]) detectedTech.add("Clerk Auth");
    if (deps["stripe"] || deps["@stripe/stripe-js"]) detectedTech.add("Stripe Payments");

    // Tests
    if (depKeys.some(k => k.includes("jest") || k.includes("vitest") || k.includes("playwright") || k.includes("cypress") || k.includes("testing-library"))) {
      hasTests = true;
    }
    if (packageJson.scripts && packageJson.scripts.test && packageJson.scripts.test !== "echo \"Error: no test specified\" && exit 1") {
      hasTests = true;
    }
  }

  if (requirementsTxt) {
    const lines = requirementsTxt.toLowerCase();
    rawManifestSnippet += (rawManifestSnippet ? " | " : "") + `requirements.txt: ${lines.slice(0, 300)}`;
    dependenciesCount += requirementsTxt.split("\n").filter(l => l.trim() && !l.startsWith("#")).length;

    detectedTech.add("Python");
    if (lines.includes("fastapi")) detectedTech.add("FastAPI");
    if (lines.includes("flask")) detectedTech.add("Flask");
    if (lines.includes("django")) detectedTech.add("Django");
    if (lines.includes("google-generativeai")) detectedTech.add("Gemini 3.8 Flash");
    if (lines.includes("openai")) detectedTech.add("OpenAI API");
    if (lines.includes("langchain")) detectedTech.add("LangChain");
    if (lines.includes("torch") || lines.includes("pytorch")) detectedTech.add("PyTorch");
    if (lines.includes("tensorflow")) detectedTech.add("TensorFlow");
    if (lines.includes("sqlalchemy")) detectedTech.add("SQLAlchemy");
    if (lines.includes("pytest")) hasTests = true;
  }

  if (goMod) {
    detectedTech.add("Go (Golang)");
    rawManifestSnippet += (rawManifestSnippet ? " | " : "") + `go.mod detected`;
    if (goMod.includes("gin-gonic")) detectedTech.add("Gin Web Framework");
  }

  if (cargoToml) {
    detectedTech.add("Rust");
    rawManifestSnippet += (rawManifestSnippet ? " | " : "") + `Cargo.toml detected`;
  }

  // If tech stack is still minimal, infer from primary language
  if (detectedTech.size === 0) {
    if (primaryLanguage) detectedTech.add(primaryLanguage);
    if (detectedLanguages.includes("TypeScript")) detectedTech.add("TypeScript");
    if (detectedLanguages.includes("JavaScript")) detectedTech.add("JavaScript");
    if (detectedLanguages.includes("Python")) detectedTech.add("Python");
  }

  // 4. File Tree & Codebase Scale Estimation
  let filesCount = 35;
  let hasDocker = false;
  let hasCiCd = false;

  try {
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers });
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      if (Array.isArray(treeData.tree)) {
        filesCount = treeData.tree.length;
        const paths = treeData.tree.map((f: any) => f.path.toLowerCase());
        if (paths.some((p: string) => p.includes("docker") || p.includes("dockerfile"))) hasDocker = true;
        if (paths.some((p: string) => p.includes(".github/workflows"))) hasCiCd = true;
        if (paths.some((p: string) => p.includes(".test.") || p.includes(".spec.") || p.includes("__tests__"))) hasTests = true;
      }
    }
  } catch (e) {
    // tree fetch optional
  }

  // Calculate LOC from GitHub language bytes or file count
  const totalLangBytes = Object.values(languagesData).reduce((a, b) => a + Number(b), 0);
  const estimatedLinesOfCode = totalLangBytes > 0
    ? Math.round(totalLangBytes / 32)
    : Math.max(1200, filesCount * 85);

  // 5. Deduce Category
  let suggestedCategory: ScannedGithubData["suggestedCategory"] = "SaaS";
  const allText = `${name} ${description} ${topics.join(" ")} ${Array.from(detectedTech).join(" ")}`.toLowerCase();

  if (allText.match(/ai|llm|agent|gpt|gemini|openai|claude|prompt|machine learning|vision|deep learning/i)) {
    suggestedCategory = "AI / Machine Learning";
  } else if (allText.match(/cli|sdk|devtools|compiler|linter|api|library|framework|dev tool|debugger/i)) {
    suggestedCategory = "Developer Tool";
  } else if (allText.match(/react native|expo|ios|android|mobile app|swift|flutter/i)) {
    suggestedCategory = "Mobile App";
  } else if (allText.match(/api|microservice|webhook|endpoint/i)) {
    suggestedCategory = "API Service";
  } else if (allText.match(/store|ecommerce|checkout|cart|marketplace|shop/i)) {
    suggestedCategory = "E-commerce / Marketplace";
  }

  // 6. Deduce Stage
  let suggestedStage: ScannedGithubData["suggestedStage"] = "mvp";
  if (stars > 50 || forks > 15 || estimatedLinesOfCode > 10000) {
    suggestedStage = "early-traction";
  } else if (estimatedLinesOfCode < 2000) {
    suggestedStage = "mvp";
  }

  // 7. Architectural Breakdown Narrative
  const stackArray = Array.from(detectedTech);
  const architecturalBreakdown = `Production ${suggestedCategory} repository (${fullName}) written in ${primaryLanguage}. Stack comprises ${stackArray.join(", ")}. Codebase consists of ~${filesCount} files and an estimated ${estimatedLinesOfCode.toLocaleString()} lines of code.${hasTests ? " Automated test suite detected." : " Light test footprint."}${hasDocker ? " Containerized with Docker." : ""}${hasCiCd ? " Automated CI/CD pipeline integrated." : ""}`;

  return {
    owner,
    repo,
    fullName,
    name,
    description,
    topics,
    stars,
    forks,
    openIssues,
    license,
    defaultBranch,
    primaryLanguage,
    detectedLanguages,
    estimatedLinesOfCode,
    filesCount,
    hasTests,
    hasCiCd,
    hasDocker,
    detectedTechStack: stackArray,
    dependenciesCount: Math.max(dependenciesCount, stackArray.length * 3),
    rawManifestSnippet,
    suggestedCategory,
    suggestedStage,
    architecturalBreakdown,
  };
}
