import { useEffect, useState } from 'react';
import LoadingScreen from '@components/LoadingScreen';
import Welcome from '@components/Welcome';
import WebGL from './webgl';

function App() {
  const [isWelcomeComplete, setIsWelcomeComplete] = useState(false);


  useEffect(() => {
    WebGL()
  }, []);

  return (
    <>
      {
        !isWelcomeComplete &&
      <Welcome onComplete={() => setIsWelcomeComplete(true)} />
      }
      <div id="home"></div>
      <canvas className="webgl"></canvas>

      <input type="text" id="textarea" readOnly />
      <LoadingScreen />
    </>
  );
}

export default App;
