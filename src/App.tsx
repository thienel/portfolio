import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Welcome from '@components/Welcome';
import WebGL from './webgl';
import MainPortfolio from '@components/MainPortfolio';

function App() {
  const [isWelcomeComplete, setIsWelcomeComplete] = useState(false);

  useEffect(() => {
    WebGL();
  }, []);

  return (
    <BrowserRouter>
      <div className="main-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {!isWelcomeComplete && (
                  <Welcome onComplete={() => setIsWelcomeComplete(true)} />
                )}
                <div id="home"></div>
                <canvas className="webgl"></canvas>
                <input type="text" id="textarea" readOnly />
              </>
            }
          />
          <Route path="/portfolio" element={<MainPortfolio />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
