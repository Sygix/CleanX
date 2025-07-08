import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/scans')({
  component: Scans,
});

function Scans() {
  return <div className="flex h-full flex-col gap-5 p-5">
    <h2>Mes scans</h2>
    
  </div>;
}
