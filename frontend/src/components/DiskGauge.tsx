import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from 'react';
import { convertBytes } from '../utils/convertBytes';
import { entity } from '../../wailsjs/go/models';
import { GetSystemDiskUsage } from '../../wailsjs/go/main/App';

const DiskGauge = () => {
  const [stats, setStats] = useState<entity.DiskStats | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await GetSystemDiskUsage();
        setStats(res);
      } catch (err) {
        console.error('Erreur lors de la récupération du disque :', err);
      }
    };
    load();
  }, []);

  if (!stats) return null;

  const { used, total } = stats;
  const value = total > 0 ? (used / total) * 100 : 0;

  return (
    <div className="flex rounded-lg bg-white/60 p-5 pb-0 backdrop-blur-3xl">
      <CircularProgressbarWithChildren
        value={value}
        circleRatio={0.7}
        styles={buildStyles({
          rotation: 0.5 * (1 - 1.7), // center
          strokeLinecap: 'round',
          pathColor: '#337ab7',
          trailColor: '#c6dbf1',
        })}
      >
        <div className="text-3xl font-bold text-primary-600">
          {convertBytes(used)}
        </div>
        <div className="text-primary-300">
          / {convertBytes(total)}
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default DiskGauge;