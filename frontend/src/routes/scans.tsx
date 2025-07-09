import { createFileRoute } from '@tanstack/react-router';
import { useScanStore } from '../store/scanStore';
import FolderExplorer from '../components/Explorer/FolderExplorer';

export const Route = createFileRoute('/scans')({
  component: Scans,
});

function Scans() {
  const scanResult = useScanStore(state => state.scanResult);

  return (
    <div className="flex h-full flex-col gap-5 p-5">
      <h2>Mes scans</h2>
      {scanResult && <FolderExplorer showSize tree={scanResult} explorerKey='scans' />}
    </div>
  );
}
