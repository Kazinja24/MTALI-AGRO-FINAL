import logoMacl from "@/assets/logo-macl.png";
import { useI18n } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", key: "nav.home" as const },
  { to: "/products", key: "nav.products" as const },
  { to: "/blog", key: "nav.blog" as const },
  { to: "/contact", key: "nav.contact" as const },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="container-pad flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link to="/" className="group flex items-center gap-3">
          <img src={logoMacl} alt="MACL Victory — Mtali Agro Traders" className="h-11 w-auto md:h-12" />
          <span className="leading-tight hidden sm:block">
            <span className="block font-display text-[15px] tracking-tight text-foreground">Mtali Agro Traders</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Est. Arusha · Tanzania</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-[13px] font-medium text-foreground/65 transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            onClick={() => setLang(lang === "en" ? "sw" : "en")}
            className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground md:inline-flex"
          >
            {lang === "en" ? "EN / SW" : "SW / EN"}
          </button>
          <Link to="/contact" className="hidden md:inline-flex btn-primary">
            {t("cta.inquire")}
          </Link>
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-pad flex flex-col py-6">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-4 font-display text-2xl text-foreground"
              >
                {t(n.key)}
              </Link>
            ))}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setLang(lang === "en" ? "sw" : "en")}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                {lang === "en" ? "Switch · Kiswahili" : "Switch · English"}
              </button>
              <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary">
                {t("cta.inquire")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
