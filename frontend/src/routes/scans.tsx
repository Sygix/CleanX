import { createFileRoute } from '@tanstack/react-router';
import { useScanStore } from '../store/scanStore';
import { entity } from '../../wailsjs/go/models';
import { convertBytes } from '../utils/convertBytes';

export const Route = createFileRoute('/scans')({
  component: Scans,
});

function Scans() {
  const scanResult = useScanStore(state => state.scanResult);

  function getFiles(entry: entity.DirEntry | null): entity.DirEntry[] {
    if (!entry) return [];
    if (!entry.isDir) return [entry];
    if (!entry.children) return [];
    return entry.children.flatMap(getFiles).sort((a, b) => b.size - a.size);
  }

  const files = getFiles(scanResult);

  return <div className="flex h-full flex-col gap-5 p-5">
    <h2>Mes scans</h2>
    <ul className="list-disc pl-5">
      {files.map((file: entity.DirEntry) => (
        <li key={file.path}>{file.name} | {file.path} | {convertBytes(file.size)}</li>
      ))}
    </ul>
  </div>;
}
