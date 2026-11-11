export const navigation = [
  { href: "/work", label: "Work" }, { href: "/blog", label: "Journal" },
  { href: "/play", label: "Play" }, { href: "/about", label: "About" },
] as const;

export const contacts = [
  { href: "mailto:miki.lombi@gmail.com", label: "Email Miki" },
  { href: "https://github.com/TheJoin95", label: "GitHub" },
  { href: "https://www.linkedin.com/in/miki-lombardi/", label: "LinkedIn" },
  { href: "/miki-lombardi-resume.pdf", label: "Download CV", detail: "PDF" },
] as const;

export function currentSection(pathname: string, href: string) {
  if (pathname === href) return "page" as const;
  if (pathname.startsWith(`${href}/`)) return "location" as const;
  return undefined;
}
