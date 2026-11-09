import React,{useEffect,useRef,useState} from 'react';
import{createRoot}from'react-dom/client';
import * as THREE from'three';
import './style.css';
const names=["Curl Swarm","Particle Morph","Wireframe Terrain","Glass","Tunnel","Portal","Topographic Contours","Aurora Gradient","VHS Tape","Warp Speed","Wave Field","Gear Train","Constellation","Plasma","Raymarched Metaballs","Voronoi","Domain Warping","Spiral","Warped Checkerboard","Tunnel Traversal","Ripples","Fractal Starfield","Lava","Perspective Grid","Kaleidoscope","HSV Rotation","Scanlines","Twin Metaballs","Volumetric Fog","Light Stripes","SDF Circle","CRT Screen","Julia Fractal","Snowfall","Oil-paint Noise","Event Horizon","Gilded Fracture","Kinetic Grid","Flow Field with Particle Trails","Torn Paper","Feedback Loop","Dither Gradient","Analog Drift","Shattered Plains","Painted Strata","Synth Ribbon","Hologram Glitch","Moonlit Ripple","Eclipse Glow","Chroma Halo"];
const family=[5,7,6,4,8,8,6,1,9,5,6,2,5,1,0,3,1,8,3,8,6,5,0,3,3,1,9,0,1,6,2,9,3,5,1,8,3,2,5,3,9,3,9,2,1,6,9,6,8,4];
const fragment=`
precision highp float;
uniform vec2 uRes,uPointer;
uniform float uTime,uActive,uSeed,uClick,uFamily;
uniform vec3 uA,uB;
varying vec2 vUv;
#define PI 3.14159265359
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*noise(p);p=p*2.02+vec2(12.1,4.2);a*=.5;}return s;}
vec3 palette(float t){return mix(uA,uB,clamp(t,0.,1.));}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);
 vec2 mouse=(uPointer-.5)*vec2(uRes.x/uRes.y,1.);
 float t=uTime*.24;float seed=uSeed;
 float d=length(uv-mouse);float influence=exp(-d*d*6.)*(.2+uClick*.8);
 vec2 p=uv;float f=0.;float glow=0.;
 float mode=mod(uFamily,10.);
 if(mode<.5){
  vec2 q=p*2.5;float n=fbm(q+vec2(t,-t*.4));float m=fbm(q*1.8+vec2(n*3.,-n*2.)+mouse*.9);
  f=smoothstep(.34,.68,m+.2*sin(n*9.+t*2.))+influence*.3;
  glow=pow(max(0.,f),2.)*.7;
 }else if(mode<1.5){
  vec2 q=p*2.5;float n=fbm(q+vec2(t*.3,0.));vec2 w=vec2(fbm(q+n*2.+t),fbm(q-n*2.-t));
  f=fbm(q+w*3.+mouse*1.4)+.18*sin(uv.x*7.+t);glow=f*.5;
 }else if(mode<2.5){
  vec2 q=p*7.;q+=.25*sin(q.yx*1.4+t*2.)+influence*vec2(1.,-1.);
  vec2 cell=abs(fract(q)-.5);float line=1.-smoothstep(.015,.055,min(cell.x,cell.y));
  f=line*.75+.1*fbm(q*.3);glow=line*.4;
 }else if(mode<3.5){
  vec2 q=p*4.+mouse*.3;vec2 g=floor(q),r=fract(q);float md=10.;
  for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){vec2 b=vec2(float(x),float(y));vec2 h=g+b;vec2 o=.5+.35*sin(t+6.28*vec2(hash(h),hash(h+9.)));md=min(md,length(b+o-r));}
  f=1.-smoothstep(.05,.7,md);glow=pow(f,3.)*.3;
 }else if(mode<4.5){
  vec2 q=p-mouse*.18;float r=length(q);float a=atan(q.y,q.x);
  float ring=sin(r*26.-t*5.+sin(a*8.+t)*2.+seed);f=.5+.5*ring;f*=exp(-r*.7);glow=exp(-r*r*3.)*.7;
 }else if(mode<5.5){
  vec2 q=p*9.;q+=vec2(sin(q.y*.6+t),cos(q.x*.7-t))*.7;
  vec2 id=floor(q);float star=pow(max(0.,1.-length(fract(q)-.5)*2.),13.);
  f=star*(.3+.7*hash(id));glow=star*1.2+influence*.4;
 }else if(mode<6.5){
  vec2 q=p;float bend=influence*.35+sin(q.x*5.+t)*.035;
  q.y+=bend;float line=abs(sin(q.y*23.+sin(q.x*4.+t)*.8));
  f=pow(1.-line,15.);glow=f*.9+influence*.16;
 }else if(mode<7.5){
  vec2 q=p*2.5;float n=fbm(q+vec2(t*.7,-t*.3));
  float h=sin((n+length(q-mouse)*.1)*32.+t*2.);
  f=smoothstep(.85,.97,h);glow=f*.4;
 }else if(mode<8.5){
  vec2 q=p;float a=atan(q.y,q.x),r=length(q);
  float spiral=sin(a*6.+log(r+.08)*12.-t*7.+seed);
  f=(.5+.5*spiral)*exp(-r*.65);glow=exp(-r*r*5.)*.6;
 }else{
  vec2 q=p*2.;float n=noise(q*14.+t*2.);
  float scan=sin(q.y*120.+t*3.)*.08;
  f=fbm(q+vec2(t*.2,0.))*.7+scan+n*.12;
  glow=pow(max(0.,f),3.)*.3;
 }
 float vignette=1.-smoothstep(.15,1.6,length(uv));
 float waves=sin(length(p-mouse)*25.-uTime*3.)*exp(-d*5.)*uClick*.2;
 float val=clamp(f+waves,0.,1.);
 vec3 col=palette(val*.85+glow*.4)*(.25+val*1.1+glow);
 col+=uB*glow*.18;col*=.28+.72*vignette;
 col+=vec3(.008,.012,.015);
 gl_FragColor=vec4(col,1.);
}
`;
const vertex='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
const palettes=[['#06191a','#7ce8d1'],['#140c26','#c59aff'],['#0b1324','#83baff'],['#1c120d','#ffcf92'],['#071a15','#83e7a6'],['#210e17','#f7a9bc'],['#15131c','#d2c2f2'],['#091a24','#7bdbff']];
function CanvasFX({index,tone,playing,burst}:{index:number;tone:number;playing:boolean;burst:number}){
 const el=useRef<HTMLDivElement>(null);const refs=useRef({x:.5,y:.5,tx:.5,ty:.5,click:0});
 useEffect(()=>{const host=el.current;if(!host)return;let frame=0;const renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(host.clientWidth,host.clientHeight);host.appendChild(renderer.domElement);const scene=new THREE.Scene();const camera=new THREE.Camera();const uniforms={uRes:{value:new THREE.Vector2(1,1)},uPointer:{value:new THREE.Vector2(.5,.5)},uTime:{value:0},uActive:{value:1},uSeed:{value:index*1.718},uClick:{value:0},uFamily:{value:family[index]},uA:{value:new THREE.Color(palettes[tone][0])},uB:{value:new THREE.Color(palettes[tone][1])}};const material=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms});const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);scene.add(mesh);const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);uniforms.uRes.value.set(renderer.domElement.width,renderer.domElement.height)};const ro=new ResizeObserver(resize);ro.observe(host);resize();let last=performance.now();const tick=(now:number)=>{const dt=Math.min((now-last)/1000,.06);last=now;const v=refs.current;v.x+=(v.tx-v.x)*Math.min(1,dt*8);v.y+=(v.ty-v.y)*Math.min(1,dt*8);v.click*=Math.exp(-dt*2.5);uniforms.uPointer.value.set(v.x,v.y);uniforms.uClick.value=v.click;if(playing)uniforms.uTime.value+=dt;renderer.render(scene,camera);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(frame);ro.disconnect();mesh.geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove()}},[index,tone,playing]);
 useEffect(()=>{refs.current.click=1},[burst]);
 return <div className="fx-canvas" ref={el} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();refs.current.tx=(e.clientX-r.left)/r.width;refs.current.ty=1-(e.clientY-r.top)/r.height}} onPointerDown={e=>{const r=e.currentTarget.getBoundingClientRect();refs.current.tx=(e.clientX-r.left)/r.width;refs.current.ty=1-(e.clientY-r.top)/r.height;refs.current.click=1}}/>;
}
function App(){
 const[index,setIndex]=useState(0),[tone,setTone]=useState(0),[playing,setPlaying]=useState(true),[menu,setMenu]=useState(false),[burst,setBurst]=useState(0),[minimal,setMinimal]=useState(false);
 const next=(n:number)=>{setIndex((n+50)%50);setMenu(false);setBurst(x=>x+1)};
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='ArrowRight')next(index+1);if(e.key==='ArrowLeft')next(index-1);if(e.key==='Escape')setMenu(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[index]);
 return <main className={'lab tone-'+tone+(minimal?' minimal':'')}>
 <CanvasFX index={index} tone={tone} playing={playing} burst={burst}/>
 <div className="shade"/>
 <header className="top"><div className="logo">CODE<span>_</span>MUM<span className="logo-dot">.</span></div><div className="top-right"><span className="studio">INTERACTIVE BACKGROUND LAB</span><button className="icon-button" onClick={()=>setMinimal(v=>!v)} title="Скрыть интерфейс">{minimal?'Показать UI':'◩'}</button></div></header>
 <section className="hero"><div className="eyebrow"><span className="live"/> DIGITAL MATERIAL / EXPERIMENT {String(index+1).padStart(2,'0')}</div><h1>Форма<br/><em>реакции.</em></h1><p>50 интерактивных фонов. Двигай курсором, касайся экрана и выбирай настроение.</p><div className="hero-line"><span>{names[index]}</span><span>{String(index+1).padStart(2,'0')} / 50</span></div></section>
 <div className="bottom"><div className="switch"><button onClick={()=>next(index-1)} aria-label="Предыдущий эффект">←</button><button className="choose" onClick={()=>setMenu(true)}><span className="choose-number">{String(index+1).padStart(2,'0')}</span><span className="choose-label">{names[index]}</span><span className="choose-arrow">⌄</span></button><button onClick={()=>next(index+1)} aria-label="Следующий эффект">→</button></div><div className="settings"><button onClick={()=>setPlaying(v=>!v)} title="Пауза или воспроизведение">{playing?'Ⅱ':'▶'}</button><button onClick={()=>setBurst(x=>x+1)} title="Импульс">✳</button><div className="swatches">{palettes.map((p,i)=><button key={i} className={tone===i?'active':''} style={{background:p[1]}} onClick={()=>setTone(i)} title={'Палитра '+(i+1)}/>)}</div></div></div>
 {menu&&<div className="overlay" onClick={()=>setMenu(false)}><div className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">EXPLORE / 50</span><h2>Все эффекты</h2></div><button onClick={()=>setMenu(false)} aria-label="Закрыть">✕</button></div><div className="effect-grid">{names.map((name,i)=><button key={name} className={index===i?'selected':''} onClick={()=>next(i)}><span>{String(i+1).padStart(2,'0')}</span><strong>{name}</strong><small>{['PARTICLES','GEOMETRY','SHADER','MOTION'][i%4]}</small></button>)}</div></div></div>}
 </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
