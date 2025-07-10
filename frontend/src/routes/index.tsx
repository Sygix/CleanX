import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Button from '../components/Button';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { useEffect } from 'react';
import FolderExplorer from '../components/explorer/FolderExplorer';
import { useExplorerStore } from '../store/explorerStore';
import { Scan, ScanNonRecursive } from '../../wailsjs/go/main/App';

const routePath = '/';

export const Route = createFileRoute(routePath)({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { getExplorer, setTree } = useExplorerStore((state) => state);
  const { tree, selectedPath } = getExplorer('index');

  const handleScan = () => {
    try {
      if (selectedPath) {
        Scan(selectedPath)
      }
    } catch (error) {
      console.error('Error handleScan:', error);
    } finally {
      navigate({ to: '/scans' });
    }
  };

  const refreshTree = () => {
    ScanNonRecursive(routePath).then((entry) => setTree('index', entry));
  }

  useEffect(() => {
    if (tree) return;
    refreshTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full flex-col gap-5 p-5 overflow-scroll">
      <div className="flex justify-between">
        <h2>Scanner</h2>
        <div className='flex gap-5'>
        <Button onClick={handleScan}>
          <IconPlus />
          <span>Nouveau Scan</span>
        </Button>
        <Button onClick={refreshTree} className='bg-transparent text-neutral-800 hover:bg-primary-200'>
          <IconRefresh />
        </Button>
        </div>
        
      </div>
      {tree && <FolderExplorer tree={tree} explorerKey="index" showFiles={false} />}
    </div>
  );
}
