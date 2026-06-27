import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackendProduct } from "@/lib/api";
import { CONTACT_PHONE, CONTACT_PHONE_2, WHATSAPP_NUMBER_2, translateCategory, useI18n, waLink } from "@/lib/i18n";
import { ChevronDown, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";

type SortOption = "name-az" | "name-za" | "category";

interface ProductCatalogProps {
  products: BackendProduct[];
  loading?: boolean;
}

export default function ProductCatalog({ products, loading = false }: ProductCatalogProps) {
  const { lang, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("name-az");
  const [selectedProduct, setSelectedProduct] = useState<BackendProduct | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Get all unique crops from products
  const allCrops = useMemo(() => {
    const crops = new Set<string>();
    products.forEach((p) => {
      p.crops.forEach((c) => crops.add(c.name));
    });
    return Array.from(crops).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query) ?? false;
        const categoryMatch = p.category.toLowerCase().includes(query);
        const cropsMatch = p.crops.some((c) => c.name.toLowerCase().includes(query));
        return nameMatch || descMatch || categoryMatch || cropsMatch;
      });
    }

    // Crop filter
    if (selectedCrops.length > 0) {
      result = result.filter((p) =>
        selectedCrops.some((selectedCrop) =>
          p.crops.some((c) => c.name === selectedCrop)
        )
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-az":
          return a.name.localeCompare(b.name);
        case "name-za":
          return b.name.localeCompare(a.name);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return result;
  }, [products, searchQuery, selectedCrops, sortBy]);

  const handleCropToggle = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCrops([]);
    setSortBy("name-az");
  };

  const hasActiveFilters = searchQuery.trim() !== "" || selectedCrops.length > 0 || sortBy !== "name-az";

  return (
    <>
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("products.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2 h-11"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Crop Filters */}
          <div className="flex flex-wrap gap-2">
            {allCrops.map((crop) => (
              <button
                key={crop}
                onClick={() => handleCropToggle(crop)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                  selectedCrops.includes(crop)
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-secondary text-foreground/70 hover:text-foreground border border-border"
                }`}
              >
                {translateCategory(crop, lang)}
              </button>
            ))}
          </div>

          {/* Sorting and Reset */}
          <div className="flex gap-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary transition"
              >
                {t("products.sortBy")}
                <ChevronDown className={`h-4 w-4 transition ${showSortMenu ? "rotate-180" : ""}`} />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg p-1">
                  {[
                    { value: "name-az" as SortOption, label: t("products.sortNameAZ") },
                    { value: "name-za" as SortOption, label: t("products.sortNameZA") },
                    { value: "category" as SortOption, label: t("products.sortCategory") },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`block w-full text-left px-3.5 py-2 text-sm rounded transition ${
                        sortBy === option.value
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="px-3.5"
              >
                {t("products.resetFilters")}
              </Button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        {searchQuery || selectedCrops.length > 0 ? (
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? t("products.result") : t("products.results")}
          </div>
        ) : null}

        {/* Products Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-border bg-card overflow-hidden h-96 animate-pulse"
              >
                <div className="aspect-square bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-20" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-12 text-center">
            <p className="text-lg font-semibold text-foreground">{t("products.noResults")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("products.tryAdjustingFilters")}</p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-4"
              >
                {t("products.resetFilters")}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-muted relative">
                  <img
                    src={
                      product.image_url ||
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3C/svg%3E"
                    }
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  {/* Category Badge */}
                  <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-earth">
                    {translateCategory(product.category, lang)}
                  </span>

                  {/* Product Name */}
                  <h3 className="font-display text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition">
                    {product.name}
                  </h3>

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  )}

                  {/* Target Crops */}
                  {product.crops.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {product.crops.slice(0, 2).map((crop) => (
                        <span
                          key={crop.id}
                          className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground/70"
                        >
                          {translateCategory(crop.name, lang)}
                        </span>
                      ))}
                      {product.crops.length > 2 && (
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground/70">
                          +{product.crops.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price and Action */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-border sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-semibold text-primary">
                      {product.price
                        ? `${t("products.from")} ${product.currency} ${Number(product.price).toLocaleString()}`
                        : t("products.inquirePrice")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={waLink(
                          `Habari Mtali Agro, ningependa habari zaidi kuhusu ${product.name}. Je, unaweza kunitumia maelezo ya kiufundi na bei?`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
                      >
                        {t("common.inquire")} {CONTACT_PHONE}
                      </a>
                      <a
                        href={waLink(WHATSAPP_NUMBER_2,
                          `Habari Mtali Agro, ningependa habari zaidi kuhusu ${product.name}. Je, unaweza kunitumia maelezo ya kiufundi na bei?`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition"
                      >
                        {t("common.inquire")} {CONTACT_PHONE_2}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
