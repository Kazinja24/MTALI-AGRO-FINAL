import { Bell, Languages, Menu } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function Header({
  email,
  onMenuClick,
}: {
  email?: string | null
  onMenuClick?: () => void
}) {
  const { lang, setLang, t } = useI18n()
  const nextLang = lang === 'en' ? 'sw' : 'en'

  return (
    <header className="border-b border-border bg-background/50 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex items-center rounded-lg p-2 hover:bg-muted md:hidden"
            aria-label={t('admin.openNav')}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">{t('admin.console')}</p>
            <h2 className="text-lg font-bold text-foreground">Mtali Agro Traders</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLang(nextLang)}
            aria-label={lang === 'en' ? t('common.switchToSwahili') : t('common.switchToEnglish')}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Languages className="h-4 w-4" />
            {lang === 'en' ? 'EN / SW' : 'SW / EN'}
          </button>
          <button className="rounded-lg p-2 hover:bg-muted">
            <Bell className="h-5 w-5 text-foreground/70" />
          </button>
          <div className="hidden items-center gap-3 md:flex">
            <div className="text-sm text-foreground/80">{email ?? t('admin.signedIn')}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
