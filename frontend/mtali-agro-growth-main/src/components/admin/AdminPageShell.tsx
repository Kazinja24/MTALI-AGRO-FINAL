import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogOut } from 'lucide-react'
import { fetchMe, logoutUser } from '@/lib/api'
import AdminLayout from './AdminLayout'
import { useI18n } from '@/lib/i18n'

export default function AdminPageShell({
  children,
  heading,
  description,
}: {
  children: React.ReactNode
  heading: string
  description?: string
}) {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 10))
        const user = await fetchMe()
        if (!user) {
          navigate({ to: '/login' } as any)
          return
        }
        if (!mounted) return
        setAuthed(true)
        setEmail(user.email ?? null)
        setIsAdmin(Boolean(user.is_staff))
      } catch (err) {
        navigate({ to: '/login' } as any)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signOut() {
    await logoutUser()
    navigate({ to: '/' } as any)
  }

  if (loading) {
    return (
      <div className="section-pad container-pad flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!authed) return null

  if (!isAdmin) {
    return (
      <div className="section-pad container-pad mx-auto max-w-md text-center">
        <h1 className="display text-3xl text-foreground">{t('admin.accessRestricted')}</h1>
        <p className="mt-3 text-muted-foreground">{t('admin.accessRestrictedDesc')} ({email})</p>
        <button
          onClick={signOut}
          className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          {t('admin.signOut')}
        </button>
      </div>
    )
  }

  return (
    <AdminLayout email={email}>
      <div className="container-pad">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">{t('common.admin')}</p>
            <h1 className="display mt-2 text-3xl text-foreground">{heading}</h1>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" /> {t('admin.signOut')}
            </button>
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </AdminLayout>
  )
}
