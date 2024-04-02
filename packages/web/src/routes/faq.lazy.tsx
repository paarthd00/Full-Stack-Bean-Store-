import { createLazyFileRoute } from '@tanstack/react-router'
export const Route = createLazyFileRoute('/faq')({
  component: FAQ,
})

export default function FAQ() {
  return <>
    FAQ
  </>
}
