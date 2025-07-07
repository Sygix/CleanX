import './App.css';
import { Scan } from '../wailsjs/go/main/App';

function App() {
  const handleScan = async () => {
    const res = await Scan('/home/simon/Documents/Cours/CleanX');
    console.log("resultats : ", res);
  }

  return (
    <>
      <div id="App">
          <button className="" onClick={handleScan}>
            Scan
          </button>
        
      </div>
    </>
  );
}

export default App;
