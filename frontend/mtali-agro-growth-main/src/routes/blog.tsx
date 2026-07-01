import beans from "@/assets/crop-beans.jpg";
import coffee from "@/assets/crop-coffee.jpg";
import maize from "@/assets/crop-maize.jpg";
import tomato from "@/assets/crop-tomato.jpg";
import { SectionHeader, SiteLayout } from "@/components/site/Layout";
import { getBlogPosts } from "@/lib/api";
import { translateCategory, useI18n, type Lang } from "@/lib/i18n";
import { sanitizePlainText, truncatePlainText } from "@/lib/text";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Farming Tips & Education - Mtali Agro" },
      {
        name: "description",
        content:
          "Practical agronomy tips, fertilizer guides and crop advice from Mtali Agro's expert team.",
      },
      { property: "og:title", content: "Farming Education from Mtali Agro" },
      {
        property: "og:description",
        content: "Articles, guides and crop-specific advice for Tanzanian farmers.",
      },
    ],
  }),
  component: BlogPage,
});

type LocalizedText = Record<Lang, string>;

type Article = {
  img: string;
  cat: string;
  title: LocalizedText;
  excerpt: LocalizedText;
};

const categoryImages: Record<string, string> = {
  Maize: maize,
  Tomato: tomato,
  Coffee: coffee,
  Beans: beans,
  General: maize,
  Application: tomato,
};

const cats = ["All", "Maize", "Tomato", "Coffee", "Beans", "General"];

function BlogPage() {
  const { lang, t } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts()
      .then((data) => {
        if (!data || data.length === 0) {
          setArticles([]);
        } else {
          const mapped: Article[] = data.map((post) => ({
            img: categoryImages[post.category] || maize,
            cat: post.category || "General",
            title: {
              en: sanitizePlainText(post.title_en),
              sw: sanitizePlainText(post.title_sw || post.title_en),
            },
            excerpt: {
              en: truncatePlainText(post.excerpt_en || post.body_en, 160),
              sw: truncatePlainText(post.excerpt_sw || post.body_sw || post.body_en, 160),
            },
          }));
          setArticles(mapped);
        }
      })
      .catch(() => {
        setArticles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = articles.filter(
    (a) =>
      (cat === "All" || a.cat === cat) && a.title[lang].toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <SiteLayout>
      <section className="bg-secondary py-14 md:py-20">
        <div className="container-pad">
          <SectionHeader eyebrow={t("blog.eyebrow")} title={t("blog.title")} sub={t("blog.sub")} />
          <div className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-soft">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("blog.search")}
              className="w-full bg-transparent py-1.5 text-sm outline-none"
            />
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70 hover:text-primary"}`}
              >
                {translateCategory(c, lang)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-pad grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <article
              key={a.title.en}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={a.img}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {translateCategory(a.cat, lang)}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-foreground group-hover:text-primary">
                  {a.title[lang]}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.excerpt[lang]}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {t("blog.read")} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
