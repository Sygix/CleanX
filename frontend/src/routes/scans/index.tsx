import { createFileRoute, Link } from '@tanstack/react-router';
import { ListScans } from '../../../wailsjs/go/scan/API';
import { useEffect, useState } from 'react';
import { entity } from '../../../wailsjs/go/models';

export const Route = createFileRoute('/scans/')({
  component: Scans,
});

function Scans() {
  const [scans, setScans] = useState<Array<entity.ScanSummary> | null>(null);

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
      <ul className="flex flex-col gap-2 overflow-scroll">
        {scans === null ? (
          <li className="text-neutral-500">Chargement des scans...</li>
        ) : scans.length <= 0 ? (
          <li className="text-neutral-500">Aucun scan trouvé.</li>
        ) : (
          scans.map((scan, index) => (
            <li key={index}>
              <Link to={`/scans/$scanId`} params={{ scanId: scan.id }} className='flex items-center justify-between p-2 hover:bg-primary-200 gap-3 rounded-md px-6 py-3 transition-colors duration-300'>
                  <span>{scan.path}</span>
                  <span className="text-sm text-neutral-500">{new Date(scan.scanDate).toLocaleString()}</span>
              </Link>
            </li>
          ))
        )
      }
      </ul>
    </div>
  );
}
