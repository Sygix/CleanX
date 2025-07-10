import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { entity } from '../../wailsjs/go/models';

interface FileSizeDistributionChartProps {
  tree: entity.DirEntry;
}

const FileSizeDistributionChart: React.FC<FileSizeDistributionChartProps> = ({ tree }) => {
  const data = useMemo(() => {
    const flatten = (entry: entity.DirEntry): entity.DirEntry[] =>
      entry.isDir ? (entry.children?.flatMap(flatten) ?? []) : [entry];

    const files = flatten(tree);

    const ranges = [
      { label: '< 10 KB', from: 0, to: 10 * 1024 },
      { label: '10–100 KB', from: 10 * 1024, to: 100 * 1024 },
      { label: '100 KB–1 MB', from: 100 * 1024, to: 1024 * 1024 },
      { label: '1–10 MB', from: 1024 * 1024, to: 10 * 1024 * 1024 },
      { label: '10–100 MB', from: 10 * 1024 * 1024, to: 100 * 1024 * 1024 },
      { label: '100 MB–1 GB', from: 100 * 1024 * 1024, to: 1024 * 1024 * 1024 },
      { label: '1–10 GB', from: 1024 * 1024 * 1024, to: 10 * 1024 * 1024 * 1024 },
      { label: '10–100 GB', from: 10 * 1024 * 1024 * 1024, to: 100 * 1024 * 1024 * 1024 },
      { label: '> 100 GB', from: 100 * 1024 * 1024 * 1024, to: Infinity },
    ];

    return ranges
      .map((range) => ({
        label: range.label,
        nombre: files.filter((f) => f.size >= range.from && f.size < range.to).length,
      }))
      .filter((d) => d.nombre > 0);
  }, [tree]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="label" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="nombre" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FileSizeDistributionChart;
