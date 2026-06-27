import { Link } from '@tanstack/react-router';
import { Box, FileText, Home, Image, MessageCircle, Settings, Users } from 'lucide-react';
import React from 'react';
import { useI18n } from '@/lib/i18n';

const NavItem = ({ to, children, onNavigate }: { to: string; children: React.ReactNode; onNavigate?: () => void }) => (
  <Link
    to={to}
    onClick={onNavigate}
    activeProps={{ className: 'bg-muted text-primary' }}
    className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/90 hover:bg-muted"
  >
    {children}
  </Link>
)

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n()

  return (
    <nav aria-label="Admin navigation" className="space-y-2">
      <div className="px-2 py-3">
        <h3 className="text-xs font-semibold text-muted-foreground">{t('admin.operations')}</h3>
        <div className="mt-2 flex flex-col gap-1">
          <NavItem to="/admin" onNavigate={onNavigate}>
            <Home className="h-4 w-4" /> {t('admin.dashboard')}
          </NavItem>
          <NavItem to="/admin/products" onNavigate={onNavigate}>
            <Box className="h-4 w-4" /> {t('admin.products')}
          </NavItem>
          <NavItem to="/admin/inquiries" onNavigate={onNavigate}>
            <MessageCircle className="h-4 w-4" /> {t('admin.inquiries')}
          </NavItem>
          <NavItem to="/admin/blog" onNavigate={onNavigate}>
            <FileText className="h-4 w-4" /> {t('admin.blog')}
          </NavItem>
          <NavItem to="/admin/media" onNavigate={onNavigate}>
            <Image className="h-4 w-4" /> {t('admin.media')}
          </NavItem>
          <NavItem to="/admin/settings" onNavigate={onNavigate}>
            <Settings className="h-4 w-4" /> {t('admin.settings')}
          </NavItem>
        </div>
      </div>

      <div className="mt-6 px-2 py-3">
        <h3 className="text-xs font-semibold text-muted-foreground">{t('admin.administration')}</h3>
        <div className="mt-2 flex flex-col gap-1">
          <NavItem to="/admin/users" onNavigate={onNavigate}>
            <Users className="h-4 w-4" /> {t('admin.users')}
          </NavItem>
        </div>
      </div>
    </nav>
  )
}
