import { getAdminContactMessages, getAdminProductInquiries } from '@/lib/api'
import { useI18n } from '@/lib/i18n'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type ContactMessage = {
  id: string
  name: string
  phone?: string | null
  email: string
  subject: string
  message: string
  created_at: string
}

type ProductInquiry = {
  id: string
  product: number | string
  name: string
  phone?: string | null
  email: string
  message: string
  created_at: string
}

export default function AdminInquiriesPanel() {
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [contact, setContact] = useState<ContactMessage[]>([])
  const [product, setProduct] = useState<ProductInquiry[]>([])

  useEffect(() => {
    let mounted = true

    ;(async () => {
      setLoading(true)
      try {
        const [c, p] = await Promise.all([getAdminContactMessages(), getAdminProductInquiries()])

        if (!mounted) return
        setContact(c ?? [])
        setProduct(p ?? [])
      } catch (err: any) {
        toast.error(err?.message ?? t('admin.loadInquiriesFailed'))
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">{t('admin.contactInquiries')} ({contact.length})</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          {contact.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">{t('admin.noContactInquiries')}</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3 font-semibold">{t('common.name')}</th>
                  <th className="p-3 font-semibold">{t('common.email')}</th>
                  <th className="p-3 font-semibold">{t('common.subject')}</th>
                  <th className="p-3 font-semibold">{t('common.message')}</th>
                </tr>
              </thead>
              <tbody>
                {contact.slice(0, 50).map((row) => (
                  <tr key={row.id} className="border-t border-border/60">
                    <td className="p-3">{row.name}</td>
                    <td className="p-3">{row.email}</td>
                    <td className="p-3">{row.subject}</td>
                    <td className="p-3">{row.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-foreground">{t('admin.productInquiries')} ({product.length})</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          {product.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">{t('admin.noProductInquiries')}</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3 font-semibold">{t('common.name')}</th>
                  <th className="p-3 font-semibold">{t('common.email')}</th>
                  <th className="p-3 font-semibold">{t('common.product')}</th>
                  <th className="p-3 font-semibold">{t('common.message')}</th>
                </tr>
              </thead>
              <tbody>
                {product.slice(0, 50).map((row) => (
                  <tr key={row.id} className="border-t border-border/60">
                    <td className="p-3">{row.name}</td>
                    <td className="p-3">{row.email}</td>
                    <td className="p-3">{String(row.product)}</td>
                    <td className="p-3">{row.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

