import React, { Suspense, lazy, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const effects = [
  { name: 'Aurora', Component: lazy(() => import('./components/ReactBits/Aurora/Aurora.jsx')) },
  { name: 'DarkVeil', Component: lazy(() => import('./components/ReactBits/DarkVeil/DarkVeil.jsx')) },
  { name: 'Galaxy', Component: lazy(() => import('./components/ReactBits/Galaxy/Galaxy.jsx')) },
  { name: 'Threads', Component: lazy(() => import('./components/ReactBits/Threads/Threads.jsx')) },
  { name: 'Silk', Component: lazy(() => import('./components/ReactBits/Silk/Silk.jsx')) },
  { name: 'Waves', Component: lazy(() => import('./components/ReactBits/Waves/Waves.jsx')) },
  { name: 'Orb', Component: lazy(() => import('./components/ReactBits/Orb/Orb.jsx')) },
  { name: 'Lightning', Component: lazy(() => import('./components/ReactBits/Lightning/Lightning.jsx')) },
  { name: 'Particles', Component: lazy(() => import('./components/ReactBits/Particles/Particles.jsx')) },
  { name: 'Plasma', Component: lazy(() => import('./components/ReactBits/Plasma/Plasma.jsx')) },
];

function App() {
  const [index, setIndex] = useState(0);
  const [motionKey, setMotionKey] = useState(0);
  const current = effects[index];
  const Effect = current.Component;
  const change = (next: number) => { setIndex(next); setMotionKey(n => n + 1); };
  return (
    <main className="dark">
      <header><strong>STUDIO / 001</strong><span>DIGITAL · DESIGN · AI</span></header>
      <div className="intro"><span className="eyebrow">REACT BITS / DARK HERO LAB</span><h2>Выбери свой эффект.</h2><p>10 оригинальных анимаций из открытого репозитория React Bits. Все варианты — в тёмном оформлении.</p></div>
      <nav aria-label="Выбор анимации">{effects.map((item, i) => <button key={item.name} type="button" aria-pressed={index === i} className={index === i ? 'active' : ''} onClick={() => change(i)}>{String(i + 1).padStart(2, '0')} · {item.name}</button>)}</nav>
      <section className="hero" aria-label={current.name}>
        <div className="scene" key={motionKey}>
          <Suspense fallback={<div className="loading">Загрузка эффекта…</div>}><Effect /></Suspense>
        </div>
        <div className="overlay">
          <p className="eyebrow">INDEPENDENT DIGITAL STUDIO</p>
          <h1>Beyond<br/><em>the ordinary.</em></h1>
          <p className="subtitle">Создаём цифровые продукты, которые работают, впечатляют и открывают новые возможности.</p>
          <div className="footerline">ORIGINAL REACT BITS · {current.name.toUpperCase()} <span>{String(index + 1).padStart(2, '0')} / {effects.length}</span></div>
        </div>
      </section>
      <footer><span>Исходники: DavidHDev/react-bits · Без самодельных эффектов</span><a href="https://github.com/DavidHDev/react-bits" target="_blank" rel="noreferrer">GitHub React Bits ↗</a></footer>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
