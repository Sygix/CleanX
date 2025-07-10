import { createFileRoute, Link } from '@tanstack/react-router';
import { ListScans } from '../../../wailsjs/go/main/App';
import { useEffect, useState } from 'react';
import { entity } from '../../../wailsjs/go/models';
import { EventsOn } from '../../../wailsjs/runtime/runtime';

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

    const unsubscribe = EventsOn('scan-status-updated', (updatedScan) => {
      console.log('Scan status updated:', updatedScan);
      setScans((prevScans) => {
        if (!prevScans) return prevScans;
        return prevScans.map((scan) =>
          scan.id === updatedScan.id ? { ...scan, status: updatedScan.status } : scan
        );
      });
    });

    return () => {
      unsubscribe();
    };
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
              <Link
                to={`/scans/$scanId`}
                disabled={scan.status !== 'COMPLETED'}
                params={{ scanId: scan.id }}
                className="hover:bg-primary-200 flex items-center justify-between gap-3 rounded-md p-2 px-6 py-3 transition-colors duration-300"
              >
                <span>{scan.path}</span>
                <span className="text-sm text-neutral-500">
                  {new Date(scan.scanDate).toLocaleString()}
                </span>
                <span
                  className={`text-sm ${scan.status === 'IN-PROGRESS' ? 'text-yellow-500' : 'text-green-500'}`}
                >
                  {scan.status}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
