import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ListScans } from '../../wailsjs/go/main/App';
import { entity } from '../../wailsjs/go/models';
import { EventsOn } from '../../wailsjs/runtime/runtime';
import { IconCheck, IconLoader } from '@tabler/icons-react';

const LatestScans = () => {
  const [scans, setScans] = useState<Array<entity.ScanSummary> | null>(null);

  const fetchScans = async () => {
    try {
      const data = await ListScans();
      const lastFive = data.slice(-5).reverse();
      setScans(lastFive);
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
            return prevScans.map((scan) =>
              scan.id === updatedScan.id ? { ...scan, status: updatedScan.status } : scan
            );
          } else {
            const newScans = [updatedScan, ...prevScans].slice(0, 5);
            return newScans;
          }
        });
      }
    );

    return () => {
      statusUpdateUnsubscribe();
    };
  }, []);

  return (
    <div className="flex h-full flex-col gap-5 rounded-lg bg-white/60 p-5 backdrop-blur-3xl">
      <h3>Derniers scans</h3>
      <ul className="flex flex-col gap-2 overflow-auto">
        {scans === null ? (
          <li className="text-neutral-500">Chargement des scans...</li>
        ) : scans.length <= 0 ? (
          <li className="text-neutral-500">Vous n'avez pas encore effectué de scan.</li>
        ) : (
          scans.map((scan, index) => (
            <li key={index}>
              <Link
                to={`/scans/$scanId`}
                disabled={scan.status !== 'COMPLETED'}
                params={{ scanId: scan.id }}
                className="hover:bg-primary-200 flex items-center justify-between gap-3 rounded-md border border-neutral-200 p-2 px-3 py-2 text-sm transition-colors duration-300 hover:border-transparent"
              >
                <span>{scan.id}</span>
                {scan.status === 'IN-PROGRESS' ? (
                  <IconLoader className="text-yellow-500" />
                ) : (
                  <IconCheck className="text-green-500" />
                )}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default LatestScans;
