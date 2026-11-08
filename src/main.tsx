import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import Ribbons from './components/Ribbons/Ribbons';
import Beams from './components/Beams/Beams';
import './style.css';

const variants = [
  {name:'Floating Ribbons',mode:'Светлая'},
  {name:'Floating Ribbons',mode:'Тёмная'},
  {name:'Architectural Beams',mode:'Светлая'},
  {name:'Architectural Beams',mode:'Тёмная'}
];

function App(){
  const [index,setIndex]=useState(0);
  const dark=index%2===1;
  const beams=index>=2;
  const background=dark?'#151616':'#f0eee8';
  return <main className={dark?'dark':'light'}>
    <header><strong>STUDIO / 001</strong><span>DIGITAL · DESIGN · AI</span></header>
    <nav aria-label="Выбор Hero-блока">{variants.map((v,i)=><button key={i} type="button" aria-pressed={index===i} className={index===i?'active':''} onClick={()=>setIndex(i)}>{String(i+1).padStart(2,'0')} — {v.name} · {v.mode}</button>)}</nav>
    <section className="hero">
      <div className="scene" key={index}>
        {beams
          ? <Beams color={dark?'#c7d4cd':'#716f69'} backgroundColor={background} lightMode={!dark} speed={.55} mouseInteraction={true} mouseStrength={.35} beamWidth={2} quality={1} />
          : <Ribbons colors={dark?['#deded9','#9faaa7','#d1c7b7']:['#9c958c','#c6bcb0','#ded6c9']} backgroundColor={background} thickness={28} length={.65} spread={.35} stiffness={.22} bounce={.1} shape="lens" wave={.2} softness={.55} opacity={.95} />}
      </div>
      <div className="overlay"><p className="eyebrow">INDEPENDENT DIGITAL STUDIO</p><h1>Beyond<br/><em>the ordinary.</em></h1><p className="subtitle">Создаём цифровые продукты, которые работают, впечатляют и открывают новые возможности.</p><div className="footerline">HERO EXPERIMENT <span>{String(index+1).padStart(2,'0')} / 04</span></div></div>
    </section>
    <footer><span>Оригинальные компоненты React Bits · Ribbons / Beams</span><a href="https://reactbits.dev" target="_blank" rel="noreferrer">React Bits ↗</a></footer>
  </main>
}
createRoot(document.getElementById('root')!).render(<App/>);
