import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Button from '../components/Button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import FolderExplorer from '../components/Explorer/FolderExplorer';
import { useExplorerStore } from '../store/explorerStore';
import { Scan } from '../../wailsjs/go/scan/API';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const selectedPath = useExplorerStore(state => state.selectedPath);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    try {
      if(selectedPath) {
        const res = await Scan(selectedPath);
        console.log('Scan completed:', res);
      }
    } catch (error) {
      console.error('Error during scan:', error);
    } finally {
      setLoading(false);
      navigate({ to: '/scans' });
    }
  };

  return (
    <div className="flex h-full flex-col gap-5 p-5">
      <div className="flex justify-between">
        <h2>Scanner</h2>
        <Button onClick={handleScan} disabled={loading}>
          <IconPlus />
          <span>Nouveau Scan</span>
        </Button>
      </div>
      <FolderExplorer />
    </div>
  );
}
