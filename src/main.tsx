import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

const SECTIONS=[
 {id:'gallery',label:'ГАЛЕРЕЯ',sub:'ЦИФРОВАЯ ГАЛЕРЕЯ',description:'Визуальные эксперименты и интерфейсы',items:['Интерактивные миры','Цифровая типографика','Генеративная графика']},
 {id:'works',label:'РАБОТЫ',sub:'ПРОЕКТЫ И РЕШЕНИЯ',description:'Веб-сайты, приложения и AI-инструменты',items:['Веб-разработка','Мобильные приложения','ИИ-решения']},
 {id:'calc',label:'КАЛЬКУЛЯТОР',sub:'ОЦЕНКА ПРОЕКТА',description:'Соберите конфигурацию вашего проекта',items:[]},
 {id:'contact',label:'КОНТАКТЫ',sub:'НАЧНЁМ СОЗДАВАТЬ',description:'Расскажите, какой мир хотите построить',items:[]}
];
const GLYPHS='01アイウエオカキクケコサシスセソタチツテト<>/{}[]';
function Matrix({section,phase,onNavigate}){
 const ref=useRef(null);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
  let w=0,h=0,cell=12,dpr=1,cols=[],masks=[],menuGlyphs=[],frame=0,raf=0,last=0,alive=true;
  const pointer={x:-1000,y:-1000};
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const pick=()=>GLYPHS[Math.floor(Math.random()*GLYPHS.length)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){
   const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;
   dpr=Math.min(devicePixelRatio||1,1.6,Math.sqrt(1600000/Math.max(1,w*h)));
   canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
   cell=w<650?Math.max(7,Math.floor(w/55)):13;
   const nx=Math.ceil(w/cell),ny=Math.ceil(h/cell);
   cols=Array.from({length:nx},(_,x)=>({x,head:rnd(-ny,ny),speed:rnd(.13,.48),length:Math.floor(rnd(8,24)),offset:rnd(0,100)}));
   masks=Array.from({length:ny},()=>new Uint8Array(nx));
   if(section!==null)return;
   const off=document.createElement('canvas');off.width=nx;off.height=ny;const c=off.getContext('2d');c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';
   const logoSize=Math.min(ny*.22,nx*.205);
   c.font='900 '+logoSize+'px Arial,sans-serif';
   c.fillText('CODE_MUM',nx/2,ny*.47,nx*.94);
   // The menu has its own finer sampling resolution but shares the exact screen coordinates and glyph renderer.
   // Each Cyrillic letter is sampled at >= 6 pixels of height instead of being crushed into 2-3 grid rows.
   menuGlyphs=[];
   const menuFont=Math.max(17,Math.min(28,w*.046));
   const fine=Math.max(2.4,menuFont/10);
   const labels=[
    {text:'ГАЛЕРЕЯ',anchor:'left',x:w*.045,y:h*.135},
    {text:'РАБОТЫ',anchor:'right',x:w*.955,y:h*.135},
    {text:'КАЛЬКУЛЯТОР',anchor:'left',x:w*.045,y:h*.865},
    {text:'КОНТАККТЫ',anchor:'right',x:w*.955,y:h*.865}
   ];
   labels[3].text='КОНТАКТЫ';
   for(const item of labels){
    const mask=document.createElement('canvas');
    const mc=mask.getContext('2d');
    mc.font='900 '+menuFont+'px Arial,Helvetica,sans-serif';
    const maxWidth=w*.44;
    const measured=mc.measureText(item.text).width;
    const font=Math.min(menuFont,menuFont*maxWidth/Math.max(measured,1));
    const mw=Math.ceil(maxWidth/fine),mh=Math.ceil(font*1.5/fine);
    mask.width=mw;mask.height=mh;
    mc.fillStyle='#fff';mc.textAlign=item.anchor;mc.textBaseline='middle';
    mc.font='900 '+font/fine+'px Arial,Helvetica,sans-serif';
    mc.fillText(item.text,item.anchor==='left'?0:mw,mh/2,mw);
    const pixels=mc.getImageData(0,0,mw,mh).data;
    const x0=item.anchor==='left'?item.x:item.x-mw*fine;
    const y0=item.y-mh*fine/2;
    for(let yy=0;yy<mh;yy++)for(let xx=0;xx<mw;xx++){
     if(pixels[(yy*mw+xx)*4+3]>105)menuGlyphs.push({x:x0+xx*fine,y:y0+yy*fine,seed:(xx*13+yy*7)%GLYPHS.length,size:fine});
    }
   }
   const pix=c.getImageData(0,0,nx,ny).data;
   for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)if(pix[(y*nx+x)*4+3]>85)masks[y][x]=1;
  }
  const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
  function render(time){
   if(!alive)return;
   if(time-last<30){raf=requestAnimationFrame(render);return}last=time;frame++;
   ctx.fillStyle='#010703';ctx.fillRect(0,0,w,h);
   const halo=ctx.createRadialGradient(w/2,h*.46,0,w/2,h*.46,w*.8);halo.addColorStop(0,'#0c2618');halo.addColorStop(1,'#010703');ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
   const nx=cols.length,ny=masks.length;
   ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold '+Math.max(8,cell-1)+'px monospace';
   const forming=Math.min(1,Math.max(0,(frame-8)/65));
   for(const col of cols){
    col.head+=col.speed*(reduce?0:1);
    if(col.head-col.length>ny)col.head=rnd(-ny,0);
    const x=col.x*cell+cell/2;
    for(let y=0;y<ny;y++){
     const py=y*cell+cell/2;
     const inShape=section===null&&masks[y]?.[col.x]===1;
     const delta=col.head-y;
     const falling=delta>=0&&delta<col.length;
     if(!falling&&!inShape)continue;
     const distance=Math.hypot(x-pointer.x,py-pointer.y);
     const near=Math.max(0,1-distance/100);
     let alpha=falling?.12+.52*(1-delta/col.length):0;
     if(inShape)alpha=Math.max(alpha,forming*(.77+.2*Math.sin(frame*.035+col.x*.4+y*.3)));
     ctx.fillStyle=inShape?'rgba(171,255,193,'+Math.min(1,alpha)+')':falling&&delta<1?'rgba(205,255,222,.9)':'rgba(36,215,108,'+Math.min(1,alpha+near*.24)+')';
     if(inShape){ctx.shadowBlur=3;ctx.shadowColor='#42f68d'}
     ctx.fillText(GLYPHS[(col.x*13+y*7+Math.floor(frame/(inShape?9:5)))%GLYPHS.length],x,py);
     ctx.shadowBlur=0;
    }
   }
   if(section===null){\n    // Glyphs for menu and logo belong to one animated canvas, not HTML text overlays.\n    ctx.font='bold '+Math.max(3,menuGlyphs[0]?.size||3)+'px monospace';\n    for(const g of menuGlyphs){\n     const light=.74+.22*Math.sin(frame*.05+g.seed);\n     ctx.fillStyle='rgba(175,255,199,'+(forming*light)+')';\n     ctx.fillText(GLYPHS[(g.seed+Math.floor(frame/9))%GLYPHS.length],g.x,g.y);\n    }\n   }\n   if(phase!=='home'){
    const cx=w/2,cy=h/2;
    const strength=phase==='enter'?Math.min(1,frame/38):phase==='exit'?Math.min(1,frame/35):.25;
    ctx.save();ctx.translate(cx,cy);
    for(let i=0;i<50;i++){const a=i*2.39996+frame*.006,r=(i/50)*Math.max(w,h)*strength;ctx.strokeStyle='rgba(90,255,160,'+(1-i/50)*.3+')';ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*(r+30*strength),Math.sin(a)*(r+30*strength));ctx.stroke()}
    ctx.restore();
   }
   raf=requestAnimationFrame(render);
  }
  raf=requestAnimationFrame(render);
  const move=e=>{const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top};
  canvas.addEventListener('pointermove',move);
  return()=>{alive=false;cancelAnimationFrame(raf);ro.disconnect();canvas.removeEventListener('pointermove',move)};
 },[section,phase]);
 return <canvas ref={ref} className="matrix" aria-hidden="true"/>;
}
function App(){
 const [section,setSection]=useState(null),[phase,setPhase]=useState('home'),[pending,setPending]=useState(null);\n const [target,setTarget]=useState({x:50,y:50});
 const [type,setType]=useState('site'),[pages,setPages]=useState(5),[ai,setAi]=useState(false);
 const [form,setForm]=useState({name:'',email:'',message:''});
 const timers=useRef([]);
 const schedule=(fn,ms)=>{const id=window.setTimeout(fn,ms);timers.current.push(id)};
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 function enter(id){if(phase!=='home')return;const coords={gallery:[18,13.5],works:[82,13.5],calc:[18,86.5],contact:[82,86.5]};const [x,y]=coords[id];setTarget({x,y});setPending(id);setPhase('enter');schedule(()=>{setSection(id);setPhase('world');setPending(null)},1750)}
 function exit(){if(phase!=='world')return;setPhase('exit');schedule(()=>{setSection(null);setPhase('home')},1250)}
 const selected=SECTIONS.find(s=>s.id===section);
 const price=(type==='site'?35000:type==='app'?110000:65000)+Math.max(0,pages-1)*2500+(ai?30000:0);
 const regions=[['gallery','tl'],['works','tr'],['calc','bl'],['contact','br']];
 return <main><section className={'screen phase-'+phase}>
 <Matrix section={section} phase={phase}/>
 {phase==='home'&&<><h1 className="sr-only">CODE_MUM — цифровая студия</h1>{regions.map(([id,pos])=><button key={id} className={'hotspot '+pos} onClick={()=>enter(id)} aria-label={'Открыть '+SECTIONS.find(s=>s.id===id).label}><span className="sr-only">{SECTIONS.find(s=>s.id===id).label}</span></button>)}<div className="home-hint">ВЫБЕРИТЕ РАЗДЕЛ — ВОЙДИТЕ В КОД</div></>}
 {phase==='enter'&&<div className="warp" key="enter"><div className="warp-vortex"/><div className="warp-label">ВХОД В МИР / {SECTIONS.find(s=>s.id===pending)?.label}</div></div>}
 {section&&<div className={'world '+(phase==='exit'?'world-out':'world-in')}>
  <div className="world-bar"><button className="back" onClick={exit} disabled={phase!=='world'}>← В МАТРИЦУ</button><span>CODE_MUM / {selected?.label}</span></div>
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
