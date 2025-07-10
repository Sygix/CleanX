import { useEffect, useState } from 'react';
import { ListDrives } from '../../../wailsjs/go/main/App';

export function useDrives() {
  const [drives, setDrives] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ListDrives().then((d) => {
      setDrives(d);
      setLoading(false);
    });
  }, []);

  return { drives, loading };
}
