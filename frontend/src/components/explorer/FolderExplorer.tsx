import { useCallback } from 'react';
import { entity } from '../../../wailsjs/go/models';
import FolderNode from './FolderNode';
import { useExplorerStore } from '../../store/explorerStore';
import { ScanNonRecursive } from '../../../wailsjs/go/main/App';

interface FolderExplorerProps {
  tree: entity.DirEntry;
  showSize?: boolean;
  showFiles?: boolean;
  explorerKey: string;
}

const FolderExplorer: React.FC<FolderExplorerProps> = ({ tree, showSize, showFiles, explorerKey }) => {
  const { getExplorer } = useExplorerStore((state) => state);
  const { expandedPaths = [], selectedPath } = getExplorer(explorerKey);
  const setExpandedPaths = useExplorerStore((state) => state.setExpandedPaths);
  const setTree = useExplorerStore((state) => state.setTree);

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

  if (!tree) return <div>Chargement de l'arborescence...</div>;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h5>Répertoire sélectionné :</h5>
        <p className="text-xs text-gray-500">{selectedPath}</p>
      </div>
      <FolderNode
        entry={tree}
        level={0}
        expandedPaths={expandedPaths}
        onExpand={handleExpand}
        showSize={showSize}
        showFiles={showFiles}
      />
    </div>
  );
};

export default FolderExplorer;
