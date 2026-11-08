import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
const SECTIONS=[
 {id:'gallery',label:'ГАЛЕРЕЯ',sub:'ЦИФРОВАЯ ГАЛЕРЕЯ',description:'Визуальные эксперименты и интерфейсы',items:['Интерактивные миры','Цифровая типографика','Генеративная графика']},
 {id:'works',label:'РАБОТЫ',sub:'ПРОЕКТЫ И РЕШЕНИЯ',description:'Веб-сайты, приложения и AI-инструменты',items:['Веб-разработка','Мобильные приложения','ИИ-решения']},
 {id:'calc',label:'КАЛЬКУЛЯТОР',sub:'ОЦЕНКА ПРОЕКТА',description:'Соберите конфигурацию вашего проекта',items:[]},
 {id:'contact',label:'КОНТАКТЫ',sub:'НАЧНЁМ СОЗДАВАТЬ',description:'Расскажите, какой мир хотите построить',items:[]}
];
const CHARS='01アイウエオカキクケコサシスセソタチツテト<>/{}[]';
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const ease=t=>t*t*(3-2*t);
function MatrixScene({phase,target}){
 const canvasRef=useRef(null);
 const stateRef=useRef({phase,target});
 stateRef.current={phase,target};
 useEffect(()=>{
  const canvas=canvasRef.current,ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
  let w=0,h=0,step=8,rows=0,columns=0,grid=[],streams=[],glyphMasks=[],stars=[],raf=0,alive=true,last=0;
  let progress=0,previousPhase='home',ticks=0;
  const rand=(a,b)=>a+Math.random()*(b-a);
  const pick=()=>CHARS[Math.floor(Math.random()*CHARS.length)];
  function resize(){
   const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;
   const dpr=Math.min(devicePixelRatio||1,1.6,Math.sqrt(1600000/Math.max(w*h,1)));
   canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
   // Every illuminated letter is a region of the same falling-glyph lattice.
   const mobile=w<700;
   step=mobile?7.5:w<1100?9:11;
   columns=Math.ceil(w/step);rows=Math.ceil(h/step);
   streams=Array.from({length:columns},(_,x)=>({x,head:rand(-rows,rows),speed:rand(.28,.72),length:Math.floor(rand(11,30))}));
   grid=Array.from({length:rows*columns},()=>({glyph:pick(),seed:rand(0,7),z:rand(-.22,.22)}));
   glyphMasks=new Uint8Array(rows*columns);
   const mask=document.createElement('canvas');mask.width=Math.ceil(w);mask.height=Math.ceil(h);
   const m=mask.getContext('2d',{willReadFrequently:true});
   m.clearRect(0,0,w,h);m.fillStyle='#fff';m.textBaseline='middle';m.textAlign='center';
   const logoFont=Math.min(w<700?64:138,w*.135);
   m.font='900 '+logoFont+'px Arial,Helvetica,sans-serif';
   m.fillText('CODE_MUM',w*.5,h*.49,w*.94);
   const pixels=m.getImageData(0,0,mask.width,mask.height).data;
   for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
    const px=Math.min(mask.width-1,Math.floor((x+.5)*step)),py=Math.min(mask.height-1,Math.floor((y+.5)*step));
    glyphMasks[y*columns+x]=pixels[(py*mask.width+px)*4+3]>80?1:0;
   }
   stars=Array.from({length:260},()=>({x:rand(0,w),y:rand(0,h),z:rand(.1,1),brightness:rand(.1,.6)}));
  }
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function draw(now){
   if(!alive)return;raf=requestAnimationFrame(draw);
   if(now-last<28)return;
   const dt=Math.min(60,now-last||33);last=now;ticks++;
   const {phase,target}=stateRef.current;
   if(phase!==previousPhase){progress=0;previousPhase=phase}
   if(phase==='enter')progress=clamp(progress+dt/2100,0,1);
   else if(phase==='exit')progress=clamp(progress+dt/1350,0,1);
   const depth=phase==='enter'?ease(progress):phase==='world'?1:phase==='exit'?1-ease(progress):0;
   ctx.fillStyle='#010703';ctx.fillRect(0,0,w,h);
   const glow=ctx.createRadialGradient(w*.5,h*.48,0,w*.5,h*.48,Math.max(w,h)*.8);
   glow.addColorStop(0,'#0b2616');glow.addColorStop(1,'#010703');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
   const focusX=w*target.x/100,focusY=h*target.y/100;
   // Project every glyph through the SAME perspective camera toward the clicked menu's screen coordinate.
   // z is the depth of the digital-rain plane; perspective scale accelerates near the target.
   const cameraScale=1+depth*28;
   ctx.textAlign='center';ctx.textBaseline='middle';
   for(const stream of streams){
    if(!reduced)stream.head+=stream.speed*(dt/33);
    if(stream.head-stream.length>rows)stream.head=-rand(4,rows*.7);
   }
   for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){
    const idx=y*columns+x,point=grid[idx],stream=streams[x],trail=stream.head-y;
    const falling=trail>=0&&trail<stream.length;
    const shaped=glyphMasks[idx]===1;
    if(!falling&&!shaped)continue;
    const sx=x*step+step*.5,sy=y*step+step*.5;
    const perspective=cameraScale*(1+point.z*depth*.22);
    const px=focusX+(sx-focusX)*perspective;
    const py=focusY+(sy-focusY)*perspective;
    if(px<-step*perspective||px>w+step*perspective||py<-step*perspective||py>h+step*perspective)continue;
    const size=clamp((shaped?step*.96:step*.85)*perspective,5,180);
    ctx.font='bold '+size+'px monospace';
    const reveal=clamp((ticks-4)/32,0,1);
    const opacity=shaped?(.94+.05*Math.sin(ticks*.06+point.seed))*reveal:falling?.008+.095*(1-trail/stream.length):0;
    ctx.fillStyle=shaped?'rgba(174,255,195,'+opacity+')':trail<1?'rgba(85,190,117,.32)':'rgba(38,145,76,'+opacity+')';
    const symbol=CHARS[(x*13+y*7+Math.floor(ticks/(shaped?12:5)))%CHARS.length];
    ctx.fillText(symbol,px,py);
   }
   if(depth>.04){
    // Near-field particles supply parallax and motion streaks, instead of flat CSS zoom.
    for(const p of stars){
     const z=clamp(p.z+depth*1.6,.1,2.6),factor=1+depth*depth*18/z;
     const x=focusX+(p.x-focusX)*factor,y=focusY+(p.y-focusY)*factor;
     if(x<0||x>w||y<0||y>h)continue;
     ctx.strokeStyle='rgba(112,255,166,'+(depth*p.brightness)+')';
     ctx.lineWidth=clamp(depth*factor*.6,.5,3);
     ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(x-focusX)*depth*.06,y+(y-focusY)*depth*.06);ctx.stroke();
    }
   }
  }
  raf=requestAnimationFrame(draw);
  return()=>{alive=false;cancelAnimationFrame(raf);observer.disconnect()};
 },[]);
 return <canvas className="matrix" ref={canvasRef} aria-hidden="true"/>;
}
function App(){
 const [section,setSection]=useState(null),[phase,setPhase]=useState('home'),[pending,setPending]=useState(null);
 const [target,setTarget]=useState({x:50,y:50});
 const [type,setType]=useState('site'),[pages,setPages]=useState(5),[ai,setAi]=useState(false);
 const [form,setForm]=useState({name:'',email:'',message:''});
 const timers=useRef([]);
 const schedule=(fn,ms)=>{const id=window.setTimeout(fn,ms);timers.current.push(id)};
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 function enter(){if(phase!=='home')return;setTarget({x:50,y:50});setPending('works');setPhase('enter');schedule(()=>{setSection('works');setPhase('world');setPending(null)},2100)}
 function exit(){if(phase!=='world')return;setPhase('exit');schedule(()=>{setSection(null);setPhase('home')},1350)}
 const selected=SECTIONS.find(s=>s.id===section);
 const price=(type==='site'?35000:type==='app'?110000:65000)+Math.max(0,pages-1)*2500+(ai?30000:0);
 return <main><section className={'screen phase-'+phase}>
 <MatrixScene phase={phase} target={target}/>
 {phase==='home'&&<><h1 className="sr-only">CODE_MUM — цифровая студия</h1><button className="entry-button" onClick={enter} aria-label="Войти на сайт">ВХОД <span aria-hidden="true">↗</span></button></>}
 {phase==='enter'&&<div className="warp" key="enter"><div className="warp-vortex"/><div className="warp-label">ВХОД В МИР / {SECTIONS.find(s=>s.id===pending)?.label}</div></div>}
 {section&&<div className={'world '+(phase==='exit'?'world-out':'world-in')}>
  <div className="world-bar"><button className="back" onClick={exit} disabled={phase!=='world'}>← НА ГЛАВНУЮ</button><nav className="world-navigation" aria-label="Разделы сайта">{SECTIONS.map(s=><button key={s.id} className={section===s.id?'active':''} onClick={()=>{if(phase==='world')setSection(s.id)}}>{s.label}</button>)}</nav><span className="world-brand">CODE_MUM</span></div>
  <div className="world-scene"><div className="world-grid"/><div className="world-inner">
   <div className="world-index">МИР 0{SECTIONS.findIndex(s=>s.id===section)+1} / 04 <span className="pulse">● СИСТЕМА АКТИВНА</span></div>
   <h2>{selected?.sub}</h2><p className="world-desc">{selected?.description}</p>
   {(section==='gallery'||section==='works')&&<div className="world-cards">{selected.items.map((item,i)=><article key={item} className="world-card"><span>0{i+1} / CODE_MUM</span><div className="card-art"><div className={'artifact art-'+i}><i/><i/><i/></div></div><h3>{item}</h3><p>{section==='works'?'Направление разработки студии':'Направление визуальных экспериментов'}</p></article>)}</div>}
   {section==='calc'&&<div className="calculator"><label>ТИП ПРОЕКТА<select value={type} onChange={e=>setType(e.target.value)}><option value="site">Сайт</option><option value="app">Мобильное приложение</option><option value="ai">ИИ-решение</option></select></label><label>КОЛИЧЕСТВО ЭКРАНОВ / СТРАНИЦ: {pages}<input type="range" min="1" max="20" value={pages} onChange={e=>setPages(Number(e.target.value))}/></label><label className="check"><input type="checkbox" checked={ai} onChange={e=>setAi(e.target.checked)}/> ИНТЕГРАЦИЯ ИИ</label><div className="total"><span>ОРИЕНТИРОВОЧНАЯ СТОИМОСТЬ</span><strong>{price.toLocaleString('ru-RU')} ₽</strong><small>Предварительная оценка, не публичная оферта</small></div><a className="action" href={'mailto:hello@codemum.ru?subject='+encodeURIComponent('Расчёт проекта CODE_MUM')+'&body='+encodeURIComponent('Тип: '+type+'; экранов: '+pages+'; ИИ: '+(ai?'да':'нет')+'; оценка: '+price+' ₽')}>ОТПРАВИТЬ РАСЧЁТ ↗</a></div>}
   {section==='contact'&&<form className="contact" onSubmit={e=>{e.preventDefault();window.location.href='mailto:hello@codemum.ru?subject='+encodeURIComponent('Проект CODE_MUM от '+form.name)+'&body='+encodeURIComponent(form.message+'\n\nИмя: '+form.name+'\nКонтакт: '+form.email)}}><label>КАК ВАС ЗОВУТ<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ваше имя"/></label><label>КАК С ВАМИ СВЯЗАТЬСЯ<input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email или Telegram"/></label><label>РАССКАЖИТЕ О ПРОЕКТЕ<textarea required rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Что хотите создать?"/></label><button type="submit" className="action">СОЗДАТЬ ПИСЬМО ↗</button><small>Откроется ваше почтовое приложение для отправки заявки.</small></form>}
  </div></div>
 </div>}
 </section></main>;
}
createRoot(document.getElementById('root')).render(<App/>);
