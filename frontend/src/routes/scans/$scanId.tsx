import { createFileRoute } from "@tanstack/react-router";
import { GetScan } from "../../../wailsjs/go/scan/API";
import FolderExplorer from "../../components/explorer/FolderExplorer";

// Utility function to format elapsed time
const formatElapsedTime = (nanoseconds: number) => {
    const milliseconds = Math.floor((nanoseconds / 1e6) % 1000);
    const microseconds = Math.floor((nanoseconds / 1e3) % 1000);
    const seconds = Math.floor((nanoseconds / 1e9) % 60);
    const minutes = Math.floor((nanoseconds / (1e9 * 60)) % 60);
    const hours = Math.floor((nanoseconds / (1e9 * 60 * 60)) % 24);

    return [
        hours > 0 ? `${hours}h` : null,
        minutes > 0 ? `${minutes}m` : null,
        `${seconds}s`,
        `${milliseconds}ms`,
        `${microseconds}µs`
    ].filter(Boolean).join(" ");
};

const ScanId = () => {
    const tree = Route.useLoaderData();
  
    return (
      <div className="flex h-full flex-col gap-5 p-5 overflow-scroll">
        <div className="flex flex-col gap-2.5 justify-between">
          <h3>Scan : {tree.id}</h3>
          <div className="grid grid-cols-2 gap-2.5">
          <p className="text-sm text-neutral-500">Path : {tree.path}</p>
          <p className="text-sm text-neutral-500">Date : {new Date(tree.scanDate).toLocaleString()}</p>
          <p className="text-sm text-neutral-500">Durée du scan : {formatElapsedTime(tree.elapsed)}</p>
          <p className="text-sm text-neutral-500">Nombre de répertoires : {tree.totalDirs}</p>
          <p className="text-sm text-neutral-500">Nombre de fichiers : {tree.totalFiles}</p>
          </div>
        </div>
        {tree && <FolderExplorer tree={tree} explorerKey={tree.id} showSize={true} />}
      </div>
    );
}

export const Route = createFileRoute('/scans/$scanId')({
    component: ScanId,
    loader: async ({ params }) => {
        const entry = await GetScan(params.scanId);
        return entry;
    }
});