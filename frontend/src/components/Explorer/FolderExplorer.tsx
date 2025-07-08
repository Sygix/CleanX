import { useEffect } from 'react';
import { ScanNonRecursive } from '../../../wailsjs/go/scan/API';
import { entity } from '../../../wailsjs/go/models';
import FolderNode from './FolderNode';
import { useExplorerStore } from '../../store/explorerStore';

const FolderExplorer = () => {
  const { tree, setTree, expandedPaths, setExpandedPaths } = useExplorerStore(state => state);

  // The path to scan is always the last in expandedPaths, or root if empty
  const scanPath =
    expandedPaths.length > 0 ? expandedPaths[expandedPaths.length - 1] : tree?.path || '/';

  useEffect(() => {
    ScanNonRecursive('/').then(setTree);
  }, []);

  const handleExpand = async (entry: entity.DirEntry, level: number) => {
    if (!entry.isDir) return;
    if (entry.children) {
      if (expandedPaths[level] === entry.path) {
        setExpandedPaths(expandedPaths.slice(0, level));
      } else {
        setExpandedPaths([...expandedPaths.slice(0, level), entry.path]);
      }
      return;
    }
    const res = await ScanNonRecursive(entry.path);
    if (!res) return;
    setTree((prevTree) => {
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
      return prevTree ? updateTree(prevTree) : null;
    });
    setExpandedPaths([...expandedPaths.slice(0, level), entry.path]);
  };

  if (!tree) return <div>Chargement de l'arborescence...</div>;
  return (
    <div className="flex flex-col gap-2 overflow-scroll">
      <div className="flex items-center gap-2">
        <h5>Choisir un répertoire à analyser :</h5>
        <p className="text-xs text-gray-500">{scanPath}</p>
      </div>
      <FolderNode entry={tree} level={0} expandedPaths={expandedPaths} onExpand={handleExpand} />
    </div>
  );
};

export default FolderExplorer;
