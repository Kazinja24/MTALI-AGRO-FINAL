import { getAdminUsers, type BackendUser } from '@/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/users')({
  head: () => ({ meta: [{ title: 'Admin - Users - Mtali Agro' }] }),
  component: UsersAdminPage,
})

function UsersAdminPage() {
  const [users, setUsers] = useState<BackendUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        setUsers(await getAdminUsers())
      } catch (err: any) {
        toast.error(err?.message ?? 'Failed to load users')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {loading ? <div className="p-6"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div> : null}
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="p-3 font-semibold">Name</th>
            <th className="p-3 font-semibold">Email</th>
            <th className="p-3 font-semibold">Phone</th>
            <th className="p-3 font-semibold">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-border/60">
              <td className="p-3">{user.full_name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.phone || '-'}</td>
              <td className="p-3">{user.is_staff ? 'Admin' : 'User'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
