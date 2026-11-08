import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

const MODES=[['Сеть','PARTICLE NETWORK'],['Точки','DOT GRID'],['3D-сетка','GRID DISTORTION'],['Терминал','FAULTY TERMINAL'],['Морфинг','PARTICLE MORPH']];
function CanvasEffect({mode}){
 const ref=useRef(null);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=0,h=0,dpr=1,raf=0,frame=0,points=[],glyphs=[],morph=[],active=true;
  const pointer={x:-9999,y:-9999,down:false};
  const random=(a,b)=>a+Math.random()*(b-a);
  function resize(){
   const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.6,Math.sqrt(1800000/(w*h)));canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
   const count=Math.min(320,Math.round(w*h/3200));
   points=Array.from({length:count},()=>({x:random(0,w),y:random(0,h),vx:random(-.18,.18),vy:random(-.18,.18),size:random(.6,2),phase:random(0,7)}));
   glyphs=Array.from({length:Math.ceil(w/19)},(_,i)=>({x:i*19,y:random(-h,0),speed:random(.5,2),chars:Array.from({length:18},()=>Math.random().toString(36)[2])}));
   const off=document.createElement('canvas');off.width=850;off.height=180;const oc=off.getContext('2d');oc.fillStyle='white';oc.textAlign='center';oc.textBaseline='middle';oc.font='900 112px Arial, sans-serif';oc.fillText('CODE_MUM',425,90);const data=oc.getImageData(0,0,850,180).data;
   morph=[];for(let y=0;y<180;y+=4)for(let x=0;x<850;x+=4){if(data[(y*850+x)*4+3]>150&&Math.random()>.38)morph.push({tx:x,ty:y,x:random(0,w),y:random(0,h),phase:random(0,6),size:random(.6,1.8)})}
  }
  function move(e){const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top}
  function leave(){pointer.x=-9999;pointer.y=-9999;pointer.down=false}
  function draw(){
   if(!active)return;frame++;ctx.fillStyle='#050910';ctx.fillRect(0,0,w,h);
   const t=frame*.012,cx=w/2,cy=h/2;
   const halo=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.72);halo.addColorStop(0,'#132339');halo.addColorStop(.5,'#09131f');halo.addColorStop(1,'#050910');ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
   if(mode===0){
    for(const p of points){const dx=p.x-pointer.x,dy=p.y-pointer.y,dist=Math.hypot(dx,dy);if(dist<150&&dist>1){p.x+=dx/dist*(pointer.down?5:1.7);p.y+=dy/dist*(pointer.down?5:1.7)}p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0}
    for(let i=0;i<points.length;i++){const p=points[i];for(let j=i+1;j<points.length;j++){const q=points[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<110){ctx.strokeStyle='rgba(104,178,255,'+(.2*(1-d/110))+')';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}ctx.fillStyle='#a7d6ff';ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,7);ctx.fill()}
   }else if(mode===1){
    const step=w<600?22:28;for(let y=step/2;y<h;y+=step)for(let x=step/2;x<w;x+=step){const d=Math.hypot(x-pointer.x,y-pointer.y),f=Math.max(0,1-d/175),size=1.2+f*3.5;ctx.fillStyle='rgba(145,199,255,'+(.3+f*.65)+')';ctx.beginPath();ctx.arc(x+Math.sin(t+y*.025)*f*6,y+Math.cos(t+x*.025)*f*6,size,0,7);ctx.fill()}
   }else if(mode===2){
    const step=w<600?24:32;const warp=(x,y)=>{const d=Math.hypot(x-pointer.x,y-pointer.y),power=Math.max(0,1-d/210);return [x+(x-pointer.x)*power*.24,y+(y-pointer.y)*power*.24+Math.sin(x*.009+t+y*.006)*12]};
    ctx.lineWidth=.8;ctx.strokeStyle='rgba(111,179,246,.32)';for(let y=-step;y<h+step;y+=step){ctx.beginPath();for(let x=-step;x<w+step;x+=8){const [a,b]=warp(x,y);if(x===-step)ctx.moveTo(a,b);else ctx.lineTo(a,b)}ctx.stroke()}for(let x=-step;x<w+step;x+=step){ctx.beginPath();for(let y=-step;y<h+step;y+=8){const [a,b]=warp(x,y);if(y===-step)ctx.moveTo(a,b);else ctx.lineTo(a,b)}ctx.stroke()}
    const glow=ctx.createRadialGradient(pointer.x,pointer.y,0,pointer.x,pointer.y,190);glow.addColorStop(0,'#3a8bd633');glow.addColorStop(1,'#3a8bd600');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
   }else if(mode===3){
    ctx.font='12px monospace';for(const g of glyphs){g.y+=g.speed*(pointer.down?2.5:1);if(g.y>h+320)g.y=-random(100,400);g.chars.forEach((c,i)=>{const y=g.y-i*19;if(y<0||y>h)return;const near=Math.abs(g.x-pointer.x)<80&&Math.abs(y-pointer.y)<100;ctx.fillStyle=i===0?'#b9f8e8':near?'#a4f8d2':'rgba(55,184,153,'+(.12+(1-i/18)*.4)+')';ctx.fillText(c,g.x,y)});if(frame%15===0)g.chars[Math.floor(random(0,18))]=Math.random().toString(36)[2]}
    ctx.fillStyle='rgba(109,230,200,.045)';for(let y=0;y<h;y+=5)ctx.fillRect(0,y,w,1);
   }else{
    const scale=Math.min((w*.85)/850,Math.min(h*.26/180,1.3));for(const p of morph){const tx=cx+(p.tx-425)*scale,ty=cy+(p.ty-90)*scale;const dx=p.x-pointer.x,dy=p.y-pointer.y,d=Math.hypot(dx,dy);if(d<105&&d>0){p.x+=dx/d*(pointer.down?13:5);p.y+=dy/d*(pointer.down?13:5)}p.x+=(tx-p.x)*.047;p.y+=(ty-p.y)*.047;ctx.fillStyle='rgba(180,220,255,'+(.55+.35*Math.sin(t+p.phase))+')';ctx.fillRect(p.x,p.y,p.size+scale*.5,p.size+scale*.5)}
   }
   if(!reduce)raf=requestAnimationFrame(draw);
  }
  const ro=new ResizeObserver(resize);ro.observe(canvas);resize();draw();
  const visibility=()=>{active=!document.hidden;if(active){cancelAnimationFrame(raf);raf=requestAnimationFrame(draw)}};
  document.addEventListener('visibilitychange',visibility);
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',move);const down=()=>pointer.down=true,up=()=>pointer.down=false;canvas.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);canvas.addEventListener('pointerleave',leave);
  return()=>{active=false;cancelAnimationFrame(raf);ro.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerdown',move);canvas.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);canvas.removeEventListener('pointerleave',leave)};
 },[mode]);
 return <canvas ref={ref} className="effect-canvas" aria-hidden="true"/>;
}
function App(){
 const [mode,setMode]=useState(0);
 return <main><section className="hero" aria-label="CODE_MUM: пять интерактивных вариантов Hero">
 <CanvasEffect key={mode} mode={mode}/>
 <header><strong>CODE_MUM<span className="header-dot">.</span></strong><span>DIGITAL DEVELOPMENT STUDIO</span></header>
 <div className={'center '+(mode===4?'center-morph':'')}><div className="eyebrow">WEB DEVELOPMENT <b> / </b> MOBILE APPS <b> / </b> ARTIFICIAL INTELLIGENCE</div><h1>CODE<span>_</span>MUM</h1><p>Цифровые решения с характером.</p></div>
 <div className="bottom"><div className="mode-caption"><span>0{mode+1} / 05</span><strong>{MODES[mode][1]}</strong></div><nav aria-label="Выбор эффекта">{MODES.map(([label],i)=><button key={label} className={mode===i?'active':''} aria-pressed={mode===i} onClick={()=>setMode(i)}><span className="number">0{i+1}</span><span>{label}</span></button>)}</nav><span className="hint">ПРОВЕДИТЕ ПАЛЬЦЕМ ИЛИ КУРСОРОМ</span></div>
 </section></main>;
}
createRoot(document.getElementById('root')).render(<App/>);
