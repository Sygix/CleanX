import { createFileRoute } from '@tanstack/react-router';
import FolderExplorer from '../components/explorer/FolderExplorer';
import { ListScans } from '../../wailsjs/go/scan/API';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/scans')({
  component: Scans,
});

function Scans() {
  const [scans, setScans] = useState<string[] | null>(null);

  const fetchScans = async () => {
    console.log('Fetching scans...');
    try {
      const data = await ListScans();
      setScans(data);
      console.log('Scans fetched:', data);
    } catch (error) {
      console.error('Error fetching scans:', error);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  return (
    <div className="flex h-full flex-col gap-5 p-5">
      <h2>Mes scans</h2>
      <div className="flex flex-col gap-2 overflow-scroll">
        {scans === null ? (
          <div className="text-gray-500">Chargement des scans...</div>
        ) : scans.length <= 0 ? (
          <div className="text-gray-500">Aucun scan trouvé.</div>
        ) : (
          scans.map((scan, index) => (
            <div key={index} className="p-2 border rounded hover:bg-gray-100">
              {scan}
            </div>
          ))
        )
      }
      </div>
    </div>
  );
}
