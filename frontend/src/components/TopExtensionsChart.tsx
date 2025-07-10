import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { entity } from '../../wailsjs/go/models';
import { convertBytes } from '../utils/convertBytes';

interface TopExtensionsChartProps {
  tree: entity.DirEntry;
  barCount?: number;
}

const getExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : 'no ext';
};

const TopExtensionsChart = ({ tree, barCount = 12 }: TopExtensionsChartProps) => {
  const data = useMemo(() => {
    const flatten = (entry: entity.DirEntry): entity.DirEntry[] =>
      entry.isDir ? (entry.children?.flatMap(flatten) ?? []) : [entry];

    const files = flatten(tree);
    const extMap = new Map<string, number>();
    for (const file of files) {
      const ext = getExtension(file.name);
      extMap.set(ext, (extMap.get(ext) || 0) + file.size);
    }

    return Array.from(extMap.entries())
      .map(([ext, size]) => ({ ext, size }))
      .sort((a, b) => b.size - a.size)
      .slice(0, barCount);
  }, [tree, barCount]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <XAxis type="number" tickFormatter={convertBytes} />
        <YAxis dataKey="ext" type="category" />
        <Tooltip formatter={(v) => convertBytes(v as number)} />
        <Bar dataKey="size">
          {data.map((_, idx) => (
            <Cell key={idx} fill={`hsl(${(idx * 35) % 360}deg 80% 60%)`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopExtensionsChart;
