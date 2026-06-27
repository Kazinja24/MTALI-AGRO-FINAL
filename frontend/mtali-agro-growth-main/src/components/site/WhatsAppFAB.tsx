import { MessageCircle } from "lucide-react";
import { waLink, useI18n } from "@/lib/i18n";

export function WhatsAppFAB() {
  const { t } = useI18n();
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-card transition-transform hover:scale-105 md:bottom-8 md:right-8 md:h-14 md:w-14"
      aria-label={t("cta.whatsapp")}
    >
      <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
    </a>
  );
}
