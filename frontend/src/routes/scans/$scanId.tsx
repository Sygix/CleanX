import { createFileRoute } from '@tanstack/react-router';
import FolderExplorer from '../../components/explorer/FolderExplorer';
import { formatDuration } from '../../utils/formatDuration';
import { GetScan } from '../../../wailsjs/go/main/App';
import * as React from 'react';
import TopFilesTreemap from '../../components/TopFilesTreeMap';
import TopExtensionsChart from '../../components/TopExtensionsChart';
import FileSizeDistributionChart from '../../components/FileSizeDistribution';
import { IconChevronDown } from '@tabler/icons-react';
import clsxm from '../../utils/clsxm';

const Shimmer = () => (
  <div className="flex h-full flex-col gap-5 overflow-auto p-5">
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-1/3 rounded bg-neutral-300" />
      <div className="grid grid-cols-2 gap-2.5">
        <div className="col-span-1 h-4 rounded bg-neutral-200" />
        <div className="col-span-1 h-4 rounded bg-neutral-200" />
        <div className="col-span-1 h-4 rounded bg-neutral-200" />
        <div className="col-span-1 h-4 rounded bg-neutral-200" />
        <div className="col-span-1 h-4 rounded bg-neutral-200" />
      </div>
      <div className="h-64 rounded bg-neutral-100" />
    </div>
  </div>
);

const ScanId = () => {
  const tree = Route.useLoaderData();
  const [expandedChart, setExpandedChart] = React.useState<string | null>(null);

  const handleChartExpand = (chartId: string) => {
    setExpandedChart((prev) => (prev === chartId ? null : chartId));
  };

  return (
    <div className="flex h-full flex-col gap-5 overflow-auto p-5">
      <div className="flex flex-col justify-between gap-2.5">
        <h3>Scan : {tree.id}</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <p className="text-sm text-neutral-500">Path : {tree.path}</p>
          <p className="text-sm text-neutral-500">
            Date : {new Date(tree.scanDate).toLocaleString()}
          </p>
          <p className="text-sm text-neutral-500">Durée du scan : {formatDuration(tree.elapsed)}</p>
          <p className="text-sm text-neutral-500">Nombre de répertoires : {tree.totalDirs}</p>
          <p className="text-sm text-neutral-500">Nombre de fichiers : {tree.totalFiles}</p>
        </div>
      </div>
      {tree && <FolderExplorer tree={tree} explorerKey={tree.id} showSize={true} />}
      {tree && (
        <div className="flex flex-col gap-2.5">
          <button
            className="hover:bg-primary-200 flex cursor-pointer items-center justify-between gap-3 rounded-md border border-neutral-200 p-2 px-3 py-2 transition-colors duration-300 hover:border-transparent"
            onClick={() => handleChartExpand('treemap')}
          >
            <span>Fichiers les plus volumineux :</span>
            <IconChevronDown
              className={clsxm(
                'transition-transform duration-300',
                expandedChart === 'treemap' && 'rotate-180'
              )}
            />
          </button>
          {expandedChart === 'treemap' && (
            <div className="min-h-56 overflow-hidden rounded-md shadow">
              <TopFilesTreemap tree={tree} top={10} />
            </div>
          )}
        </div>
      )}
      {tree && (
        <div className="flex flex-col gap-2.5">
          <button
            className="hover:bg-primary-200 flex cursor-pointer items-center justify-between gap-3 rounded-md border border-neutral-200 p-2 px-3 py-2 transition-colors duration-300 hover:border-transparent"
            onClick={() => handleChartExpand('extensions')}
          >
            <span>Extensions les plus fréquentes :</span>
            <IconChevronDown
              className={clsxm(
                'transition-transform duration-300',
                expandedChart === 'extensions' && 'rotate-180'
              )}
            />
          </button>
          {expandedChart === 'extensions' && (
            <div className="min-h-56">
              <TopExtensionsChart tree={tree} barCount={10} />
            </div>
          )}
        </div>
      )}
      {tree && (
        <div className="flex flex-col gap-2.5">
          <button
            className="hover:bg-primary-200 flex cursor-pointer items-center justify-between gap-3 rounded-md border border-neutral-200 p-2 px-3 py-2 transition-colors duration-300 hover:border-transparent"
            onClick={() => handleChartExpand('sizeDistribution')}
          >
            <span>Distribution des tailles de fichiers :</span>
            <IconChevronDown
              className={clsxm(
                'transition-transform duration-300',
                expandedChart === 'sizeDistribution' && 'rotate-180'
              )}
            />
          </button>
          {expandedChart === 'sizeDistribution' && (
            <div className="min-h-56">
              <FileSizeDistributionChart tree={tree} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/scans/$scanId')({
  component: ScanId,
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: Shimmer,
  loader: async ({ params }) => {
    const entry = await GetScan(params.scanId);
    return entry;
  },
});
