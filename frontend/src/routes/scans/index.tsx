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
      const sortedData = [...data].sort(
        (a, b) => new Date(b.scanDate).getTime() - new Date(a.scanDate).getTime()
      );
      setScans(sortedData);
      console.log('Scans fetched:', sortedData);
    } catch (error) {
      console.error('Error fetching scans:', error);
    }
  };

  useEffect(() => {
    fetchScans();

    const statusUpdateUnsubscribe = EventsOn(
      'scan-status-updated',
      (updatedScan: entity.ScanSummary) => {
        setScans((prevScans) => {
          if (!prevScans) return [updatedScan];
          const scanExists = prevScans.some((scan) => scan.id === updatedScan.id);

          if (scanExists) {
            return prevScans
              .map((scan) =>
                scan.id === updatedScan.id ? { ...scan, status: updatedScan.status } : scan
              )
              .sort((a, b) => new Date(b.scanDate).getTime() - new Date(a.scanDate).getTime());
          } else {
            const newScans = [updatedScan, ...prevScans];
            return newScans.sort(
              (a, b) => new Date(b.scanDate).getTime() - new Date(a.scanDate).getTime()
            );
          }
        });
      }
    );

    return () => {
      statusUpdateUnsubscribe();
    };
  }, []);

  return (
    <div className="flex h-full flex-col gap-5 p-5">
      <h2>Explorer mes scans</h2>
      <ul className="flex flex-col gap-2 overflow-auto">
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
