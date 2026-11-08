import React, { Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const Silk = lazy(() => import('./components/ReactBits/Silk/Silk.jsx'));
const Lightning = lazy(() => import('./components/ReactBits/Lightning/Lightning.jsx'));
const MetallicPaint = lazy(() => import('./components/ReactBits/MetallicPaint/MetallicPaint.jsx'));
const LightRays = lazy(() => import('./components/ReactBits/LightRays/LightRays.jsx'));
const DarkVeil = lazy(() => import('./components/ReactBits/DarkVeil/DarkVeil.jsx'));
const FloatingLines = lazy(() => import('./components/ReactBits/FloatingLines/FloatingLines.jsx'));
const SideRays = lazy(() => import('./components/ReactBits/SideRays/SideRays.jsx'));
const LiquidChrome = lazy(() => import('./components/ReactBits/LiquidChrome/LiquidChrome.jsx'));
const variants = [
  { name: 'Silk', label: 'Светлая · шёлк', theme: 'light' },
  { name: 'Lightning', label: 'Тёмная · молнии', theme: 'dark' },
  { name: 'Chrome × Lightning', label: 'Хром · редкие молнии', theme: 'dark' },
  { name: 'Chrome × Light Rays', label: 'Хром · световые лучи', theme: 'dark' },
  { name: 'Chrome × Dark Veil', label: 'Хром · тёмная дымка', theme: 'dark' },
  { name: 'Chrome × Floating Lines', label: 'Хром · линии', theme: 'dark' },
  { name: 'Chrome × Side Rays', label: 'Хром · боковой свет', theme: 'dark' },
  { name: 'Chrome × Liquid Chrome', label: 'Хром · жидкий металл', theme: 'dark' }
];

function IntermittentLightning({ mobile, dpr, reduced }) {
  const [strike, setStrike] = useState(null);
  useEffect(() => {
    if (reduced) return;
    let timer;
    let cancelled = false;
    const next = () => {
      const delay = 3200 + Math.random() * 4600;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setStrike({ id: Date.now(), x: (Math.random() - 0.5) * 1.15 });
        timer = window.setTimeout(() => {
          if (cancelled) return;
          setStrike(null);
          next();
        }, 420 + Math.random() * 330);
      }, delay);
    };
    next();
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [reduced]);
  if (!strike) return null;
  return <Lightning key={strike.id} color="#b8d5fa" bolts={1} xOffset={strike.x} spread={0.28} branches={0.32} glow={0.7} intensity={0.8} speed={0.8} flicker={0.35} mouseInteraction={false} dpr={mobile ? 0.65 : dpr} />;
}

function App() {
  const [index, setIndex] = useState(0);
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
  const theme = variants[index].theme;
  const dpr = mobile ? Math.min(window.devicePixelRatio || 1, 1) : Math.min(window.devicePixelRatio || 1, 1.5);
  const chromeText = <div className="chrome-layer chrome-layer--text"><MetallicPaint text="STUDIO" color="#dce7ef" backgroundColor="#000000" density={mobile ? 0.85 : 1.5} distortion={0.045} dispersion={0.2} scale={mobile ? 0.95 : 0.8} speed={0.48} dpr={mobile ? 0.8 : dpr} paused={reduced} /></div>;
  const chromeScene = background => <div className="chrome-lightning"><div className="chrome-layer chrome-layer--background">{background}</div>{chromeText}<div className="chrome-lightning__vignette" /></div>;
  const scene = [
    <Silk color="#c6bbae" sheenColor="#ffffff" lightMode speed={2.1} scale={1.15} noiseIntensity={0.7} sheen={0.7} depth={0.65} glow={0.18} wave={0.65} ripple={0.4} dpr={dpr} paused={reduced} />,
    <Lightning color="#c7d5ef" bolts={2} spread={0.5} branches={0.55} glow={0.85} intensity={1.15} speed={0.85} flicker={0.45} dpr={dpr} paused={reduced} />,
    chromeScene(<IntermittentLightning mobile={mobile} dpr={dpr} reduced={reduced} />),
    chromeScene(<LightRays raysOrigin="top-center" raysColor="#b4cce3" raysSpeed={0.28} lightSpread={0.72} rayDensity={0.65} glow={0.38} intensity={0.65} followMouse={!mobile} maxDevicePixelRatio={mobile ? 0.65 : 1} />),
    chromeScene(<DarkVeil color="#64788b" speed={0.22} glow={0.24} sheen={0.2} quality={mobile ? 0.3 : 0.5} dpr={mobile ? 0.6 : 1} paused={reduced} />),
    chromeScene(<FloatingLines linesGradient={['#657a90','#d6e0e9']} lineCount={mobile ? 3 : 5} lineWidth={0.8} animationSpeed={0.4} glow={0.35} amplitude={0.6} interactive={!mobile} dpr={mobile ? 0.65 : 1} />),
    chromeScene(<SideRays rayColor1="#b5c5d5" rayColor2="#758da7" origin="top-right" speed={0.5} intensity={0.7} density={3} glow={0.4} followMouse={!mobile} maxDevicePixelRatio={mobile ? 0.65 : 1} />),
    chromeScene(<LiquidChrome color="#778594" speed={0.12} amplitude={0.14} detail={mobile ? 2 : 3} roughness={0.65} exposure={0.5} interactive={!mobile} maxDevicePixelRatio={mobile ? 0.55 : 0.9} />)
  ][index];
  return (
    <main className={theme}>
      <header><strong>STUDIO / 001</strong><span>DIGITAL · DESIGN · AI</span></header>
      <nav aria-label="Выбор оформления">{variants.map((v, i) => <button key={v.name} type="button" className={index === i ? 'active' : ''} aria-pressed={index === i} onClick={() => setIndex(i)}><span className="number">0{i + 1}</span><span>{v.name}</span><small>{v.label}</small></button>)}</nav>
      <section className={`hero${index >= 2 ? " hero--chrome" : ""}`}>
        <div className="scene" key={index}><Suspense fallback={<div className="loading">Загрузка эффекта…</div>}>{scene}</Suspense></div>
        {index < 2 && <div className="overlay">
          <p className="eyebrow">INDEPENDENT DIGITAL STUDIO</p>
          <h1>Beyond<br/><em>the ordinary.</em></h1>
          <p className="subtitle">Создаём цифровые продукты, которые работают, впечатляют и открывают новые возможности.</p>
          <div className="footerline"><span>ORIGINAL REACT BITS</span><span>{variants[index].name.toUpperCase()} · 0{index + 1} / 08</span></div>
        </div>}
      </section>
      <footer><span>React Bits + Codrops · мобильная подборка</span><a href="https://github.com/DavidHDev/react-bits" target="_blank" rel="noreferrer">SOURCE · GITHUB ↗</a></footer>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
