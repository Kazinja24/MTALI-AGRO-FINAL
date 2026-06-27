import maize from "@/assets/crop-maize.jpg";
import heroImg from "@/assets/hero-products.jpg";
import { SiteLayout } from "@/components/site/Layout";
import { getBlogPosts, recordVisit, type BlogPost } from "@/lib/api";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_2, useI18n, waLink, WHATSAPP_NUMBER_2 } from "@/lib/i18n";
import { getSettingValue, useSiteSettings } from "@/lib/siteSettings";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mtali Agro Traders — Crop Nutrition for Tanzania's Growers" },
      { name: "description", content: "Premium foliar and water-soluble fertilizers from Arusha. Trusted by farmers, cooperatives and dealers across Tanzania." },
      { property: "og:title", content: "Mtali Agro Traders — Crop nutrition for Tanzania" },
      { property: "og:description", content: "Premium foliar and water-soluble fertilizers, engineered in Arusha for Tanzanian soils." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  useEffect(() => {
    recordVisit().catch(() => {})
  }, [])

  return (
    <SiteLayout>
      <Hero />
      <Marquee />
      <Manifesto />
      <Products />
      <FieldNotes />
      <Contact />
    </SiteLayout>
  );
}

/* ----------------------------- Hero ------------------------------ */
function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-ink text-primary-foreground">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Premium Victory fertilizers in a Tanzanian field" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-ink/85 via-ink/65 to-ink/30" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
        <div className="grain opacity-60" />
      </div>

      <div className="relative container-pad pt-20 pb-24 md:pt-28 md:pb-36">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8 lg:col-span-7">
            <p className="eyebrow text-primary-foreground/70">{t("hero.eyebrow")}</p>
            <h1 className="display mt-8 text-[2.75rem] sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem]">
              {t("hero.title1")}<br/>
              {t("hero.title2a")} <span className="italic text-accent">{t("hero.title2b")}</span>
            </h1>
            <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
              <p className="md:col-span-7 max-w-md text-base leading-relaxed text-primary-foreground/85">
                {t("hero.sub")}
              </p>
              <div className="md:col-span-5 flex flex-wrap items-center gap-5">
                <Link to="/products" className="btn-primary">
                  {t("cta.products")} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="link-arrow text-primary-foreground hover:text-accent">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial stat strip */}
      <div className="relative border-t border-primary-foreground/15 bg-ink/70 backdrop-blur">
        <div className="container-pad">
          <div className="bg-ink px-5 py-7 md:px-7 md:py-9">
            <div className="font-display text-base md:text-lg tracking-tight">TFRA</div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground/60">{t("stat.cert")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Marquee ---------------------------- */
