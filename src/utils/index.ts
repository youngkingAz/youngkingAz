export function createPageUrl(pageName: string): string {
  const safePageName = String(pageName || "").trim();

  if (!safePageName) {
    return "/";
  }

  return `/${safePageName.replace(/\s+/g, "-")}`;
}
