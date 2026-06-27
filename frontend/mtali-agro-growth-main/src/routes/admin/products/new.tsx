import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/products/new')({
  head: () => ({ meta: [{ title: 'Admin — Products — Mtali Agro' }] }),
  component: NewProductRedirect,
})

function NewProductRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ to: '/admin/products' } as any)
  }, [navigate])

  return null
}
