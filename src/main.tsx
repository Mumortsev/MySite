import React, {useEffect,useState} from 'react';
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
  useEffect(()=>{\n    if(index>=2)return;\n    let frame=0;let active=true;let lastTouch=0;\n    const mark=()=>{lastTouch=performance.now()};\n    window.addEventListener('pointerdown',mark,{passive:true});\n    window.addEventListener('touchstart',mark,{passive:true});\n    const animate=(time:number)=>{\n      if(!active)return;\n      const scene=document.querySelector('.scene');\n      if(scene && time-lastTouch>3500){\n        const rect=scene.getBoundingClientRect();\n        const x=rect.left+rect.width*(.5+.24*Math.sin(time*.00038));\n        const y=rect.top+rect.height*(.48+.27*Math.sin(time*.00053));\n        window.dispatchEvent(new PointerEvent('pointermove',{clientX:x,clientY:y}));\n      }\n      frame=requestAnimationFrame(animate);\n    };\n    frame=requestAnimationFrame(animate);\n    return()=>{active=false;cancelAnimationFrame(frame);window.removeEventListener('pointerdown',mark);window.removeEventListener('touchstart',mark)};\n  },[index]);\n  const dark=index%2===1;
  const beams=index>=2;
  const background=dark?'#151616':'#f0eee8';
  return <main className={dark?'dark':'light'}>
    <header><strong>STUDIO / 001</strong><span>DIGITAL · DESIGN · AI</span></header>
    <nav aria-label="Выбор Hero-блока">{variants.map((v,i)=><button key={i} type="button" aria-pressed={index===i} className={index===i?'active':''} onClick={()=>setIndex(i)}>{String(i+1).padStart(2,'0')} — {v.name} · {v.mode}</button>)}</nav>
    <section className="hero">
      <div className="scene" key={index}>
        {beams
          ? <Beams color={dark?'#c7d4cd':'#716f69'} backgroundColor={background} lightMode={!dark} speed={1.05} mouseInteraction={true} mouseStrength={1.1} beamWidth={120} waveLength={180} depth={1.4} twist={.35} glow={.9} brightness={2.1} quality={.75} />
          : <Ribbons colors={dark?['#deded9','#9faaa7','#d1c7b7']:['#9c958c','#c6bcb0','#ded6c9']} backgroundColor={background} thickness={35} length={1.4} spread={18} stiffness={.45} bounce={.45} shape="lens" wave={.2} softness={.55} opacity={.95} />}
      </div>
      <div className="overlay"><p className="eyebrow">INDEPENDENT DIGITAL STUDIO</p><h1>Beyond<br/><em>the ordinary.</em></h1><p className="subtitle">Создаём цифровые продукты, которые работают, впечатляют и открывают новые возможности.</p><div className="footerline">HERO EXPERIMENT <span>{String(index+1).padStart(2,'0')} / 04</span></div></div>
    </section>
    <footer><span>Оригинальные компоненты React Bits · Ribbons / Beams</span><a href="https://reactbits.dev" target="_blank" rel="noreferrer">React Bits ↗</a></footer>
  </main>
}
createRoot(document.getElementById('root')!).render(<App/>);
