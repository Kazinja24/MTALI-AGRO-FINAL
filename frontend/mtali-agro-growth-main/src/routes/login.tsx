import { SiteLayout } from "@/components/site/Layout";
import { loginUser, registerUser, setAccessToken } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin Sign In - Mtali Agro" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!fullName.trim()) {
          toast.error(t("login.nameRequired"));
          return;
        }

        const response = await registerUser({
          email,
          password,
          full_name: fullName.trim(),
          phone: phone.trim() || undefined,
        });
        setAccessToken(response.access, response.refresh);
        await new Promise((r) => setTimeout(r, 50));
        toast.success(t("login.created"));
      } else {
        const response = await loginUser({ email, password });
        setAccessToken(response.access, response.refresh);
        await new Promise((r) => setTimeout(r, 50));
        toast.success(t("login.welcome"));
      }
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err.message ?? t("login.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <section className="section-pad">
        <div className="container-pad mx-auto max-w-md">
          <p className="eyebrow">{t("login.area")}</p>
          <h1 className="display mt-3 text-4xl text-foreground">
            {mode === "signin" ? t("login.signIn") : t("login.createAccount")}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {mode === "signin" ? t("login.signInSub") : t("login.createSub")}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-3xl border border-border bg-card p-6">
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("login.fullName")}</label>
                <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("common.email")}</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("login.password")}</label>
              <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">{t("login.phoneOptional")}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
              </div>
            )}
            <button disabled={busy} className="w-full rounded-full gradient-cta px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 disabled:opacity-60">
              {busy ? t("login.wait") : mode === "signin" ? t("login.signIn") : t("login.createAccount")}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="w-full text-center text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground hover:text-primary"
            >
              {mode === "signin" ? t("login.firstTime") : t("login.hasAccount")}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
