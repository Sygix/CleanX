import { useMemo } from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import { entity } from '../../wailsjs/go/models';
import { convertBytes } from '../utils/convertBytes';
import clsxm from '../utils/clsxm';

interface TopFilesTreemapProps {
  tree: entity.DirEntry;
  top?: number;
  height?: number | string;
}

interface NodeProps {
  depth: number;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  value: number;
}

const TreemapContent = (props: NodeProps): JSX.Element => {
  const { depth, x, y, width, height, name, value } = props;
  const fontSize = Math.max(10, Math.min(width, height) / 8);

  const fillClass =
    depth === 1 ? 'fill-primary-600' : depth === 2 ? 'fill-primary-500' : 'fill-primary-400';

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        className={clsxm('stroke-white/5', fillClass)}
      />
      {width > 60 && height > 40 && (
        <text x={x + 6} y={y + fontSize + 6} fontSize={fontSize} fill="white" pointerEvents="none">
          {name}
          <tspan x={x + 6} y={y + fontSize * 2 + 10} fontSize={fontSize * 0.8}>
            {convertBytes(value)}
          </tspan>
        </text>
      )}
    </g>
  );
};

const TopFilesTreemap: React.FC<TopFilesTreemapProps> = ({ tree, top = 100, height = '100%' }) => {
  const data = useMemo(() => {
    const flatten = (entry: entity.DirEntry): entity.DirEntry[] =>
      entry.isDir ? (entry.children?.flatMap(flatten) ?? []) : [entry];

    return flatten(tree)
      .sort((a, b) => b.size - a.size)
      .slice(0, top)
      .map((f) => ({ name: f.name, path: f.path, value: f.size }));
  }, [tree, top]);

  if (!tree) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={data}
        dataKey="value"
        content={TreemapContent}
        aspectRatio={4 / 3}
        animationDuration={400}
      />
    </ResponsiveContainer>
  );
};

export default TopFilesTreemap;
