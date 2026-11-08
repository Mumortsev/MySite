import React,{Suspense,useEffect,useRef,useState} from 'react';
import{createRoot}from'react-dom/client';
import{Canvas,useFrame,useThree}from'@react-three/fiber';
import{Environment,Float,Text}from'@react-three/drei';
import gsap from'gsap';
import * as THREE from'three';
import './style.css';

type Page='works'|'gallery'|'calculator'|'contacts';
type Location='intro'|'hall'|Page;
const pages:{id:Page;label:string;z:number;side:number;title:string;intro:string}[]=[
{id:'works',label:'Работы',z:-15,side:-1,title:'Работы',intro:'Сайты, приложения и цифровые продукты.'},
{id:'gallery',label:'Галерея',z:-29,side:1,title:'Галерея',intro:'Эксперименты с формой, светом и интерактивностью.'},
{id:'calculator',label:'Калькулятор',z:-43,side:-1,title:'Калькулятор',intro:'Рассчитайте ориентировочную стоимость.'},
{id:'contacts',label:'Контакты',z:-57,side:1,title:'Контакты',intro:'Обсудим ваш проект.'}
];
const POS=(p:Location):[number,number,number]=>p==='intro'?[0,0,8]:p==='hall'?[0,0,2]:(()=>{const a=pages.find(x=>x.id===p)!;return[a.side*8.6,0,a.z]})();
const TARGET=(p:Location):[number,number,number]=>p==='intro'?[0,0,0]:p==='hall'?[0,0,-12]:(()=>{const a=pages.find(x=>x.id===p)!;return[a.side*13,0,a.z]})();
function Portal(){
 const g=useRef<THREE.Group>(null);
 useFrame(({clock})=>{if(g.current)g.current.rotation.z=Math.sin(clock.elapsedTime*.22)*.04});
 return <group ref={g} position={[0,0,0]}>
 {[1.8,1.94,2.06].map((r,i)=><mesh key={r} rotation={[i*.16,i*.11,0]}><torusGeometry args={[r,i===0?.085:.018,16,128]}/><meshPhysicalMaterial color={i===2?'#4bc985':'#9aa9a1'} metalness={i===2?.6:1} roughness={.17} emissive={i===2?'#1b5735':'#000000'} emissiveIntensity={.4}/></mesh>)}
 <mesh><ringGeometry args={[1.68,1.73,128]}/><meshBasicMaterial color="#53c98a" transparent opacity={.5} side={THREE.DoubleSide}/></mesh>
 </group>;
}
function Building({onEnter}:{onEnter:(p:Page)=>void}){
 return <group>
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,-3.25,-32]}><planeGeometry args={[10,78]}/><meshStandardMaterial color="#0d1912" metalness={.4} roughness={.45}/></mesh>
 <mesh rotation={[Math.PI/2,0,0]} position={[0,3.25,-32]}><planeGeometry args={[10,78]}/><meshStandardMaterial color="#0d1812" metalness={.35}/></mesh>
 {[-5,5].flatMap(x=>Array.from({length:18},(_,i)=>{const z=5-i*4;const opening=pages.some(p=>p.side===Math.sign(x)&&Math.abs(p.z-z)<3);return opening?null:<mesh key={x+'-'+i} position={[x,0,z]}><boxGeometry args={[.12,6.5,4]}/><meshStandardMaterial color="#182a20" metalness={.65} roughness={.3}/></mesh>}))}
 {Array.from({length:17},(_,i)=><group key={i} position={[0,0,-i*4]}>
 <mesh position={[0,3.15,0]}><boxGeometry args={[10,.07,.08]}/><meshBasicMaterial color="#377d54"/></mesh>
 <mesh position={[-4.9,0,0]}><boxGeometry args={[.06,6.3,.06]}/><meshBasicMaterial color="#377d54"/></mesh>
 <mesh position={[4.9,0,0]}><boxGeometry args={[.06,6.3,.06]}/><meshBasicMaterial color="#377d54"/></mesh>
 </group>)}
 {pages.map((p,i)=><group key={p.id}>
 {/* Each doorway exists at a permanent coordinate in the building. */}
 <group position={[p.side*4.95,0,p.z]} rotation={[0,p.side*Math.PI/2,0]}>
 <mesh position={[0,2.8,0]}><boxGeometry args={[4.3,.2,.28]}/><meshStandardMaterial color="#91a69b" metalness={.85} roughness={.2}/></mesh>
 <mesh position={[-2.15,0,0]}><boxGeometry args={[.2,5.6,.28]}/><meshStandardMaterial color="#91a69b" metalness={.85} roughness={.2}/></mesh>
 <mesh position={[2.15,0,0]}><boxGeometry args={[.2,5.6,.28]}/><meshStandardMaterial color="#91a69b" metalness={.85} roughness={.2}/></mesh>
 <mesh position={[0,-2.8,0]}><boxGeometry args={[4.3,.2,.28]}/><meshStandardMaterial color="#91a69b" metalness={.85} roughness={.2}/></mesh>
 <mesh position={[0,0,-.12]}><planeGeometry args={[4.05,5.35]}/><meshBasicMaterial color="#0d3220" side={THREE.DoubleSide}/></mesh>
 <Text position={[0,.55,.12]} fontSize={.49} maxWidth={3.7} anchorX="center" anchorY="middle" color="#e5fff0">{p.label}</Text>
 <Text position={[0,-.12,.13]} fontSize={.16} anchorX="center" color="#76d49c">{String(i+1).padStart(2,'0')} / CODE_MUM</Text>
 <mesh position={[0,0,.22]} onClick={e=>{e.stopPropagation();onEnter(p.id)}}><planeGeometry args={[4.05,5.35]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>
 </group>
 {/* The room behind each doorway remains in the scene, not a sliding HTML panel. */}
 <group position={[p.side*9,0,p.z]}>
 <mesh position={[p.side*2,0,0]}><boxGeometry args={[.12,6.4,9]}/><meshStandardMaterial color="#14251a" side={THREE.DoubleSide}/></mesh>
 <mesh position={[0,-3.2,0]}><boxGeometry args={[8,.1,9]}/><meshStandardMaterial color="#132419" roughness={.35}/></mesh>
 <mesh position={[0,3.2,0]}><boxGeometry args={[8,.1,9]}/><meshStandardMaterial color="#14251a"/></mesh>
 {[-4.4,4.4].map(z=><mesh key={z} position={[0,0,z]}><boxGeometry args={[8,6.4,.1]}/><meshStandardMaterial color="#102117" side={THREE.DoubleSide}/></mesh>)}
 <pointLight position={[0,2,0]} color="#5bcf8e" intensity={22} distance={12}/>
 <mesh position={[0,0,0]}><boxGeometry args={[2.2,2.2,2.2]}/><meshPhysicalMaterial color="#3c7254" metalness={.85} roughness={.2} wireframe/></mesh>
 </group>
 </group>)}
 </group>;
}
function CameraTravel({destination,onArrive}:{destination:Location;onArrive:(p:Location)=>void}){
 const{camera}=useThree();
 const progress=useRef({x:0,y:0,z:8,tx:0,ty:0,tz:0});
 const timeline=useRef<gsap.core.Timeline|null>(null);
 useEffect(()=>{
 timeline.current?.kill();
 const v=progress.current;const target=POS(destination),look=TARGET(destination);
 const tl=gsap.timeline({onComplete:()=>onArrive(destination)});
 if(destination==='intro'){tl.to(v,{x:0,y:0,z:8,tx:0,ty:0,tz:0,duration:2,ease:'power2.inOut'});}
 else if(destination==='hall'){tl.to(v,{x:0,y:0,z:2,tx:0,ty:0,tz:-12,duration:2.3,ease:'power2.inOut'});}
 else {
 const p=pages.find(p=>p.id===destination)!;
 // Travel along the corridor first, stop at the actual door, turn, then enter.
 tl.to(v,{x:0,y:0,z:p.z+5,tx:0,ty:0,tz:p.z-8,duration:Math.max(2.3,Math.abs(v.z-(p.z+5))*.085),ease:'power2.inOut'});
 tl.to(v,{tx:p.side*8,ty:0,tz:p.z,duration:1.05,ease:'power2.inOut'});
 tl.to(v,{x:target[0],y:target[1],z:target[2],tx:look[0],ty:look[1],tz:look[2],duration:1.6,ease:'power2.inOut'});
 }
 timeline.current=tl;return()=>{tl.kill()};
 },[destination]);
 useFrame(()=>{const v=progress.current;camera.position.set(v.x,v.y,v.z);camera.lookAt(v.tx,v.ty,v.tz)});
 return null;
}
function World({destination,onArrive,onDoor}:{destination:Location;onArrive:(p:Location)=>void;onDoor:(p:Page)=>void}){
 return <Canvas dpr={[1,1.5]} camera={{position:[0,0,8],fov:55}} gl={{antialias:true,powerPreference:'high-performance'}} onCreated={({gl})=>gl.setClearColor('#060a08')}>
 <fog attach="fog" args={['#060a08',12,86]}/><ambientLight intensity={.8}/><hemisphereLight args={['#e4fff0','#13291b',1.1]}/><pointLight position={[1,3,5]} intensity={65} distance={18} color="#b8ffda"/>
 <Suspense fallback={null}><Environment preset="city"/></Suspense>
 <Portal/><Building onEnter={onDoor}/><CameraTravel destination={destination} onArrive={onArrive}/>
 </Canvas>;
}
function Calculator(){
 const[type,setType]=useState('site'),[screens,setScreens]=useState(5),[ai,setAi]=useState(false);
 const total=(type==='site'?35000:type==='app'?110000:65000)+(screens-1)*2500+(ai?30000:0);
 return <div className="form-panel"><label>Тип проекта<select value={type} onChange={e=>setType(e.target.value)}><option value="site">Сайт</option><option value="app">Приложение</option><option value="ai">AI-инструмент</option></select></label><label>Экранов: {screens}<input type="range" min="1" max="20" value={screens} onChange={e=>setScreens(+e.target.value)}/></label><label className="check"><input type="checkbox" checked={ai} onChange={e=>setAi(e.target.checked)}/>AI-интеграция</label><div className="estimate"><span>Предварительная оценка</span><strong>{total.toLocaleString('ru-RU')} ₽</strong></div></div>;
}
function Contacts(){return <form className="form-panel" onSubmit={e=>{e.preventDefault();const d=new FormData(e.currentTarget);location.href='mailto:hello@codemum.ru?subject=CODE_MUM&body='+encodeURIComponent([...d.entries()].map(([k,v])=>k+': '+v).join('\n'))}}><label>Имя<input name="Имя" required/></label><label>Контакт<input name="Контакт" required/></label><label>Описание<textarea name="Проект" rows={4} required/></label><button className="primary" type="submit">Создать письмо ↗</button></form>}
function App(){
 const[destination,setDestination]=useState<Location>('intro');
 const[arrived,setArrived]=useState<Location>('intro');
 const go=(p:Location)=>{setArrived('intro');setDestination(p)};
 const current=pages.find(p=>p.id===arrived);
 return <main className={'app spatial-app '+(destination==='intro'?'is-intro':'is-entered')}>
 <div className="stage spatial-stage"><World destination={destination} onArrive={setArrived} onDoor={go}/><div className="stage-vignette"/></div>
 <header className="site-header"><button className="brand" onClick={()=>go('intro')}>CODE<span>_</span>MUM</button>{destination!=='intro'&&<nav aria-label="Перейти к комнате">{pages.map(p=><button key={p.id} className={destination===p.id?'current':''} onClick={()=>go(p.id)}>{p.label}</button>)}</nav>}<span className="header-index">SPATIAL STUDIO</span></header>
 {destination==='intro'&&<section className="intro"><div className="intro-copy"><div className="eyebrow">INDEPENDENT DIGITAL STUDIO</div><h1>Beyond<br/><em>the code.</em></h1><p>Четыре комнаты. Одно цифровое пространство.</p><button className="primary" onClick={()=>go('hall')}>Войти в коридор ↗</button></div></section>}
 {destination!=='intro'&&<div className="spatial-hud"><button onClick={()=>go('hall')}>⌂ Коридор</button><span>{destination==='hall'?'ВЫБЕРИТЕ ДВЕРЬ В ПРОСТРАНСТВЕ':current?'КОМНАТА / '+current.label.toUpperCase():'ИДЁМ К КОМНАТЕ'}</span></div>}
 {arrived!=='intro'&&arrived!=='hall'&&destination===arrived&&<section className="room-ui" aria-label={'Комната '+current?.label}><div className="room-content"><span className="eyebrow">CODE_MUM / {current?.label.toUpperCase()}</span><h2>{current?.title}</h2><p>{current?.intro}</p>{arrived==='calculator'?<Calculator/>:arrived==='contacts'?<Contacts/>:<div className="room-tiles">{(arrived==='works'?['Веб-проекты','Мобильные приложения','AI-решения']:['3D-интерфейсы','Типографика','Эксперименты']).map((s,i)=><article key={s}><span>0{i+1}</span><h3>{s}</h3></article>)}</div>}<button className="back-hall" onClick={()=>go('hall')}>← Вернуться в коридор</button></div></section>}
 </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
