import { create } from 'zustand';
import { entity } from '../../wailsjs/go/models';

type ExplorerSingleState = {
  tree: entity.DirEntry | null;
  expandedPaths?: string[];
  selectedPath?: string | null;
};

type ExplorerState = {
  explorers: Record<string, ExplorerSingleState>;
  setTree: (
    key: string,
    tree: entity.DirEntry | null | ((prev: entity.DirEntry | null) => entity.DirEntry | null)
  ) => void;
  setExpandedPaths: (key: string, paths: string[]) => void;
  getExplorer: (key: string) => ExplorerSingleState;
};

export const useExplorerStore = create<ExplorerState>((set, get) => ({
  explorers: {},
  setTree: (key, treeOrUpdater) =>
    set((state) => ({
      explorers: {
        ...state.explorers,
        [key]: {
          ...state.explorers[key],
          tree:
            typeof treeOrUpdater === 'function'
              ? (treeOrUpdater as (prev: entity.DirEntry | null) => entity.DirEntry | null)(
                  state.explorers[key]?.tree ?? null
                )
              : treeOrUpdater,
        },
      },
    })),
  setExpandedPaths: (key, paths) =>
    set((state) => ({
      explorers: {
        ...state.explorers,
        [key]: {
          ...state.explorers[key],
          expandedPaths: paths,
          selectedPath:
            paths.length > 0 ? paths[paths.length - 1] : state.explorers[key]?.tree?.path || '/',
        },
      },
    })),
  getExplorer: (key) =>
    get().explorers[key] || { tree: null, expandedPaths: [], selectedPath: undefined },
}));
