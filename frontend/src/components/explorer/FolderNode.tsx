import { IconFile, IconFolder, IconFolderFilled } from '@tabler/icons-react';
import { entity } from '../../../wailsjs/go/models';
import { convertBytes } from '../../utils/convertBytes';
import clsxm from '../../utils/clsxm';

const FolderNode = ({
  entry,
  level,
  expandedPaths,
  onExpand,
  showSize = false,
  showFiles = true,
}: {
  entry: entity.DirEntry;
  level: number;
  expandedPaths?: string[];
  onExpand: (entry: entity.DirEntry, level: number) => void;
  showSize?: boolean;
  showFiles?: boolean;
}) => {
  if (!entry) return null;
  const isExpanded = expandedPaths ? expandedPaths[level] === entry.path : false;
  const size = convertBytes(entry.size);
  const sizeClass = size.includes('TB')
    ? 'text-red-500'
    : size.includes('GB')
      ? 'text-orange-500'
      : size.includes('MB')
        ? 'text-yellow-500'
        : size.includes('KB')
          ? 'text-green-500'
          : size.includes('B')
            ? 'text-blue-500'
            : '';

  if (!showFiles && !entry.isDir) return null;
  return (
    <div className="ml-4">
      <div
        className={clsxm(entry.isDir && 'cursor-pointer', 'flex items-center gap-2')}
        onClick={() => onExpand(entry, level)}
      >
        {entry.isDir ? (
          isExpanded ? (
            <IconFolderFilled className={clsxm(showSize && sizeClass)} />
          ) : (
            <IconFolder className={clsxm(showSize && sizeClass)} />
          )
        ) : (
          <IconFile className={clsxm(showSize && sizeClass)} />
        )}
        <span>{entry.name || entry.path}</span>
        {showSize && <span className="ml-2 text-xs text-gray-500">{size}</span>}
      </div>
      {entry.isDir && isExpanded && entry.children && (
        <div>
          {entry.children.map((child: entity.DirEntry) => (
            <FolderNode
              key={child.path}
              entry={child}
              level={level + 1}
              expandedPaths={expandedPaths}
              onExpand={onExpand}
              showSize={showSize}
              showFiles={showFiles}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderNode;
