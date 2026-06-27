import type { BlogPost } from '@/lib/api'
import { apiFetch } from '@/lib/api'
import { useI18n } from '@/lib/i18n'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

type BlogPostAdmin = BlogPost & {
  cover_image_url?: string | null
  published_at?: string | null
  body_en: string
  body_sw?: string | null
}

export default function AdminBlogPanel() {
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<BlogPostAdmin[]>([])

  // simple create form (no edit/delete dialogs yet)
  const [titleEn, setTitleEn] = useState('')
  const [category, setCategory] = useState('Maize')
  const [excerptEn, setExcerptEn] = useState('')
  const [bodyEn, setBodyEn] = useState('')
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const canCreate = useMemo(() => titleEn.trim().length > 0 && bodyEn.trim().length > 0, [titleEn, bodyEn])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const data = await apiFetch<BlogPostAdmin[]>('/api/v1/blog/admin/')
        if (!mounted) return
        setPosts(data ?? [])
      } catch (err: any) {
        toast.error(err?.message ?? t('admin.loadPostsFailed'))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  async function reload() {
    const data = await apiFetch<BlogPostAdmin[]>('/api/v1/blog/admin/')
    setPosts(data ?? [])
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!canCreate) return

    try {
      const payload = new FormData()
      payload.append('title_en', titleEn)
      payload.append('slug', titleEn.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
      payload.append('category', category)
      payload.append('excerpt_en', excerptEn)
      payload.append('body_en', bodyEn)
      if (coverImage) payload.append('cover_image', coverImage)
      payload.append('is_published', 'true')
      payload.append('published_at', new Date().toISOString())

      await apiFetch('/api/v1/blog/admin/', {
        method: 'POST',
        body: payload,
      })

      toast.success(t('admin.postCreated'))
      setTitleEn('')
      setExcerptEn('')
      setBodyEn('')
      setCoverImage(null)
      await reload()
    } catch (err: any) {
      toast.error(err?.message ?? t('admin.createPostFailed'))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('admin.deletePostConfirm'))) return
    try {
      await apiFetch(`/api/v1/blog/admin/${id}/`, { method: 'DELETE' })
      toast.success(t('admin.postDeleted'))
      await reload()
    } catch (err: any) {
      toast.error(err?.message ?? t('admin.deletePostFailed'))
    }
  }

  if (loading) return <div className="rounded-xl border border-border bg-card p-6 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" /></div>

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={handleCreate} className="lg:col-span-2 space-y-4 rounded-3xl border border-border bg-card p-6 h-fit">
        <h2 className="font-display text-xl font-bold text-foreground">{t('admin.createPost')}</h2>

        <label className="block text-sm font-semibold text-foreground">{t('admin.titleEn')} *</label>
        <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />

        <label className="block text-sm font-semibold text-foreground">{t('common.category')}</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary">
          <option>Maize</option>
          <option>Tomato</option>
          <option>Coffee</option>
          <option>Beans</option>
          <option>Soils</option>
          <option>Application</option>
          <option>General</option>
        </select>

        <label className="block text-sm font-semibold text-foreground">{t('admin.excerptEn')}</label>
        <textarea rows={4} value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />

        <label className="block text-sm font-semibold text-foreground">{t('admin.bodyEn')} *</label>
        <textarea rows={8} value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />

        <label className="block text-sm font-semibold text-foreground">{t('admin.coverImage')}</label>
        <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />

        <button disabled={!canCreate} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-60" type="submit">
          <Plus className="h-4 w-4" /> {t('common.add')}
        </button>
      </form>

      <div className="lg:col-span-3">
        <h2 className="font-display text-xl font-bold text-foreground">{t('admin.posts')} ({posts.length})</h2>

        <div className="mt-4 space-y-3">
          {posts.length === 0 && <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{t('admin.noPosts')}</p>}

          {posts.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              {p.cover_image_url && (
                <div className="h-40 overflow-hidden bg-muted">
                  <img src={p.cover_image_url} alt={p.title_en} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-base font-bold text-foreground">{p.title_en}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{p.category} · {p.published_at ? 'Published' : 'Unpublished'}</p>
                  </div>
                  <button onClick={() => handleDelete(p.id)} className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" type="button">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{p.body_en}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

