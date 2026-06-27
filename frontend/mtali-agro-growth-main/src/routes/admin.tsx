import AdminPageShell from '@/components/admin/AdminPageShell'
import DashboardOverview from '@/components/admin/DashboardOverview'
import { useI18n } from '@/lib/i18n'
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Admin — Mtali Agro' }] }),
  component: AdminPage,
})

function AdminPage() {
  const { state } = useRouter()
  const { t } = useI18n()
  const path = state.location.pathname
  const isAdminIndex = path === '/admin' || path === '/admin/'
  const section = getSectionCopy(path, t)

  return (
    <AdminPageShell
      heading={section.heading}
      description={section.description}
    >
      {isAdminIndex ? <DashboardOverview /> : <Outlet />}
    </AdminPageShell>
  )
}

function getSectionCopy(path: string, t: (key: string) => string) {
  if (path.startsWith('/admin/products')) {
    return {
      heading: t('admin.products'),
      description: t('admin.productsDesc'),
    }
  }
  if (path.startsWith('/admin/inquiries')) {
    return {
      heading: t('admin.inquiries'),
      description: t('admin.inquiriesDesc'),
    }
  }
  if (path.startsWith('/admin/blog')) {
    return {
      heading: t('admin.blog'),
      description: t('admin.blogDesc'),
    }
  }
  if (path.startsWith('/admin/media')) {
    return {
      heading: t('admin.media'),
      description: t('admin.mediaDesc'),
    }
  }
  if (path.startsWith('/admin/settings')) {
    return {
      heading: t('admin.settings'),
      description: t('admin.settingsDesc'),
    }
  }
  if (path.startsWith('/admin/users')) {
    return {
      heading: t('admin.users'),
      description: t('admin.usersDesc'),
    }
  }
  return {
    heading: t('admin.dashboard'),
    description: t('admin.dashboardDesc'),
  }
}
