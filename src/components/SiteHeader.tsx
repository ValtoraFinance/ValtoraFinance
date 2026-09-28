"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronUp, Menu, X } from "lucide-react";
import { NAV, type NavMenu } from "@/data/site";
import { BRAND } from "@/config/brand";
import { Logo, Mark, NavIcon, XIcon, GithubIcon } from "@/components/icons";
import { CopyCaPill } from "@/components/CopyCa";
import { NavWallet } from "@/components/wallet/WalletButton";

const DARK_PREFIXES = ["/insights", "/blog", "/ecosystem", "/token", "/learn", "/terminal", "/transparency", "/roadmap"];

function useScrolled(limit = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > limit);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [limit]);
  return scrolled;
}

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const isHome = pathname === "/";
  const scrolled = useScrolled(isHome ? 60 : 4);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const dark = isHome || DARK_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  // On the home hero the bar is a full-width transparent strip; everywhere
  // else, and once the hero is scrolled past, it is a floating pill.
  const expanded = isHome && !scrolled && !mobileOpen;

  // Close menus when the route changes (adjusting state during render).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const enter = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  };

  const pillSkin = dark
    ? "bg-ink text-white shadow-[0_18px_50px_-18px_rgba(12,10,23,0.45)]"
    : "bg-white text-ink shadow-[0_18px_50px_-18px_rgba(12,10,23,0.22)]";

  return (
    <>
      {isHome ? <Announcement /> : null}
      <header
        className={`fixed inset-x-0 z-50 transition-[top] duration-500 ease-[var(--ease-soft)] ${
          expanded ? "top-12" : "top-2 md:top-3"
        }`}
      >
        <div
          className={`mx-auto transition-all duration-500 ease-[var(--ease-soft)] ${
            expanded ? "max-w-[1440px] px-4 md:px-9" : "max-w-[940px] px-2 md:px-4"
          }`}
        >
          <div
            className={`relative flex h-[58px] items-center justify-between gap-2 rounded-[10px] transition-colors duration-500 ${
              expanded ? "bg-transparent px-0 text-white" : `${pillSkin} px-3 md:px-6`
            }`}
            onMouseLeave={leave}
          >
            <Link href="/" aria-label={`${BRAND.name} home`} className="flex shrink-0 items-center">
              <span className="hidden sm:block">
                <Logo tone={dark || expanded ? "light" : "dark"} />
              </span>
              <span className="sm:hidden">
                <Mark className={`h-[22px] w-auto ${dark || expanded ? "" : "invert"}`} />
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
              {NAV.map((menu) => (
                <button
                  key={menu.label}
                  type="button"
                  onMouseEnter={() => enter(menu.label)}
                  onFocus={() => enter(menu.label)}
                  onClick={() => setOpenMenu((v) => (v === menu.label ? null : menu.label))}
                  aria-expanded={openMenu === menu.label}
                  className={`cursor-pointer rounded-md px-3.5 py-2 text-[14.5px] font-medium transition-colors ${
                    openMenu === menu.label
                      ? dark || expanded
                        ? "bg-white/12"
                        : "bg-ink/[0.06]"
                      : dark || expanded
                        ? "hover:bg-white/10"
                        : "hover:bg-ink/[0.05]"
                  }`}
                >
                  {menu.label}
                </button>
              ))}
            </nav>

            <div className="flex min-w-0 items-center gap-1.5 md:gap-2">
              <CopyCaPill tone={dark || expanded ? "dark" : "light"} />
              <span className="hidden sm:block">
                <NavWalletThemed dark={dark || expanded} />
              </span>
              <span className="sm:hidden">
                <NavWalletThemed dark={dark || expanded} compact />
              </span>
              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen((v) => !v)}
                className="grid size-9 cursor-pointer place-items-center rounded-md lg:hidden"
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>

            {openMenu ? (
              <MegaMenu
                menu={NAV.find((m) => m.label === openMenu)!}
                dark={dark || expanded}
                onEnter={() => enter(openMenu)}
                onLeave={leave}
              />
            ) : null}
          </div>
        </div>

        {mobileOpen ? <MobileMenu onClose={() => setMobileOpen(false)} /> : null}
      </header>
    </>
  );
}

function NavWalletThemed({ dark, compact = false }: { dark: boolean; compact?: boolean }) {
  // The wallet button is light on dark bars and dark on light bars.
  return (
    <span className={dark ? "" : "[&_.btn-light]:bg-ink [&_.btn-light]:text-white [&_.btn-light:hover]:bg-[#2a2838]"}>
      <NavWallet compact={compact} />
    </span>
  );
}

