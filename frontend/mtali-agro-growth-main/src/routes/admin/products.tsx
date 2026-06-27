import { createFileRoute } from '@tanstack/react-router'
import ProductsPanel from '@/components/admin/ProductsPanel'

export const Route = createFileRoute('/admin/products')({
  head: () => ({ meta: [{ title: 'Admin — Products — Mtali Agro' }] }),
  component: ProductsAdminPage,
})

function ProductsAdminPage() {
  return <ProductsPanel />
}
