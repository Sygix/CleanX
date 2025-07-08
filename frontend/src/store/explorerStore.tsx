import { create } from 'zustand';
import { entity } from '../../wailsjs/go/models';

type ExplorerState = {
  tree: entity.DirEntry | null;
  setTree: (
    tree: entity.DirEntry | null | ((prev: entity.DirEntry | null) => entity.DirEntry | null)
  ) => void;
  expandedPaths: string[];
  setExpandedPaths: (paths: string[]) => void;
  selectedPath?: string | null;
};

export const useExplorerStore = create<ExplorerState>((set) => ({
  tree: null,
  setTree: (treeOrUpdater) =>
    set((state) => ({
      tree:
        typeof treeOrUpdater === 'function'
          ? (treeOrUpdater as (prev: entity.DirEntry | null) => entity.DirEntry | null)(state.tree)
          : treeOrUpdater,
    })),
  expandedPaths: [],
  setExpandedPaths: (paths) => {
    set((state) => ({
      expandedPaths: paths,
      selectedPath: paths.length > 0 ? paths[paths.length - 1] : state.tree?.path || '/',
    }));
  },
}));
