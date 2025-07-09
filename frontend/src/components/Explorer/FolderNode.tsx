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
}: {
  entry: entity.DirEntry;
  level: number;
  expandedPaths?: string[];
  onExpand: (entry: entity.DirEntry, level: number) => void;
  showSize?: boolean;
}) => {
  if (!entry) return null;
  const isExpanded = expandedPaths ? expandedPaths[level] === entry.path : false;
  const size = convertBytes(entry.size);
  const sizeClass = size.includes('TB') ? 'text-red-500' :
                    size.includes('GB') ? 'text-orange-500' :
                    size.includes('MB') ? 'text-yellow-500' :
                    size.includes('KB') ? 'text-green-500' :
                    size.includes('B') ? 'text-blue-500' : '';
  

  return (
    <div className="ml-4">
      <div className={clsxm(entry.isDir && "cursor-pointer", "flex gap-2 items-center")} onClick={() => onExpand(entry, level)}>
        {entry.isDir ? isExpanded ? <IconFolderFilled className={sizeClass} /> : <IconFolder className={sizeClass} /> : <IconFile className={sizeClass} />}
        <span>{entry.name || entry.path}</span>
        {showSize && (
          <span className="text-xs text-gray-500 ml-2">{size}</span>
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
