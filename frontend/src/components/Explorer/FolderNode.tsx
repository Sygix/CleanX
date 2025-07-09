import { IconFile, IconFolder, IconFolderFilled } from '@tabler/icons-react';
import { entity } from '../../../wailsjs/go/models';
import { convertBytes } from '../../utils/convertBytes';

const FolderNode = ({
  entry,
  level,
  expandedPaths,
  onExpand,
  showSize = false,
}: {
  entry: entity.DirEntry;
  level: number;
  expandedPaths?: string[];
  onExpand: (entry: entity.DirEntry, level: number) => void;
  showSize?: boolean;
}) => {
  if (!entry) return null;
  const isExpanded = expandedPaths ? expandedPaths[level] === entry.path : false;

  return (
    <div className="ml-4">
      <div className="flex cursor-pointer gap-2 items-center" onClick={() => onExpand(entry, level)}>
        {entry.isDir ? isExpanded ? <IconFolderFilled /> : <IconFolder /> : <IconFile />}
        <span>{entry.name || entry.path}</span>
        {showSize && (
          <span className="text-xs text-gray-500 ml-2">{convertBytes(entry.size)}</span>
        )}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderNode;
