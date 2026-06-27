import AdminInquiriesPanel from '@/components/admin/AdminInquiriesPanel'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/inquiries')({
  head: () => ({ meta: [{ title: 'Admin - Inquiries - Mtali Agro' }] }),
  component: InquiriesAdminPage,
})

function InquiriesAdminPage() {
  return <AdminInquiriesPanel />
}
