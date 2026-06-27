import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { BackendProduct } from "@/lib/api";
import { CONTACT_PHONE, CONTACT_PHONE_2, WHATSAPP_NUMBER_2, translateCategory, useI18n, waLink } from "@/lib/i18n";
import { MessageCircle, X } from "lucide-react";

interface ProductDetailsModalProps {
  product: BackendProduct;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
}: ProductDetailsModalProps) {
  const { lang, t } = useI18n();

  // Parse NPK or formulation details from description if available
  // This is a simple parser - you can enhance this based on your data structure
  const parseFormulationDetails = (description: string | null) => {
    if (!description) return null;
    
    // Look for patterns like "NPK 20-10-10" or similar
    const npkMatch = description.match(/NPK\s*(\d+[^\d,]*\d+[^\d,]*\d+)/i);
    if (npkMatch) {
      return npkMatch[1].trim();
    }
    return null;
  };

  const formulationDetails = parseFormulationDetails(product.description);

  // Mock application guidelines - in a real app, these would come from the backend
  const applicationGuidelines = [
    {
      en: "Apply during early morning or late evening for best results",
      sw: "Tumia asubuhi mapema au jioni na kwa matokeo mazuri"
    },
    {
      en: "Ensure adequate soil moisture before application",
      sw: "Hakikisha udongo una unyevu wenye kutosha kabla ya matumizi"
    },
    {
      en: "Follow dosage recommendations based on crop type and growth stage",
      sw: "Fuata maelekezo ya kiwango kulingana na aina ya mzao na hatua ya ukuaji"
    },
    {
      en: "Mix thoroughly with water according to package instructions",
      sw: "Changanya vizuri na maji kulingana na maelekezo ya pakiti"
    }
  ];

  const benefits = [
    {
      en: "Improves crop nutrient uptake and plant vigor",
      sw: "Inaboreshwa kunywa kwa mzao na nguvu ya mmea"
    },
    {
      en: "Enhances soil health and microbial activity",
      sw: "Inaboreshwa afya ya udongo na shughuli za microbial"
    },
    {
      en: "Supports consistent and higher yields",
      sw: "Inasaidia mavuno yenye uthabiti na ya juu"
    },
    {
      en: "Reduces crop stress during critical growth periods",
      sw: "Inapunguza mkazo wa mzao wakati wa ukuaji muhimu"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-card border-border">
        {/* Close Button */}
        <DialogClose className="absolute right-4 top-4 z-50 rounded-lg bg-secondary/50 p-1.5 hover:bg-secondary transition">
          <X className="h-5 w-5" />
        </DialogClose>

        {/* Product Image */}
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={
              product.image_url ||
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23f3f4f6' width='800' height='400'/%3E%3C/svg%3E"
            }
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-earth">
                {translateCategory(product.category, lang)}
              </span>
              {product.featured && (
                <span className="inline-block rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-700">
                  {lang === "en" ? "Featured" : "Inayosongeza"}
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">{product.name}</h1>
            {product.description && (
              <p className="text-base text-muted-foreground">{product.description}</p>
            )}
          </div>

          {/* Price Section */}
          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="text-sm text-muted-foreground">{t("products.from")}</div>
            <div className="mt-1 text-2xl font-bold text-primary">
              {product.price
                ? `${product.currency} ${Number(product.price).toLocaleString()}`
                : t("products.inquirePrice")}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {lang === "en"
                ? "Contact us for volume pricing and technical support"
                : "Wasiliana nasi kwa bei ya akiseli na usaada wa kiufundi"}
            </p>
          </div>

          {/* Formulation Details */}
          {formulationDetails && (
            <div className="space-y-3">
              <h2 className="font-semibold text-foreground">{t("products.npkDetails")}</h2>
              <div className="rounded-lg border border-border bg-card p-4 font-mono text-sm text-foreground">
                {formulationDetails}
              </div>
            </div>
          )}

          {/* Target Crops */}
          {product.crops.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-foreground">{t("products.targetCrops")}</h2>
              <div className="flex flex-wrap gap-2">
                {product.crops.map((crop) => (
                  <span
                    key={crop.id}
                    className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground"
                  >
                    {translateCategory(crop.name, lang)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Application Guidelines */}
          <div className="space-y-3">
            <h2 className="font-semibold text-foreground">{t("products.applicationGuidelines")}</h2>
            <ul className="space-y-2">
              {applicationGuidelines.map((guideline, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-foreground">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <span>{lang === "en" ? guideline.en : guideline.sw}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h2 className="font-semibold text-foreground">{t("products.benefits")}</h2>
            <ul className="space-y-2">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-foreground">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-xs">
                    ✓
                  </span>
                  <span>{lang === "en" ? benefit.en : benefit.sw}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Inquiry CTA */}
          <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4">
            <h3 className="font-semibold text-foreground">{t("products.moreInfo")}</h3>
            <p className="text-sm text-muted-foreground">{t("products.contactUs")}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={waLink(undefined,
                  `Habari Mtali Agro, ningependa habari zaidi kuhusu ${product.name}. Je, unaweza kunitumia:\n- karatasi ya data ya kiufundi\n- maelekezo ya matumizi\n- bei kwa eneo langu\n- dozi inayopendekezwa kwa mazao yangu\n\nAsante!`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition"
              >
                <MessageCircle className="h-4 w-4" />
                {t("products.inquireNow")} {CONTACT_PHONE}
              </a>
              <a
                href={waLink(WHATSAPP_NUMBER_2,
                  `Habari Mtali Agro, ningependa habari zaidi kuhusu ${product.name}. Je, unaweza kunitumia:\n- karatasi ya data ya kiufundi\n- maelekezo ya matumizi\n- bei kwa eneo langu\n- dozi inayopendekezwa kwa mazao yangu\n\nAsante!`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
              >
                <MessageCircle className="h-4 w-4" />
                {t("products.inquireNow")} {CONTACT_PHONE_2}
              </a>
            </div>
          </div>

          {/* Created Date */}
          <div className="border-t border-border pt-4 text-xs text-muted-foreground">
            {lang === "en" ? "Added on" : "Imeongezwa tarehe"} {new Date(product.created_at).toLocaleDateString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
