import { useEffect } from 'react';
import LoadingScreen from '@components/LoadingScreen';
import Welcome from '@components/Welcome';
import WebGL from './webgl';

function App() {
  useEffect(() => {
    WebGL()
  }, []);

  return (
    <>
      <Welcome />
      <div id="home"></div>
      <canvas className="webgl"></canvas>

      <input type="text" id="textarea" readOnly />
      <LoadingScreen />
    </>
  );
}

export default App;
