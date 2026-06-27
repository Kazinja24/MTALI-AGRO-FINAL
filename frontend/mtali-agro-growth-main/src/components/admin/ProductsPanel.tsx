import { createProduct, deleteProduct, getAdminProducts, updateProductStatus } from '@/lib/api'
import { translateCategory, useI18n } from '@/lib/i18n'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ProductsPanel() {
  const { lang, t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  // form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Foliar')
  const [description, setDescription] = useState('')
  const [cropsInput, setCropsInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [featured, setFeatured] = useState(false)

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const data = await getAdminProducts()
      setProducts(data ?? [])
    } catch (err: any) {
      toast.error(err?.message ?? t('admin.loadProductsFailed'))
    } finally { setLoading(false) }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name) return toast.error(t('admin.productRequired'))
    setSaving(true)
    try {
      const crops = cropsInput.split(',').map((c) => c.trim()).filter(Boolean)
      await createProduct({ name, category, description: description || null, crops, image: imageFile, featured, active: true })
      toast.success(t('admin.productAdded'))
      setName(''); setDescription(''); setCropsInput(''); setImageFile(null); setFeatured(false)
      const fileInput = document.getElementById('product-image-input') as HTMLInputElement | null
      if (fileInput) fileInput.value = ''
      await loadProducts()
    } catch (err: any) {
      toast.error(err.message ?? t('admin.saveProductFailed'))
    } finally { setSaving(false) }
  }

  async function toggleActive(p: any) {
    try { await updateProductStatus(p.id, !p.active); await loadProducts() } catch (err: any) { toast.error(err?.message ?? t('admin.updateProductFailed')) }
  }

  async function remove(p: any) {
    if (!confirm(`${t('admin.deleteProductConfirm')} "${p.name}"`)) return
    try { await deleteProduct(p.id); toast.success(t('admin.productDeleted')); await loadProducts() } catch (err: any) { toast.error(err?.message ?? t('admin.deleteProductFailed')) }
  }

  if (loading) return <div className="rounded-xl border border-border bg-card p-6 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" /></div>

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={handleCreate} className="lg:col-span-2 space-y-4 rounded-3xl border border-border bg-card p-6 h-fit">
        <h2 className="font-display text-xl font-bold text-foreground">{t('admin.addNewProduct')}</h2>
        <label className="block text-sm font-semibold text-foreground">{t('admin.productName')} *</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />

        <label className="block text-sm font-semibold text-foreground">{t('common.category')}</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
          <option value="Foliar">{t('category.foliar')}</option>
          <option value="Soluble">{t('category.soluble')}</option>
          <option value="Nutrition">{t('category.nutrition')}</option>
        </select>

        <label className="block text-sm font-semibold text-foreground">{t('admin.shortDescription')}</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />


        <label className="block text-sm font-semibold text-foreground">{t('admin.cropsComma')}</label>
        <input value={cropsInput} onChange={(e) => setCropsInput(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder={t('products.cropsPlaceholder')} />

        <label className="block text-sm font-semibold text-foreground">{t('admin.productImage')}</label>
        <input id="product-image-input" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />

        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> {t('admin.featureHome')}</label>

        <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {saving ? t('common.saving') : t('admin.addProduct')}
        </button>
      </form>

      <div className="lg:col-span-3">
        <h2 className="font-display text-xl font-bold text-foreground">{t('admin.yourProducts')} ({products.length})</h2>
        <div className="mt-4 space-y-3">
          {products.length === 0 && <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{t('admin.noProducts')}</p>}
          {products.map((p) => (
            <article key={p.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">{p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">{t('common.noImage')}</div>}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><h3 className="truncate font-display text-base font-bold text-foreground">{p.name}</h3><p className="text-xs text-muted-foreground">{translateCategory(p.category, lang)} - {(p.crops || []).map((c: any) => translateCategory(typeof c === 'string' ? c : c.name, lang)).join(', ') || '-'}</p></div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button onClick={() => toggleActive(p)} className={`rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider ${p.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{p.active ? t('common.live') : t('common.hidden')}</button>
                    <button onClick={() => remove(p)} className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                {p.description && <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{p.description}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