function Marquee() {
  const items = ["Foliar Nutrition", "Water-Soluble Blends", "Micronutrient Programmes", "Agronomy Field Visits", "Cooperative Supply", "Drip & Fertigation"];
  return (
    <div className="overflow-hidden border-b border-border bg-background py-5">
      <div className="flex gap-12 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground animate-[scroll_40s_linear_infinite]">
        {[...items, ...items, ...items].map((x, i) => (
          <span key={i} className="flex items-center gap-12">{x} <span className="text-primary/40">✦</span></span>
        ))}
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

/* --------------------------- Manifesto --------------------------- */
function Manifesto() {
  const { t } = useI18n();
  const principles = [
    { n: "01", t: t("manifesto.p1.t"), d: t("manifesto.p1.d") },
    { n: "02", t: t("manifesto.p2.t"), d: t("manifesto.p2.d") },
    { n: "03", t: t("manifesto.p3.t"), d: t("manifesto.p3.d") },
  ];
  return (
    <section className="section-pad">
      <div className="container-pad grid gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <p className="eyebrow">{t("manifesto.eyebrow")}</p>
        </div>
        <div className="md:col-span-8">
          <p className="display text-3xl text-ink md:text-5xl">
            {t("manifesto.body")}
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {principles.map((p) => (
              <div key={p.n} className="border-t border-border pt-5">
                <span className="font-mono text-[11px] tracking-[0.2em] text-primary">{p.n}</span>
                <h4 className="mt-3 font-display text-xl text-ink">{p.t}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Products --------------------------- */
function Products() {
  const { t } = useI18n();
  return (
    <section className="section-pad">
      <div className="container-pad text-center">
        <p className="eyebrow">{t("products.catalogue")}</p>
        <h2 className="display mt-6 text-4xl text-ink md:text-6xl">{t("products.title")}</h2>
        <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">{t("products.pageSub")}</p>
        <div className="mt-10">
          <Link to="/products" className="btn-primary">{t("cta.allProducts")} <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Field Notes -------------------------- */

/* -------------------------- Field Notes -------------------------- */
function FieldNotes() {
  const { lang, t } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getBlogPosts()
      .then((data) => {
        if (!mounted) return
        setPosts(data ?? [])
      })
      .catch(() => {
        if (!mounted) return
        setPosts([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [])

  const latestPosts = posts.slice(0, 3)

  return (
    <section className="section-pad">
      <div className="container-pad">
        <div className="text-center">
          <p className="eyebrow">{t("notes.eyebrow")}</p>
          <h2 className="display mt-6 text-4xl text-ink md:text-6xl">{t("notes.title")}</h2>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">{t("notes.sub")}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((item) => (
              <div key={item} className="rounded-3xl border border-border bg-card p-6 shadow-soft animate-pulse" />
            ))
          ) : latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <article key={post.id} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <div className="aspect-16/10 overflow-hidden bg-muted">
                  <img src={post.cover_image_url || maize} alt={post.title_en} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{post.category || t("category.general")}</span>
                  <h3 className="mt-3 font-display text-xl font-bold text-foreground group-hover:text-primary">{lang === "en" ? post.title_en : post.title_sw || post.title_en}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{lang === "en" ? post.excerpt_en || post.body_en.slice(0, 120) : post.excerpt_sw || post.body_sw || post.body_en.slice(0, 120)}</p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <Link to="/blog" className="text-sm font-semibold text-primary">{t("blog.read")} <ArrowUpRight className="inline-block h-4 w-4" /></Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-secondary/30 p-12 text-center">
              <p className="text-lg font-semibold text-foreground">{t("blog.noPosts")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("blog.noPostsSub")}</p>
              <div className="mt-6">
                <Link to="/blog" className="btn-primary">{t("cta.allNotes")} <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Contact --------------------------- */
function Contact() {
  const { t } = useI18n();
  const settings = useSiteSettings();
  const contactPhone = getSettingValue(settings, "contact.phone", CONTACT_PHONE);
  const contactPhoneAlt = CONTACT_PHONE_2;
  const items = [
    { l: t("contactSec.hq"), v: getSettingValue(settings, "contact.hqAddr", t("contactSec.hqAddr")) },
    { l: t("contactSec.phone"), v: `${contactPhone}\n${contactPhoneAlt}` },
    { l: t("contactSec.email"), v: getSettingValue(settings, "contact.email", CONTACT_EMAIL) },
    { l: t("contactSec.hours"), v: getSettingValue(settings, "contact.hours", t("contactSec.hoursVal")) },
  ];

  return (
    <section className="section-pad">
      <div className="container-pad grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7">
          <p className="eyebrow">{t("contactSec.eyebrow")}</p>
          <h2 className="display mt-6 text-4xl text-ink md:text-6xl lg:text-7xl">
            {t("contactSec.title1")}<br/>
            <span className="italic text-primary/85">{t("contactSec.title2")}</span>
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            {t("contactSec.body")}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/contact" className="btn-primary">{t("cta.inquire")} <ArrowUpRight className="h-4 w-4" /></Link>
            <a href={waLink(undefined, `Habari Mtali Agro, ningependa habari zaidi.`)} target="_blank" rel="noopener noreferrer" className="link-arrow text-primary-foreground hover:text-accent">
              <MessageCircle className="h-4 w-4" /> WhatsApp {contactPhone}
            </a>
            <a href={waLink(WHATSAPP_NUMBER_2, `Habari Mtali Agro, ningependa habari zaidi.`)} target="_blank" rel="noopener noreferrer" className="link-arrow text-primary-foreground hover:text-accent">
              <MessageCircle className="h-4 w-4" /> WhatsApp {contactPhoneAlt}
            </a>
          </div>
        </div>

        <div className="md:col-span-5 md:pt-4">
          <dl className="space-y-8">
            {items.map((x) => (
              <div key={x.l} className="border-t border-border pt-5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{x.l}</dt>
                <dd className="mt-2 whitespace-pre-line font-display text-xl text-ink">{x.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

