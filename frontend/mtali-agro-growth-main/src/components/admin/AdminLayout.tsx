import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useI18n } from '@/lib/i18n'

export default function AdminLayout({
  children,
  email,
}: {
  children?: React.ReactNode
  email?: string | null
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      <div className="flex">
        <aside className="hidden w-72 shrink-0 border-r border-border bg-card p-4 md:block">
          <Sidebar />
        </aside>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-foreground/20"
              aria-label={t('admin.closeNav')}
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative h-full w-72 border-r border-border bg-card p-4 shadow-card">
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </aside>
          </div>
        ) : null}

        <div className="flex-1">
          <Header email={email} onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
