import { SiteLayout } from "@/components/site/Layout";
import { useI18n } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us - Mtali Agro Traders" },
      { name: "description", content: "Mtali Agro Traders is an Arusha-based agribusiness committed to transforming Tanzanian agriculture through premium fertilizers and farmer support." },
      { property: "og:title", content: "About Mtali Agro Traders" },
      { property: "og:description", content: "Our story, mission, and commitment to Tanzania's farmers." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();

  return (
    <SiteLayout>
      <section className="section-pad">
        <div className="container-pad">
          <p className="font-display text-3xl text-foreground">About page content has been removed.</p>
          <p className="mt-4 text-sm text-muted-foreground">This page no longer displays the company story or certification details.</p>
        </div>
      </section>
    </SiteLayout>
  );
}
