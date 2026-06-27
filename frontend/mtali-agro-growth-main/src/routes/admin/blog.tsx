import AdminBlogPanel from '@/components/admin/AdminBlogPanel'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/blog')({
  head: () => ({ meta: [{ title: 'Admin - Blog - Mtali Agro' }] }),
  component: BlogAdminPage,
})

function BlogAdminPage() {
  return <AdminBlogPanel />
}
