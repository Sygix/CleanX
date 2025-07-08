import { create } from 'zustand';
import { entity } from '../../wailsjs/go/models';

type ScanState = {
  scanResult: entity.DirEntry | null;
  setScanResult: (result: entity.DirEntry | null) => void;
};

export const useScanStore = create<ScanState>((set) => ({
  scanResult: null,
  setScanResult: (result) => set({ scanResult: result }),
}));
