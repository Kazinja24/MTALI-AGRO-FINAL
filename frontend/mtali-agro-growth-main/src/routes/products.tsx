import { SectionHeader, SiteLayout } from "@/components/site/Layout";
import ProductCatalog from "@/components/site/ProductCatalog";
import { getProducts } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Foliar & Water-Soluble Fertilizers | Mtali Agro" },
      { name: "description", content: "Browse Mtali Agro's premium foliar and water-soluble fertilizers for maize, tomato, coffee, beans and more across Tanzania." },
      { property: "og:title", content: "Premium fertilizer products from Mtali Agro" },
      { property: "og:description", content: "Foliar and water-soluble nutrition for Tanzanian crops." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { t } = useI18n();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data ?? []);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="bg-secondary py-14 md:py-20">
        <div className="container-pad">
          <SectionHeader
            eyebrow={t("products.pageEyebrow")}
            title={t("products.pageTitle")}
            sub={t("products.pageSub")}
          />
        </div>
      </section>

      {/* Product Catalog Section */}
      <section className="section-pad">
        <div className="container-pad">
          <ProductCatalog products={products} loading={loading} />
        </div>
      </section>
    </SiteLayout>
  );
}
