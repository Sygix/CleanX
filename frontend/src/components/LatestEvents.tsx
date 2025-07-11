import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ListScans, GetDeletionHistory } from '../../wailsjs/go/main/App';
import { entity } from '../../wailsjs/go/models';
import { EventsOn } from '../../wailsjs/runtime/runtime';
import { IconCheck, IconLoader, IconTrash, IconSearch } from '@tabler/icons-react';
import { convertBytes } from '../utils/convertBytes';
import formatTimestamp from '../utils/formatTimestamp';

interface Event {
  id: string;
  type: 'scan' | 'deletion';
  timestamp: string;
  status: string;
  details: string;
  path?: string;
  totalSize?: number;
}

const LatestEvents = () => {
  const [events, setEvents] = useState<Array<Event> | null>(null);

  const fetchEvents = async () => {
    try {
      const [scansData, deletionsData] = await Promise.all([
        ListScans(),
        GetDeletionHistory()
      ]);

      const scanEvents: Event[] = scansData.map((scan: entity.ScanSummary) => ({
        id: scan.id,
        type: 'scan',
        timestamp: scan.scanDate,
        status: scan.status,
        details: `Scan ${scan.id}`,
        path: scan.path,
      }));

      const deletionEvents: Event[] = deletionsData
        .filter((deletion: entity.DeletionSummary) => deletion.status === 'completed')
        .map((deletion: entity.DeletionSummary) => ({
          id: deletion.id,
          type: 'deletion',
          timestamp: deletion.completedAt || deletion.startedAt,
          status: deletion.status,
          details: `${deletion.successCount}/${deletion.totalItems} éléments supprimés`,
          totalSize: deletion.totalSize,
        }));

      const allEvents = [...scanEvents, ...deletionEvents]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5); // Show last 5 events

      setEvents(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();

    const scanStatusUnsubscribe = EventsOn(
      'scan-status-updated',
      (updatedScan: entity.ScanSummary) => {
        const newScanEvent: Event = {
          id: updatedScan.id,
          type: 'scan',
          timestamp: updatedScan.scanDate,
          status: updatedScan.status,
          details: `Scan ${updatedScan.id}`,
          path: updatedScan.path,
        };

        setEvents((prevEvents) => {
          if (!prevEvents) return [newScanEvent];
          
          const eventExists = prevEvents.some(
            (event) => event.type === 'scan' && event.id === updatedScan.id
          );

          if (eventExists) {
            return prevEvents.map((event) =>
              event.type === 'scan' && event.id === updatedScan.id
                ? { ...event, status: updatedScan.status }
                : event
            );
          } else {
            return [newScanEvent, ...prevEvents].slice(0, 5);
          }
        });
      }
    );

    const deletionCompleteUnsubscribe = EventsOn(
      'deletion-complete',
      (deletionSummary: entity.DeletionSummary) => {
        if (deletionSummary.status === 'completed') {
          const newDeletionEvent: Event = {
            id: deletionSummary.id,
            type: 'deletion',
            timestamp: deletionSummary.completedAt || deletionSummary.startedAt,
            status: deletionSummary.status,
            details: `${deletionSummary.successCount} éléments supprimés`,
            totalSize: deletionSummary.totalSize,
          };

          setEvents((prevEvents) => {
            if (!prevEvents) return [newDeletionEvent];
            return [newDeletionEvent, ...prevEvents].slice(0, 5);
          });
        }
      }
    );

    return () => {
      scanStatusUnsubscribe();
      deletionCompleteUnsubscribe();
    };
  }, []);

  const getEventIcon = (event: Event) => {
    if (event.type === 'scan') {
      return event.status === 'IN-PROGRESS' ? (
        <IconLoader className="text-blue-500 animate-spin" size={18} />
      ) : (
        <IconSearch className="text-blue-500" size={18} />
      );
    } else {
      return <IconTrash className="text-red-500" size={18} />;
    }
  };

  const getEventStatusIcon = (event: Event) => {
    if (event.status === 'COMPLETED' || event.status === 'completed') {
      return <IconCheck className="text-green-500" size={16} />;
    } else if (event.status === 'IN-PROGRESS') {
      return <IconLoader className="text-yellow-500 animate-spin" size={16} />;
    }
    return null;
  };

  return (
    <div className="flex h-full flex-col gap-5 rounded-lg bg-white/60 p-5 backdrop-blur-3xl">
      <h3>Derniers événements</h3>
      <ul className="flex flex-col gap-2 overflow-auto">
        {events === null ? (
          <li className="text-neutral-500">Chargement des événements...</li>
        ) : events.length <= 0 ? (
          <li className="text-neutral-500">Aucun événement récent.</li>
        ) : (
          events.map((event) => (
            <li key={`${event.type}-${event.id}`}>
              {event.type === 'scan' && event.status === 'COMPLETED' ? (
                <Link
                  to={`/scans/$scanId`}
                  params={{ scanId: event.id }}
                  className="hover:bg-primary-200 flex items-center gap-3 rounded-md border border-neutral-200 p-2 px-3 py-2 text-sm transition-colors duration-300 hover:border-transparent"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {getEventIcon(event)}
                    <div className="flex-1">
                      <div className="font-medium">{event.details}</div>
                      {event.totalSize && (
                        <div className="text-xs text-gray-500">
                          {convertBytes(event.totalSize)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(event.timestamp)}
                    </span>
                    {getEventStatusIcon(event)}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3 rounded-md border border-neutral-200 p-2 px-3 py-2 text-sm">
                  <div className="flex items-center gap-2 flex-1">
                    {getEventIcon(event)}
                    <div className="flex-1">
                      <div className="font-medium">{event.details}</div>
                      {event.totalSize && (
                        <div className="text-xs text-gray-500">
                          {convertBytes(event.totalSize)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(event.timestamp)}
                    </span>
                    {getEventStatusIcon(event)}
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default LatestEvents;