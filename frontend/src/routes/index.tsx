import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Button from '../components/Button';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import FolderExplorer from '../components/Explorer/FolderExplorer';
import { useExplorerStore } from '../store/explorerStore';
import { Scan, ScanNonRecursive } from '../../wailsjs/go/scan/API';
import { useScanStore } from '../store/scanStore';

const routePath = '/';

export const Route = createFileRoute(routePath)({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const {getExplorer, setTree} = useExplorerStore((state) => state);
  const { tree, selectedPath } = getExplorer('index');
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    try {
      if(selectedPath) {
        const res = await Scan(selectedPath);
        useScanStore.getState().setScanResult(res);
        console.log('Scan completed:', res);
      }
    } catch (error) {
      console.error('Error during scan:', error);
    } finally {
      setLoading(false);
      navigate({ to: '/scans' });
    }
  };

  useEffect(() => {
    if (tree) return;
    ScanNonRecursive(routePath).then((entry) => setTree("index", entry));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full flex-col gap-5 p-5">
      <div className="flex justify-between">
        <h2>Scanner</h2>
        <Button onClick={handleScan} disabled={loading}>
          <IconPlus />
          <span>Nouveau Scan</span>
        </Button>
      </div>
      {tree && <FolderExplorer tree={tree} explorerKey="index" />}
    </div>
  );
}
