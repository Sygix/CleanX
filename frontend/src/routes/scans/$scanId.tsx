import { createFileRoute } from '@tanstack/react-router';
import FolderExplorer from '../../components/explorer/FolderExplorer';
import { formatDuration } from '../../utils/formatDuration';
import { GetScan } from '../../../wailsjs/go/main/App';
import * as React from 'react';

const Shimmer = () => (
  <div className="flex h-full flex-col gap-5 overflow-scroll p-5">
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-1/3 bg-neutral-300 rounded" />
      <div className="grid grid-cols-2 gap-2.5">
        <div className="h-4 bg-neutral-200 rounded col-span-1" />
        <div className="h-4 bg-neutral-200 rounded col-span-1" />
        <div className="h-4 bg-neutral-200 rounded col-span-1" />
        <div className="h-4 bg-neutral-200 rounded col-span-1" />
        <div className="h-4 bg-neutral-200 rounded col-span-1" />
      </div>
      <div className="h-64 bg-neutral-100 rounded" />
    </div>
  </div>
);

const ScanId = () => {
  const tree = Route.useLoaderData();

  return (
    <div className="flex h-full flex-col gap-5 overflow-scroll p-5">
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
