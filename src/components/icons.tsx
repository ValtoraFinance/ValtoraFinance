import {
  ArrowLeftRight,
  BookOpen,
  Briefcase,
  CircleDollarSign,
  Coins,
  FileText,
  Globe,
  Landmark,
  LifeBuoy,
  Mail,
  Network,
  Newspaper,
  Repeat,
  ShieldCheck,
  Sparkles,
  Users,
  Waypoints,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { NavItem } from "@/data/site";

export function XIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function GithubIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54v-1.9c-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.16a10.8 10.8 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.55.23 2.7.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.33-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.78.54 4.46-1.49 7.68-5.7 7.68-10.67C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  );
}

const NAV_ICONS: Record<NavItem["icon"], LucideIcon> = {
  equities: Globe,
  yield: CircleDollarSign,
  treasury: Landmark,
  rails: Zap,
  network: Network,
  bridge: Waypoints,
  convert: Repeat,
  insights: Sparkles,
  blog: Newspaper,
  learn: BookOpen,
  ecosystem: Users,
  grants: Coins,
  docs: FileText,
  trust: ShieldCheck,
  careers: Briefcase,
  team: Users,
  contact: Mail,
  token: ArrowLeftRight,
};

export function NavIcon({ name, className = "size-4" }: { name: NavItem["icon"]; className?: string }) {
  const Icon = NAV_ICONS[name] ?? LifeBuoy;
  return <Icon className={className} strokeWidth={1.6} />;
}

/** The owner's mark, served as a trimmed webp. */
export function Mark({ className = "h-7 w-auto" }: { className?: string }) {
  return <img src="/brand/valtora-mark.webp" alt="" aria-hidden="true" className={className} />;
}

/** Mark plus wordmark, used in the navbar. */
export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span className="flex items-center gap-2">
      <Mark className={`h-[22px] w-auto ${tone === "dark" ? "invert" : ""}`} />
      <span className={`text-[22px] font-medium tracking-[-0.03em] ${tone === "dark" ? "text-ink" : "text-white"}`}>
        Valtora
      </span>
    </span>
  );
}
