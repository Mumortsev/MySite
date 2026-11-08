import React, { Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const Silk = lazy(() => import('./components/ReactBits/Silk/Silk.jsx'));
const Lightning = lazy(() => import('./components/ReactBits/Lightning/Lightning.jsx'));
const Waves = lazy(() => import('./components/ReactBits/Waves/Waves.jsx'));
const MetallicPaint = lazy(() => import('./components/ReactBits/MetallicPaint/MetallicPaint.jsx'));
const Iridescence = lazy(() => import('./components/ReactBits/Iridescence/Iridescence.jsx'));
const Ballpit = lazy(() => import('./components/ReactBits/Ballpit/Ballpit.jsx'));
const MagnetLines = lazy(() => import('./components/ReactBits/MagnetLines/MagnetLines.jsx'));
const variants = [
  { name: 'Silk', label: 'Светлая · шёлк', theme: 'light' },
  { name: 'Lightning', label: 'Тёмная · молния', theme: 'dark' },
  { name: 'Waves', label: 'Тёмная · линии', theme: 'dark' },
  { name: 'Metallic Paint', label: 'Тёмная · хром', theme: 'dark' },
  { name: 'Iridescence', label: 'Светлая · перламутр', theme: 'light' },
  { name: 'Ballpit', label: 'Тёмная · сферы', theme: 'dark' },
  { name: 'Magnet Lines', label: 'Тёмная · магнитные линии', theme: 'dark' },
  { name: 'Liquid Distortion', label: 'Тёмная · слайдшоу', theme: 'dark' }
];

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
  const scene = [
    <Silk color="#c6bbae" sheenColor="#ffffff" lightMode speed={2.1} scale={1.15} noiseIntensity={0.7} sheen={0.7} depth={0.65} glow={0.18} wave={0.65} ripple={0.4} dpr={dpr} paused={reduced} />,
    <Lightning color="#c7d5ef" bolts={2} spread={0.5} branches={0.55} glow={0.85} intensity={1.15} speed={0.85} flicker={0.45} dpr={dpr} paused={reduced} />,
    <Waves lineColor="#d7dce2" accentColor="#7d8f9f" backgroundColor="#0b0d11" spacing={mobile ? 17 : 13} lineWidth={1.1} amplitude={26} speed={0.65} twist={0.7} dpr={dpr} paused={reduced} />,
    <MetallicPaint text="STUDIO" color="#dce2e2" backgroundColor="#0c1015" density={mobile ? 1.1 : 1.7} scale={mobile ? 0.85 : 1.05} speed={0.6} dpr={dpr} paused={reduced} />,
    <Iridescence color={[0.82,0.78,0.72]} speed={0.55} amplitude={0.08} detail={mobile ? 5 : 8} scale={1.1} resolution={mobile ? 0.65 : 1} brightness={1.2} />,
    <Ballpit count={mobile ? 32 : 75} colors={['#e8e7e3','#9fa7b0','#747b83']} material="metal" minSize={0.35} maxSize={0.8} drift={0.2} dpr={dpr} />,
    <MagnetLines spacing={mobile ? 38 : 32} lineColor="#d3d8dc" accentColor="#a5b4c1" lineWidth={1.5} lineHeight={18} radius={160} maxDevicePixelRatio={dpr} />,
    <div className="original-demo"><p>Liquid Distortion · оригинальный Codrops</p><a href="https://tympanus.net/Development/LiquidDistortion/" target="_blank" rel="noreferrer">Открыть оригинальную интерактивную демонстрацию ↗</a><small>Этот проект использует отдельный PixiJS-движок и пока не встроен в Hero.</small></div>
  ][index];
  return (
    <main className={theme}>
      <header><strong>STUDIO / 001</strong><span>DIGITAL · DESIGN · AI</span></header>
      <nav aria-label="Выбор оформления">{variants.map((v, i) => <button key={v.name} type="button" className={index === i ? 'active' : ''} aria-pressed={index === i} onClick={() => setIndex(i)}><span className="number">0{i + 1}</span><span>{v.name}</span><small>{v.label}</small></button>)}</nav>
      <section className="hero">
        <div className="scene" key={index}><Suspense fallback={<div className="loading">Загрузка эффекта…</div>}>{scene}</Suspense></div>
        <div className="overlay">
          <p className="eyebrow">INDEPENDENT DIGITAL STUDIO</p>
          <h1>Beyond<br/><em>the ordinary.</em></h1>
          <p className="subtitle">Создаём цифровые продукты, которые работают, впечатляют и открывают новые возможности.</p>
          <div className="footerline"><span>ORIGINAL REACT BITS</span><span>{variants[index].name.toUpperCase()} · 0{index + 1} / 08</span></div>
        </div>
      </section>
      <footer><span>React Bits + Codrops · мобильная подборка</span><a href="https://github.com/DavidHDev/react-bits" target="_blank" rel="noreferrer">SOURCE · GITHUB ↗</a></footer>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
