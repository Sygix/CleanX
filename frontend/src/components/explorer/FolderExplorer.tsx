import { useCallback, useState, useMemo } from 'react';
import { IconArrowUp, IconArrowDown, IconFilter, IconMenuOrder } from '@tabler/icons-react';
import { entity } from '../../../wailsjs/go/models';
import FolderNode from './FolderNode';
import { useExplorerStore } from '../../store/explorerStore';
import { ScanNonRecursive } from '../../../wailsjs/go/main/App';
import clsxm from '../../utils/clsxm';

interface FolderExplorerProps {
  tree: entity.DirEntry;
  showSize?: boolean;
  showFiles?: boolean;
  showFilters?: boolean;
  allowDelete?: boolean;
  explorerKey: string;
}

type SizeFilter = 'none' | 'asc' | 'desc';

const ranges = [
  { label: 'Toutes les tailles', value: 'all', from: 0, to: Infinity },
  { label: '< 10 KB', value: 'under-10kb', from: 0, to: 10 * 1024 },
  { label: '10–100 KB', value: '10-100kb', from: 10 * 1024, to: 100 * 1024 },
  { label: '100 KB–1 MB', value: '100kb-1mb', from: 100 * 1024, to: 1024 * 1024 },
  { label: '1–10 MB', value: '1-10mb', from: 1024 * 1024, to: 10 * 1024 * 1024 },
  { label: '10–100 MB', value: '10-100mb', from: 10 * 1024 * 1024, to: 100 * 1024 * 1024 },
  { label: '100 MB–1 GB', value: '100mb-1gb', from: 100 * 1024 * 1024, to: 1024 * 1024 * 1024 },
  { label: '1–10 GB', value: '1-10gb', from: 1024 * 1024 * 1024, to: 10 * 1024 * 1024 * 1024 },
  { label: '10–100 GB', value: '10-100gb', from: 10 * 1024 * 1024 * 1024, to: 100 * 1024 * 1024 * 1024 },
  { label: '> 100 GB', value: 'over-100gb', from: 100 * 1024 * 1024 * 1024, to: Infinity },
];

const FolderExplorer: React.FC<FolderExplorerProps> = ({
  tree,
  showSize,
  showFiles,
  showFilters = false,
  allowDelete = false,
  explorerKey,
}) => {
  const { getExplorer } = useExplorerStore((state) => state);
  const { expandedPaths = [], selectedPath } = getExplorer(explorerKey);
  const setExpandedPaths = useExplorerStore((state) => state.setExpandedPaths);
  const setTree = useExplorerStore((state) => state.setTree);
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('desc');
  const [sizeRangeFilter, setSizeRangeFilter] = useState<string>('all');

  const handleExpand = useCallback(
    async (entry: entity.DirEntry, level: number) => {
      if (!entry.isDir) return;
      if (entry.children) {
        if (expandedPaths[level] === entry.path) {
          setExpandedPaths(explorerKey, expandedPaths.slice(0, level));
        } else {
          setExpandedPaths(explorerKey, [...expandedPaths.slice(0, level), entry.path]);
        }
        return;
      }
      const res = await ScanNonRecursive(entry.path);
      if (!res) return;
      setTree(explorerKey, (prevTree) => {
        if (!prevTree) return prevTree;
        const updateTree = (node: entity.DirEntry): entity.DirEntry => {
          if (node.path === entry.path) {
            return entity.DirEntry.createFrom({ ...node, children: res.children });
          }
          if (node.children) {
            return entity.DirEntry.createFrom({
              ...node,
              children: node.children.map(updateTree),
            });
          }
          return node;
        };
        return updateTree(prevTree);
      });
      setExpandedPaths(explorerKey, [...expandedPaths.slice(0, level), entry.path]);
    },
    [expandedPaths, explorerKey, setExpandedPaths, setTree]
  );

  const sortedTree = useMemo(() => {
    if (!tree) return tree;

    const selectedRange = ranges.find(range => range.value === sizeRangeFilter);
    
    const filterAndSortChildren = (node: entity.DirEntry): entity.DirEntry => {
      if (!node.children) return node;

      let filteredChildren = node.children;
      
      // Apply size range filter
      if (selectedRange && selectedRange.value !== 'all') {
        filteredChildren = filteredChildren.filter(child => 
          child.size >= selectedRange.from && child.size < selectedRange.to
        );
      }

      // Apply size sorting
      if (sizeFilter !== 'none') {
        filteredChildren = [...filteredChildren].sort((a, b) => {
          if (sizeFilter === 'asc') {
            return a.size - b.size;
          } else {
            return b.size - a.size;
          }
        });
      }

      return entity.DirEntry.createFrom({
        ...node,
        children: filteredChildren.map(filterAndSortChildren),
      });
    };

    return filterAndSortChildren(tree);
  }, [tree, sizeRangeFilter, sizeFilter]);

  if (!tree) return <div>Chargement de l'arborescence...</div>;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h5>Répertoire sélectionné :</h5>
        <p className="text-xs text-gray-500">{selectedPath}</p>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 p-2.5">
          <div className="flex items-center gap-2.5 text-sm">
            <IconFilter />
            <span>Filtrer par taille:</span>
            <select
              value={sizeRangeFilter}
              onChange={(e) => setSizeRangeFilter(e.target.value)}
              className="rounded-md border border-neutral-300 bg-white p-1"
            >
              {ranges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2.5 text-sm">
            <IconMenuOrder />
            <span>Trier par taille:</span>
            <button
              onClick={() => setSizeFilter('asc')}
              className={clsxm('py-1 px-2 rounded-md flex items-center gap-1', sizeFilter === 'asc'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300')}
            >
              <IconArrowUp size={16} />
              <span>Croissant</span>
            </button>
            <button
              onClick={() => setSizeFilter('desc')}
              className={clsxm('py-1 px-2 rounded-md flex items-center gap-1', sizeFilter === 'desc'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300')}
            >
              <IconArrowDown size={16} />
              <span>Décroissant</span>
            </button>
          </div>
        </div>
      )}

      <FolderNode
        entry={sortedTree}
        level={0}
        expandedPaths={expandedPaths}
        onExpand={handleExpand}
        showSize={showSize}
        showFiles={showFiles}
        allowDelete={allowDelete}
      />
    </div>
  );
};

export default FolderExplorer;
