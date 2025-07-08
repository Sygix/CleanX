import { IconFile, IconFolder, IconFolderFilled } from '@tabler/icons-react';
import { entity } from '../../../wailsjs/go/models';

const FolderNode = ({
  entry,
  level,
  expandedPaths,
  onExpand,
}: {
  entry: entity.DirEntry;
  level: number;
  expandedPaths: string[];
  onExpand: (entry: entity.DirEntry, level: number) => void;
}) => {
  if (!entry) return null;
  const isExpanded = expandedPaths[level] === entry.path;

  return (
    <div className="ml-4">
      <div className="flex cursor-pointer gap-2" onClick={() => onExpand(entry, level)}>
        {entry.isDir ? isExpanded ? <IconFolderFilled /> : <IconFolder /> : <IconFile />}
        {entry.name || entry.path}
      </div>
      {entry.isDir && isExpanded && entry.children && (
        <div>
          {entry.children.map(
            (child: entity.DirEntry) =>
              child.isDir && (
                <FolderNode
                  key={child.path}
                  entry={child}
                  level={level + 1}
                  expandedPaths={expandedPaths}
                  onExpand={onExpand}
                />
              )
          )}
        </div>
      )}
    </div>
  );
};

export default FolderNode;
