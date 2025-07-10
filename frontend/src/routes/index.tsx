import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Button from '../components/Button';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import FolderExplorer from '../components/explorer/FolderExplorer';
import { useExplorerStore } from '../store/explorerStore';
import { Scan, ScanNonRecursive } from '../../wailsjs/go/main/App';
import { useDrives } from '../utils/hooks/useDrives';

const routePath = '/';

export const Route = createFileRoute(routePath)({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { drives, loading } = useDrives();
  const [selectedDrive, setSelectedDrive] = useState<string | null>(null);
  const { getExplorer, setTree } = useExplorerStore((state) => state);
  const { tree, selectedPath } = getExplorer('index');

  const handleScan = () => {
    try {
      if (selectedPath) {
        Scan(selectedPath);
      }
    } catch (error) {
      console.error('Error handleScan:', error);
    } finally {
      navigate({ to: '/scans' });
    }
  };

  const refreshTree = useCallback(() => {
    if (!selectedDrive) {
      console.warn('No drive selected for scanning');
      return;
    }
    ScanNonRecursive(selectedDrive).then((entry) => setTree('index', entry));
  }, [selectedDrive, setTree]);

  const handleDriveChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const drive = event.target.value;
    setSelectedDrive(drive);
    refreshTree();
  };

  useEffect(() => {
    if (tree) return;
    if (drives.length === 0) {
      console.warn('No drives available to scan');
      return;
    }
    setSelectedDrive(drives[0]);
    refreshTree();
  }, [drives, refreshTree, tree]);

  return (
    <div className="flex h-full flex-col gap-5 overflow-scroll p-5">
      <div className="flex justify-between">
        <h2>Scanner</h2>
        <div className="flex gap-5">
          <Button onClick={handleScan}>
            <IconPlus />
            <span>Nouveau Scan</span>
          </Button>
          <Button
            onClick={refreshTree}
            className="hover:bg-primary-200 bg-transparent text-neutral-800"
          >
            <IconRefresh />
          </Button>
        </div>
      </div>
      {loading ? (
        <label className='text-neutral-600 text-sm'>Chargement des disques...</label>
      ) : (
        <div className="flex flex-col gap-1.5 text-neutral-600 text-sm">
          <label htmlFor="drive-select">Disque source :</label>
          <select
            id="drive-select"
            value={selectedDrive ?? ''}
            onChange={handleDriveChange}
            disabled={loading}
            className='bg-white border border-neutral-300 rounded-md p-2.5'
          >
            {drives.map((drive) => (
              <option key={drive} value={drive}>
                {drive}
              </option>
            ))}
          </select>
        </div>
      )}
      {!loading && tree && <FolderExplorer tree={tree} explorerKey="index" showFiles={false} />}
    </div>
  );
}
