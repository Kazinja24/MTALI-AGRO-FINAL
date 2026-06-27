import { createSiteSetting, deleteSiteSetting, getAdminSettings, updateSiteSetting, type SiteSetting } from '@/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/settings')({
  head: () => ({ meta: [{ title: 'Admin - Settings - Mtali Agro' }] }),
  component: SettingsAdminPage,
})

function SettingsAdminPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [key, setKey] = useState('')
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')

  async function loadSettings() {
    setLoading(true)
    try {
      setSettings(await getAdminSettings())
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  async function addSetting(e: React.FormEvent) {
    e.preventDefault()
    if (!key.trim()) return toast.error('Setting key is required')
    try {
      await createSiteSetting({ key: key.trim(), label: label.trim() || null, value })
      toast.success('Setting added')
      setKey('')
      setLabel('')
      setValue('')
      await loadSettings()
    } catch (err: any) {
      toast.error(err?.message ?? 'Could not add setting')
    }
  }

  async function saveSetting(setting: SiteSetting, nextValue: string) {
    try {
      await updateSiteSetting(setting.id, nextValue)
      toast.success('Setting saved')
      await loadSettings()
    } catch (err: any) {
      toast.error(err?.message ?? 'Could not save setting')
    }
  }

  async function removeSetting(setting: SiteSetting) {
    if (!confirm('Delete this setting?')) return
    try {
      await deleteSiteSetting(setting.id)
      toast.success('Setting deleted')
      await loadSettings()
    } catch (err: any) {
      toast.error(err?.message ?? 'Could not delete setting')
    }
  }

  const personalDetailSettings = settings.filter((setting) => setting.key.startsWith('contact.'))
  const siteSettings = settings.filter((setting) => !setting.key.startsWith('contact.'))

  return (
    <div className="space-y-8">
      <form onSubmit={addSetting} className="grid gap-3 rounded-xl border border-border bg-card p-5 md:grid-cols-4">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="contact.phone"
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm"
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="label"
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm"
        />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="value"
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm"
        />
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      {loading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : null}

      <section className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Personal details</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Update the public contact information used across the site. These values power the contact section, footer, and support links.
          </p>
        </div>
        {personalDetailSettings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">No personal contact settings yet.</div>
        ) : (
          <div className="space-y-3">
            {personalDetailSettings.map((setting) => (
              <SettingRow key={setting.id} setting={setting} onSave={saveSetting} onDelete={removeSetting} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Site settings</h2>
          <p className="mt-2 text-sm text-muted-foreground">Manage the rest of the site configuration and reusable values for the web structure.</p>
        </div>
        {siteSettings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">No other site settings yet.</div>
        ) : (
          <div className="space-y-3">
            {siteSettings.map((setting) => (
              <SettingRow key={setting.id} setting={setting} onSave={saveSetting} onDelete={removeSetting} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function SettingRow({
  setting,
  onSave,
  onDelete,
}: {
  setting: SiteSetting
  onSave: (setting: SiteSetting, value: string) => void
  onDelete: (setting: SiteSetting) => void
}) {
  const [value, setValue] = useState(setting.value ?? '')

  return (
    <article className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[220px_1fr_auto]">
      <div>
        <h3 className="text-sm font-semibold">{setting.label || setting.key}</h3>
        <p className="text-xs text-muted-foreground">{setting.key}</p>
      </div>
      <input value={value} onChange={(e) => setValue(e.target.value)} className="rounded-xl border border-border bg-background px-4 py-3 text-sm" />
      <div className="flex gap-2">
        <button onClick={() => onSave(setting, value)} className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">
          <Save className="h-4 w-4" /> Save
        </button>
        <button type="button" onClick={() => onDelete(setting)} className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100">
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </article>
  )
}
