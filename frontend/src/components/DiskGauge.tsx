import {
    CircularProgressbarWithChildren,
    buildStyles,
  } from 'react-circular-progressbar';
  import 'react-circular-progressbar/dist/styles.css';
import { convertBytes } from '../utils/convertBytes';
  
  const DiskGauge = ({ used, total }: { used: number; total: number }) => {
    const value = used / total * 100;
  
    return (
      <div className="flex rounded-lg bg-white/60 p-5 pb-0 backdrop-blur-3xl">
        <CircularProgressbarWithChildren
          value={value}
          circleRatio={0.70}
          styles={buildStyles({
            rotation: 0.5 * (1 - 1.70), // centers the gauge horizontally
            strokeLinecap: 'round',
            pathColor: '#337ab7',
            trailColor: '#c6dbf1',
          })}
        >
          <div className="text-xl font-bold text-primary-600">
            {convertBytes(used)}
          </div>
          <div className="text-xs text-primary-200">
            / {convertBytes(total)}
          </div>
        </CircularProgressbarWithChildren>
      </div>
    );
  };
  
  export default DiskGauge;