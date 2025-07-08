import { createFileRoute } from '@tanstack/react-router';
import Button from '../components/Button';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import FolderExplorer from '../components/Explorer/FolderExplorer';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    try {
      // Simulate a network scan
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Scan completed successfully!');
    } catch (error) {
      console.error('Error during scan:', error);
    } finally {
      setLoading(false);
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
