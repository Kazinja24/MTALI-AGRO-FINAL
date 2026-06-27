import { getAdminContactMessages, getAdminProductInquiries, getAdminProducts, getBlogPosts, getVisitCount } from '@/lib/api'
import { useI18n } from '@/lib/i18n'
import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#1B4332', '#2D6A4F', '#D4A373', '#8C6A4A', '#6B7280']

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
    </div>
  )
}

export default function DashboardOverview() {
  const { t } = useI18n()
  const [products, setProducts] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [inquiriesCountThisMonth, setInquiriesCountThisMonth] = useState(0)
  const [visitCount, setVisitCount] = useState(0)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [p, b, contact, productInquiries, visits] = await Promise.all([
          getAdminProducts(),
          getBlogPosts(),
          getAdminContactMessages(),
          getAdminProductInquiries(),
          getVisitCount(),
        ])
        if (!mounted) return
        setProducts(p ?? [])
        setPosts(b ?? [])
        setInquiriesCountThisMonth((contact?.length ?? 0) + (productInquiries?.length ?? 0))
        setVisitCount(visits ?? 0)
      } catch (err) {
        // Dashboard can render empty while the backend is unavailable.
      }
    })()
    return () => { mounted = false }
  }, [])

  const activeCount = useMemo(() => products.filter((p) => p.active).length, [products])

  const categoryDistribution = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      const key = p.category || 'Uncategorized'
      map.set(key, (map.get(key) || 0) + 1)
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [products])

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={t('admin.totalProducts')} value={products.length} />
        <Kpi label={t('admin.activeProducts')} value={activeCount} />
        <Kpi label={t('admin.websiteVisits')} value={visitCount} />
        <Kpi label={t('admin.inquiriesThisMonth')} value={inquiriesCountThisMonth} />
        <Kpi label={t('admin.publishedPosts')} value={posts.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">{t('admin.productCategories')}</h3>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" outerRadius={80} innerRadius={30}>
                  {categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground">{t('admin.recentActivity')}</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="text-sm font-medium">{products[0]?.name ?? '-'}</div>
              <div className="mt-1 text-xs text-muted-foreground">{t('admin.latestProduct')}</div>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="text-sm font-medium">{posts[0]?.title_en ?? '-'}</div>
              <div className="mt-1 text-xs text-muted-foreground">{t('admin.latestPost')}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">{t('admin.quickActions')}</h3>
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/admin/products" className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">{t('admin.addProduct')}</Link>
            <Link to="/admin/blog" className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">{t('admin.createPost')}</Link>
            <Link to="/admin/media" className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">{t('admin.uploadMedia')}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
