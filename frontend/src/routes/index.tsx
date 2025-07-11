import { createFileRoute } from '@tanstack/react-router';
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
  const { drives, loading } = useDrives();
  const [selectedDrive, setSelectedDrive] = useState<string | null>(null);
  const { getExplorer, setTree } = useExplorerStore((state) => state);
  const { tree, selectedPath } = getExplorer('index');

  const handleScan = () => {
    if (selectedPath) {
      Scan(selectedPath);
    }
  };

  const refreshTree = useCallback(async () => {
    if (!selectedDrive) {
      console.warn('No drive selected for scanning');
      return;
    }
    try {
      const entry = await ScanNonRecursive(selectedDrive);
      setTree('index', entry);
    } catch (error) {
      console.error('Failed to refresh tree:', error);
    }
  }, [selectedDrive, setTree]);

  const handleDriveChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const drive = event.target.value;
    setSelectedDrive(drive);
  };

  useEffect(() => {
    if (tree) return;
    if (selectedDrive) {
      refreshTree();
    }
  }, [selectedDrive, refreshTree, tree]);

  useEffect(() => {
    if (drives.length > 0 && !selectedDrive) {
      setSelectedDrive(drives[0]);
    }
  }, [drives, selectedDrive]);

  return (
    <div className="flex h-full flex-col gap-5 overflow-auto p-5">
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
        <label className="text-sm text-neutral-600">Chargement des disques...</label>
      ) : (
        <div className="flex flex-col gap-1.5 text-sm text-neutral-600">
          <label htmlFor="drive-select">Disque source :</label>
          <select
            id="drive-select"
            value={selectedDrive ?? ''}
            onChange={handleDriveChange}
            disabled={loading}
            className="rounded-md border border-neutral-300 bg-white p-2.5"
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
