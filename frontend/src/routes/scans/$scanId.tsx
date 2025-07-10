import { createFileRoute } from '@tanstack/react-router';
import FolderExplorer from '../../components/explorer/FolderExplorer';
import { formatDuration } from '../../utils/formatDuration';
import { GetScan } from '../../../wailsjs/go/main/App';

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
  loader: async ({ params }) => {
    const entry = await GetScan(params.scanId);
    return entry;
  },
});
