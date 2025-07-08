import { create } from 'zustand';
import { entity } from '../../wailsjs/go/models';

type ExplorerState = {
  tree: entity.DirEntry | null;
  setTree: (tree: entity.DirEntry | null | ((prev: entity.DirEntry | null) => entity.DirEntry | null)) => void;
  expandedPaths: string[];
  setExpandedPaths: (paths: string[]) => void;
};

export const useExplorerStore = create<ExplorerState>((set) => ({
  tree: null,
  setTree: (treeOrUpdater) =>
    set((state) => ({
      tree: typeof treeOrUpdater === 'function' ? (treeOrUpdater as (prev: entity.DirEntry | null) => entity.DirEntry | null)(state.tree) : treeOrUpdater,
    })),
  expandedPaths: [],
  setExpandedPaths: (paths) => set({ expandedPaths: paths }),
}));
