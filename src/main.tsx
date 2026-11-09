import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
const effects=[
 {id:'kinetic-grid',title:'Kinetic Grid',desc:'Физическая интерактивная сетка'},
 {id:'sequin-wave',title:'Sequin Wave',desc:'Переливающаяся волна'},
 {id:'vertigo',title:'Vertigo',desc:'Пространственная спираль'},
 {id:'digital-rain',title:'Digital Rain',desc:'Цифровой дождь'}
];
type Quality={quality:number;fps:number;name:string};
function deviceProfile():Quality{
 const n=navigator as Navigator & {deviceMemory?:number;connection?:{saveData?:boolean}};
 const cores=n.hardwareConcurrency||4,ram=n.deviceMemory||4,small=Math.min(innerWidth,innerHeight)<650;
 if(n.connection?.saveData||cores<=2||ram<=2)return{quality:.5,fps:24,name:'Экономный'};
 if(cores<=4||ram<=4||small)return{quality:.72,fps:30,name:'Сбалансированный'};
 return{quality:1,fps:60,name:'Высокий'};
}
function App(){
 const[index,setIndex]=useState(0);
 const[theme,setTheme]=useState<'light'|'dark'>(()=>{const saved=localStorage.getItem('cm-theme');return saved==='light'||saved==='dark'?saved:matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'});
 const[profile,setProfile]=useState<Quality>(deviceProfile);
 const[showInfo,setShowInfo]=useState(false);
 const[auto,setAuto]=useState(true);
 const effect=effects[index];
 useEffect(()=>{localStorage.setItem('cm-theme',theme);document.documentElement.dataset.theme=theme},[theme]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==='ArrowRight')setIndex(i=>(i+1)%4);if(e.key==='ArrowLeft')setIndex(i=>(i+3)%4)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[]);
 useEffect(()=>{if(!auto)return;const update=()=>setProfile(deviceProfile());window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update)},[auto]);
 const url=useMemo(()=>import.meta.env.BASE_URL+'effects/'+effect.id+'.html?'+new URLSearchParams({theme,quality:String(profile.quality),fps:String(profile.fps)}),[effect.id,theme,profile]);
 return <main className={'studio '+theme}>
 <iframe key={url} className="effect-frame" src={url} title={effect.title} allow="autoplay" />
 <div className="shade"/>
 <header className="topbar"><div className="brand">CODE<span>_</span>MUM<span className="dot">.</span></div><div className="top-actions"><span className="tag">INTERACTIVE EFFECT LAB</span><button className="theme-button" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} aria-label="Сменить тему">{theme==='dark'?'☀ Светлая':'☾ Тёмная'}</button></div></header>
 <section className="intro"><div className="kicker"><span className="signal"/> DESIGN IN MOTION / 04</div><h1>Beyond<br/><em>the code.</em></h1><p>Четыре оригинальных интерактивных эффекта. Двигай курсором или касайся экрана.</p><div className="current-effect"><span>СЕЙЧАС НА ЭКРАНЕ</span><strong>{effect.title}</strong></div></section>
 <footer className="bottom"><div className="switcher"><button onClick={()=>setIndex(i=>(i+3)%4)} aria-label="Предыдущий эффект">←</button><div className="effect-options">{effects.map((e,i)=><button key={e.id} onClick={()=>setIndex(i)} className={i===index?'selected':''}><span>{String(i+1).padStart(2,'0')}</span><strong>{e.title}</strong></button>)}</div><button onClick={()=>setIndex(i=>(i+1)%4)} aria-label="Следующий эффект">→</button></div><div className="bottom-meta"><button className="performance" onClick={()=>setShowInfo(v=>!v)} aria-expanded={showInfo}>◉ {profile.name} · {profile.fps} FPS <span>⌃</span></button><a href={'https://github.com/pbakaus/radiant/blob/main/static/'+effect.id+'.html'} target="_blank" rel="noreferrer">Оригинал ↗</a></div></footer>
 {showInfo&&<div className="quality-popover"><div className="quality-head"><strong>Производительность</strong><button onClick={()=>setShowInfo(false)} aria-label="Закрыть">✕</button></div><p>Автоматический подбор под устройство. Оригинальная анимация сохранена.</p><label><input type="checkbox" checked={auto} onChange={e=>{setAuto(e.target.checked);if(e.target.checked)setProfile(deviceProfile())}}/> Автоматически</label><div className="quality-modes">{[{quality:.5,fps:24,name:'Экономный'},{quality:.72,fps:30,name:'Сбалансированный'},{quality:1,fps:60,name:'Высокий'}].map(q=><button key={q.name} disabled={auto} className={profile.name===q.name?'chosen':''} onClick={()=>setProfile(q)}>{q.name}</button>)}</div></div>}
 </main>
}
createRoot(document.getElementById('root')!).render(<App/>);
