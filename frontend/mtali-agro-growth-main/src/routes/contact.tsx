import { SectionHeader, SiteLayout } from "@/components/site/Layout";
import { submitContactMessage } from "@/lib/api";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_2, WHATSAPP_NUMBER_2, useI18n, waLink } from "@/lib/i18n";
import { getSettingValue, useSiteSettings } from "@/lib/siteSettings";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FormEvent, useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Mtali Agro Traders - Arusha, Tanzania" },
      { name: "description", content: "Get in touch with Mtali Agro Traders. Headquartered in Arusha, serving farmers and cooperatives across Tanzania." },
      { property: "og:title", content: "Contact Mtali Agro Traders" },
      { property: "og:description", content: "Reach our team via phone, email, WhatsApp or visit our Arusha headquarters." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await submitContactMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        subject: subject as "General" | "Sales" | "Support" | "Partnership",
        message: message.trim(),
      });
      setName("");
      setEmail("");
      setPhone("");
      setSubject("General");
      setMessage("");
      alert(t("contact.sent"));
    } catch (error: any) {
      alert(error?.message ?? t("contact.failed"));
    } finally {
      setBusy(false);
    }
  }

  const settings = useSiteSettings();
  const address = getSettingValue(settings, "contact.hqAddr", t("contactSec.hqAddr"));
  const contactPhone = getSettingValue(settings, "contact.phone", CONTACT_PHONE);
  const contactPhoneAlt = CONTACT_PHONE_2;
  const contactEmail = getSettingValue(settings, "contact.email", CONTACT_EMAIL);
  const hours = getSettingValue(settings, "contact.hours", t("contactSec.hoursVal"));

  return (
    <SiteLayout>
      <section className="bg-secondary py-14 md:py-20">
        <div className="container-pad">
          <SectionHeader eyebrow={t("nav.contact")} title={t("contact.title")} sub={t("contact.sub")} />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-pad grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <Info icon={MapPin} title={t("contactSec.hq")} lines={address.split("\n")} />
            <Info icon={Phone} title={t("contactSec.phone")} lines={[contactPhone, contactPhoneAlt]} />
            <Info icon={Mail} title={t("contactSec.email")} lines={[contactEmail]} />
            <Info icon={Clock} title={t("contactSec.hours")} lines={hours.split("\n")} />
            <div className="grid gap-3">
              <a href={waLink(undefined,
                `Habari Mtali Agro, ningependa habari zaidi. Tafadhali nifikie kwa namba yangu ${contactPhone}.`
              )} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold text-white">
                <MessageCircle className="h-4 w-4" /> {t("contact.whatsappPrimary")}
              </a>
              <a href={waLink(WHATSAPP_NUMBER_2,
                `Habari Mtali Agro, ningependa habari zaidi. Tafadhali nifikie kwa namba yangu ${contactPhoneAlt}.`
              )} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold text-white">
                <MessageCircle className="h-4 w-4" /> {t("contact.whatsappSecondary")}
              </a>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
              <iframe
                title="Mtali Agro Arusha"
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.66%2C-3.40%2C36.72%2C-3.34&amp;layer=mapnik"
                className="h-64 w-full"
                loading="lazy"
              />
            </div>
          </div>

          <form className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-10" onSubmit={handleSubmit}>
            <h3 className="font-display text-2xl font-bold text-foreground">{t("contact.formTitle")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("contact.formSub")}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("contact.name")}</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("contact.phone")}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("contact.email")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("common.subject")}</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
                  <option value="General">{t("contact.general")}</option>
                  <option value="Sales">{t("contact.sales")}</option>
                  <option value="Support">{t("contact.support")}</option>
                  <option value="Partnership">{t("contact.partnership")}</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("contact.message")}</label>
                <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
              </div>
            </div>

            <button type="submit" disabled={busy} className="mt-6 w-full rounded-full gradient-cta px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 disabled:opacity-60">
              {busy ? t("contact.sending") : t("contact.send")}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Info({ icon: Icon, title, lines }: { icon: typeof Phone; title: string; lines: string[] }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
      <div>
        <h4 className="font-display text-base font-bold text-foreground">{title}</h4>
        {lines.map((l) => <div key={l} className="text-sm text-muted-foreground">{l}</div>)}
      </div>
    </div>
  );
}
