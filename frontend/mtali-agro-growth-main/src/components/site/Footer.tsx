import logoMacl from "@/assets/logo-macl.png";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_2, useI18n } from "@/lib/i18n";
import { getSettingValue, useSiteSettings } from "@/lib/siteSettings";
import { Link } from "@tanstack/react-router";

export function Footer() {
  const { t } = useI18n();
  const settings = useSiteSettings();
  const phone = getSettingValue(settings, "contact.phone", CONTACT_PHONE);
  const email = getSettingValue(settings, "contact.email", CONTACT_EMAIL);
  return (
    <footer className="border-t border-border bg-bone">
      <div className="container-pad pt-20 pb-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <img src={logoMacl} alt="MACL Victory" className="h-20 w-auto" />
            <p className="eyebrow mt-6">Mtali Agro Traders Co.</p>
            <h3 className="display mt-6 text-4xl text-foreground md:text-5xl">
              {t("footer.heading1")}<br/>
              <span className="text-primary/70 italic">{t("footer.heading2")}</span>
            </h3>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t("footer.navigate")}</p>
            <ul className="mt-5 space-y-3 text-sm text-foreground/80">
              <li><Link to="/products" className="hover:text-primary">{t("nav.products")}</Link></li>
              <li><Link to="/blog" className="hover:text-primary">{t("nav.blog")}</Link></li>
              <li><Link to="/contact" className="hover:text-primary">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t("footer.crops")}</p>
            <ul className="mt-5 space-y-3 text-sm text-foreground/80">
              <li>Maize · Mahindi</li>
              <li>Tomato · Nyanya</li>
              <li>Coffee · Kahawa</li>
              <li>Beans · Maharage</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t("footer.contact")}</p>
            <address className="mt-5 not-italic text-sm leading-relaxed text-foreground/80">
              Plot 21, Sokoine Road<br/>
              Arusha, Tanzania<br/>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="mt-3 block hover:text-primary">{phone}</a>
              <a href={`tel:${CONTACT_PHONE_2.replace(/\s/g, "")}`} className="mt-2 block hover:text-primary">{CONTACT_PHONE_2}</a>
              <a href={`mailto:${email}`} className="mt-3 block hover:text-primary">{email}</a>
            </address>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Mtali Agro Traders Company Ltd. {t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="font-mono uppercase tracking-[0.18em] hover:text-primary">{t("nav.admin")}</Link>
            <p className="font-mono uppercase tracking-[0.18em]">TPRI · TBS · TFRA Certified</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
