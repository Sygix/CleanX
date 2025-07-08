import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/scans')({
  component: Scans,
})

function Scans() {
  return <div className="p-2">Hello from Scans!</div>
}