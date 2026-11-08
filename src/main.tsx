import React, { Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const MetallicPaint = lazy(() => import('./components/ReactBits/MetallicPaint/MetallicPaint.jsx'));
const LiquidChrome = lazy(() => import('./components/ReactBits/LiquidChrome/LiquidChrome.jsx'));

function App() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onSize = () => setMobile(mq.matches);
    const onMotion = () => setReduced(rm.matches);
    mq.addEventListener('change', onSize);
    rm.addEventListener('change', onMotion);
    return () => { mq.removeEventListener('change', onSize); rm.removeEventListener('change', onMotion); };
  }, []);
  const dpr = mobile ? Math.min(window.devicePixelRatio || 1, 1) : Math.min(window.devicePixelRatio || 1, 1.5);
  return <main className="dark">
    <header><strong>CODE_MUM</strong><span>DIGITAL · DESIGN · AI</span></header>
    <section className="hero hero--chrome" aria-label="Анимированная заставка студии">
      <div className="scene">
        <Suspense fallback={<div className="loading">Загрузка…</div>}>
          <div className="chrome-lightning">
            <div className="chrome-layer chrome-layer--background">
              <LiquidChrome color="#778594" speed={0.12} amplitude={0.14} detail={mobile ? 2 : 3} roughness={0.65} exposure={0.5} interactive={true} rippleStrength={1.35} rippleSize={mobile ? 1.3 : 1.1} tilt={1.15} maxDevicePixelRatio={mobile ? 0.55 : 0.9} />
            </div>
            <div className="chrome-layer chrome-layer--text">
              <MetallicPaint text="CODE_MUM" color="#dce7ef" backgroundColor="#000000" density={mobile ? 0.85 : 1.5} distortion={0.045} dispersion={0.2} scale={mobile ? 0.95 : 0.8} speed={0.48} dpr={mobile ? 0.8 : dpr} paused={reduced} />
            </div>
            <div className="chrome-lightning__vignette" />
          </div>
        </Suspense>
      </div>
    </section>
    <footer><span>CODE_MUM · DIGITAL STUDIO</span><span>DESIGN · DEVELOPMENT · AI</span></footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<App />);
