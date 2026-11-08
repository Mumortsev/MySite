import React,{useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

function MatrixBrand(){
 const ref=useRef(null);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
  let width=0,height=0,dpr=1,columns=[],logo=[],raf=0,frame=0,alive=true,last=0;
  const mouse={x:-1000,y:-1000,down:false};
  const chars='01アイウエオカキクケコサシスセソタチツテト<>/{}[]';
  const randomChar=()=>chars[Math.floor(Math.random()*chars.length)];
  const random=(a,b)=>a+Math.random()*(b-a);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cell=15,logoWidth=0,logoHeight=0;
  function resize(){
   const r=canvas.getBoundingClientRect();width=r.width;height=r.height;
   dpr=Math.min(window.devicePixelRatio||1,1.65,Math.sqrt(1700000/Math.max(1,width*height)));
   canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
   cell=width<560?12:16;
   columns=Array.from({length:Math.ceil(width/cell)},(_,i)=>({x:i*cell,y:random(-height,0),speed:random(.65,2.2),length:Math.floor(random(8,23)),seed:Math.floor(random(0,1000))}));
   const off=document.createElement('canvas');off.width=Math.ceil(width/cell);off.height=Math.ceil(height/cell);
   const o=off.getContext('2d');const fontSize=Math.min(width*.151,210);
   o.font='900 '+fontSize/cell+'px Arial,Helvetica,sans-serif';o.textAlign='center';o.textBaseline='middle';o.fillStyle='#fff';
   // Draw in cell coordinates so every letter is made from actual matrix characters.
   o.fillText('CODE_MUM',off.width/2,off.height*.45,off.width*.94);
   const pixels=o.getImageData(0,0,off.width,off.height).data;logo=[];
   for(let y=0;y<off.height;y++)for(let x=0;x<off.width;x++){
    if(pixels[(y*off.width+x)*4+3]>110)logo.push({x:x*cell+cell*.5,y:y*cell+cell*.5,c:randomChar(),phase:random(0,6.28),delay:random(0,90)});
   }
  }
  function pointer(e){const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top}
  function exit(){mouse.x=-1000;mouse.y=-1000;mouse.down=false}
  function draw(now){
   if(!alive)return;
   if(!reduced&&now-last<32){raf=requestAnimationFrame(draw);return}last=now;frame++;
   ctx.fillStyle='#020806';ctx.fillRect(0,0,width,height);
   const glow=ctx.createRadialGradient(width*.5,height*.46,0,width*.5,height*.46,Math.max(width,height)*.73);
   glow.addColorStop(0,'#0c281e');glow.addColorStop(.55,'#06140f');glow.addColorStop(1,'#020806');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
   ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold '+(cell-1)+'px monospace';
   for(const col of columns){
    col.y+=col.speed*(mouse.down?3:1)*(reduced?0:1);
    if(col.y-col.length*cell>height)col.y=random(-height*.7,0);
    for(let i=0;i<col.length;i++){
     const y=col.y-i*cell;if(y<0||y>height)continue;
     const dist=Math.hypot(col.x-mouse.x,y-mouse.y),near=Math.max(0,1-dist/135);
     ctx.fillStyle=i===0?'rgba(202,255,228,.85)':'rgba(55,218,128,'+(.05+(1-i/col.length)*.27+near*.35)+')';
     const index=(col.seed+i+Math.floor(frame/5))%chars.length;
     ctx.fillText(chars[index],col.x,y);
    }
   }
   const reveal=Math.min(1,Math.max(0,(frame-8)/100));
   const halo=ctx.createRadialGradient(width*.5,height*.45,0,width*.5,height*.45,width*.53);
   halo.addColorStop(0,'rgba(20,95,58,.16)');halo.addColorStop(1,'rgba(0,0,0,0)');
   ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
   for(const p of logo){
    if(frame<p.delay+10)continue;
    const dx=p.x-mouse.x,dy=p.y-mouse.y,dist=Math.hypot(dx,dy);
    const force=Math.max(0,1-dist/120);
    const drift=force*(mouse.down?26:13);
    const x=p.x+(dist>0?dx/dist:0)*drift;
    const y=p.y+(dist>0?dy/dist:0)*drift;
    if(frame%14===0&&Math.random()<.1)p.c=randomChar();
    const flicker=.82+.18*Math.sin(frame*.045+p.phase);
    ctx.shadowColor='#4bff9b';ctx.shadowBlur=force*16+3;
    ctx.fillStyle='rgba(184,255,207,'+(reveal*flicker)+')';
    ctx.fillText(p.c,x,y);
   }
   ctx.shadowBlur=0;
   if(!reduced)raf=requestAnimationFrame(draw);
  }
  const ro=new ResizeObserver(resize);ro.observe(canvas);resize();raf=requestAnimationFrame(draw);
  const onDown=e=>{pointer(e);mouse.down=true};const onUp=()=>mouse.down=false;
  const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(raf)}else if(!reduced){last=0;raf=requestAnimationFrame(draw)}};
  canvas.addEventListener('pointermove',pointer);canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointerleave',exit);window.addEventListener('pointerup',onUp);document.addEventListener('visibilitychange',onVisibility);
  return()=>{alive=false;cancelAnimationFrame(raf);ro.disconnect();canvas.removeEventListener('pointermove',pointer);canvas.removeEventListener('pointerdown',onDown);canvas.removeEventListener('pointerleave',exit);window.removeEventListener('pointerup',onUp);document.removeEventListener('visibilitychange',onVisibility)};
 },[]);
 return <canvas ref={ref} className="matrix-canvas" aria-label="Падающие цифровые символы формируют CODE_MUM"/>;
}
function App(){return <main><section className="hero">
 <MatrixBrand/>
 <header className="header"><strong>CODE_MUM<span>_</span></strong><small>СТУДИЯ ЦИФРОВОЙ РАЗРАБОТКИ</small></header>
 <div className="hero-content"><div className="eyebrow"><span className="status"/> КОД ПРЕВРАЩАЕТСЯ В РЕШЕНИЯ</div><h1 className="accessible-brand">CODE_MUM</h1><p>Разработка сайтов, приложений и ИИ-решений.</p><a href="mailto:hello@codemum.ru?subject=Обсудить%20проект">Обсудить проект <span>↗</span></a></div>
 <footer><span>WEB / APPS / AI</span><span>ДВИГАЙТЕ ПАЛЬЦЕМ ИЛИ МЫШЬЮ</span></footer>
 </section></main>}
createRoot(document.getElementById('root')).render(<App/>);