function Announcement() {
  return (
    <div className="absolute inset-x-0 top-0 z-40 flex h-12 items-center justify-center gap-6 bg-[#2a2c38]/70 px-4 text-[13.5px] text-white backdrop-blur-md md:text-[14.5px]">
      <p className="truncate">
        <span className="hidden sm:inline">{BRAND.symbol} is coming to Robinhood Chain. </span>
        <span className="sm:hidden">{BRAND.symbol} on Robinhood Chain</span>
        <span className="hidden md:inline">Check the contract address before you trade.</span>
      </p>
      <Link href="/token" className="flex shrink-0 items-center gap-1 font-medium hover:opacity-80">
        Learn More <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}

function MegaMenu({
  menu,
  dark,
  onEnter,
  onLeave,
}: {
  menu: NavMenu;
  dark: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const wide = menu.feature;
  const skin = dark ? "bg-ink text-white" : "bg-white text-ink shadow-[0_24px_60px_-20px_rgba(12,10,23,0.3)]";
  const hover = dark ? "hover:bg-white/[0.08]" : "hover:bg-ink/[0.05]";
  const sub = dark ? "text-white/65" : "text-mute";
  const tag = dark ? "text-white/40" : "text-soft";
  return (
    <div
      className="absolute top-[calc(100%+6px)] left-1/2 hidden -translate-x-1/2 lg:block"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={`rounded-[12px] p-4 ${skin} ${wide ? "w-[792px]" : "w-[420px]"}`}>
        <div className={wide ? "grid grid-cols-2 gap-x-6 gap-y-5" : ""}>
          {menu.groups.map((group, gi) => (
            <div key={group.label} className={wide && gi === 0 ? "" : ""}>
              <p className={`px-3 pb-2 text-[12.5px] font-medium ${sub}`}>{group.label}</p>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${hover}`}>
                      <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${dark ? "bg-white/10" : "bg-ink/[0.06]"}`}>
                        <NavIcon name={item.icon} className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-baseline gap-x-2 text-[14.5px] font-medium">
                          {item.label}
                          {item.tag ? <span className={`text-[12px] font-normal ${tag}`}>{item.tag}</span> : null}
                        </span>
                        <span className={`block text-[13px] leading-snug ${sub}`}>{item.blurb}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {wide ? (
            <div className="row-start-1 row-end-2 col-start-2 overflow-hidden rounded-xl bg-gradient-to-br from-plate via-[#1d1450] to-[#34258f]">
              <div className="relative grid h-full min-h-[160px] place-items-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,188,255,0.35),transparent_55%)]" />
                <Mark className="relative h-24 w-auto drop-shadow-[0_12px_30px_rgba(109,76,240,0.6)]" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState<string | null>("Products");
  return (
    <div className="fixed inset-x-0 top-[70px] bottom-0 z-40 overflow-y-auto bg-ink px-4 pt-3 pb-10 text-white lg:hidden">
      <div className="mb-4 rounded-xl bg-white/[0.06] p-3">
        <p className="mb-2 text-[12px] text-white/55">Contract address · {BRAND.symbol}</p>
        <CopyCaPill tone="dark" className="w-full justify-between" />
      </div>
      <ul className="divide-y divide-white/10">
        {NAV.map((menu) => (
          <li key={menu.label}>
            <button
              type="button"
              onClick={() => setOpen((v) => (v === menu.label ? null : menu.label))}
              className="flex w-full cursor-pointer items-center justify-between py-4 text-left text-[20px] font-medium"
            >
              {menu.label}
              <ChevronUp className={`size-5 transition-transform ${open === menu.label ? "" : "rotate-180"}`} />
            </button>
            {open === menu.label ? (
              <ul className="flex flex-col gap-1 pb-4">
                {menu.groups.flatMap((g) => g.items).map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} onClick={onClose} className="flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-white/[0.06]">
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/10">
                        <NavIcon name={item.icon} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-medium">{item.label}</span>
                        <span className="block text-[13px] text-white/60">{item.blurb}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center gap-3">
        <a href={BRAND.x} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} on X`} className="grid size-10 place-items-center rounded-full bg-white/10">
          <XIcon />
        </a>
        {BRAND.github && (
          <a href={BRAND.github} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} on GitHub`} className="grid size-10 place-items-center rounded-full bg-white/10">
            <GithubIcon />
          </a>
        )}
      </div>
    </div>
  );
}
