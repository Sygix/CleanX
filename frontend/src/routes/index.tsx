import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-5 flex flex-col gap-5">
      <div className='flex justify-between'>
      <h2>Scanner</h2>
      <p>t</p>
      </div>
      <p className='text-sm text-gray-500'>Scan your network for devices</p>
    </div>
  )
}