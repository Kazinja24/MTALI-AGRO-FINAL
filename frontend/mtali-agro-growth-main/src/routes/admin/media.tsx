import { createMediaAsset, deleteMediaAsset, getAdminMediaAssets, type MediaAsset } from '@/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Trash2, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/media')({
  head: () => ({ meta: [{ title: 'Admin - Media - Mtali Agro' }] }),
  component: MediaAdminPage,
})

function MediaAdminPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [altText, setAltText] = useState('')
  const [file, setFile] = useState<File | null>(null)

  async function loadAssets() {
    setLoading(true)
    try {
      setAssets(await getAdminMediaAssets())
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssets()
  }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !file) {
      toast.error('Title and file are required')
      return
    }
    setSaving(true)
    try {
      await createMediaAsset({ title: title.trim(), file, alt_text: altText.trim() || null })
      toast.success('Media uploaded')
      setTitle('')
      setAltText('')
      setFile(null)
      await loadAssets()
    } catch (err: any) {
      toast.error(err?.message ?? 'Could not upload media')
    } finally {
      setSaving(false)
    }
  }

  async function remove(asset: MediaAsset) {
    if (!confirm(`Delete "${asset.title}"?`)) return
    try {
      await deleteMediaAsset(asset.id)
      toast.success('Media deleted')
      await loadAssets()
    } catch (err: any) {
      toast.error(err?.message ?? 'Could not delete media')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={handleUpload} className="space-y-4 rounded-xl border border-border bg-card p-5 lg:col-span-2">
        <h2 className="text-lg font-semibold text-foreground">Upload media</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
        <input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Alt text" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
        <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
        </button>
      </form>

      <div className="lg:col-span-3">
        <h2 className="text-lg font-semibold text-foreground">Media library ({assets.length})</h2>
        {loading ? <Loader2 className="mt-6 h-5 w-5 animate-spin text-primary" /> : null}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {assets.map((asset) => (
            <article key={asset.id} className="rounded-xl border border-border bg-card p-3">
              <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                {asset.file_url ? <img src={asset.file_url} alt={asset.alt_text || asset.title} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">{asset.title}</h3>
                  <p className="truncate text-xs text-muted-foreground">{asset.file_url}</p>
                </div>
                <button onClick={() => remove(asset)} className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
