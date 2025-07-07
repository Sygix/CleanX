import './App.css';
import { Scan } from '../wailsjs/go/main/App';
import { entity } from '../wailsjs/go/models';
import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<entity.DirEntry | null>(null);

  const handleScan = async () => {
    setLoading(true);
    try {
      const data = await Scan('/home/simon/Documents/Cours/CleanX');
      setResult(data);
    } catch (err) {
      console.error("Erreur scan:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div id="App">
          <button className="" onClick={handleScan} disabled={loading}>
            {loading ? 'Scanning...' : 'Scan Directory'}
          </button>
          {result && (
            <pre className="mt-4 text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
      </div>
    </>
  );
}

export default App;
