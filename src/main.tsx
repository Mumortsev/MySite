import React,{Suspense,useEffect,useRef,useState} from 'react';
import{createRoot}from'react-dom/client';
import{Canvas,useFrame,useThree}from'@react-three/fiber';
import{Environment,Float,MeshPortalMaterial}from'@react-three/drei';
import gsap from'gsap';
import * as THREE from'three';
import './style.css';

type Page='works'|'gallery'|'calculator'|'contacts';
const pages:{id:Page;label:string;eyebrow:string;title:string;intro:string}[]=[
{id:'works',label:'Работы',eyebrow:'01 / ПРОЕКТЫ',title:'Создаём цифровые впечатления.',intro:'Сайты, приложения и AI-инструменты, в которых технология работает на идею.'},
{id:'gallery',label:'Галерея',eyebrow:'02 / ЛАБОРАТОРИЯ',title:'Идеи обретают форму.',intro:'Эксперименты с пространством, типографикой, светом и интерактивностью.'},
{id:'calculator',label:'Калькулятор',eyebrow:'03 / ОЦЕНКА',title:'Давайте посчитаем.',intro:'Соберите предварительную конфигурацию вашего проекта.'},
{id:'contacts',label:'Контакты',eyebrow:'04 / СВЯЗЬ',title:'Начнём с разговора.',intro:'Расскажите, что хотите создать, — и мы обсудим возможный подход.'}
];
/* Drei MeshPortalMaterial is the official GitHub portal implementation.
   The sculpture is an architectural chrome aperture, not a torus knot. */
function PortalArchitecture({entered}:{entered:boolean}){
 const root=useRef<THREE.Group>(null);
 const portal=useRef<any>(null);
 const shell=useRef<THREE.Group>(null);
 useFrame(({clock,pointer},dt)=>{
  if(portal.current)portal.current.blend=THREE.MathUtils.damp(portal.current.blend,entered?1:0,1.7,dt);
  if(root.current){root.current.rotation.y=THREE.MathUtils.damp(root.current.rotation.y,entered?0:pointer.x*.08,1,dt);root.current.rotation.x=THREE.MathUtils.damp(root.current.rotation.x,entered?0:-pointer.y*.06,1,dt)}
  if(shell.current){shell.current.rotation.z=clock.elapsedTime*.018;const s=THREE.MathUtils.damp(shell.current.scale.x,entered?1.22:1,1.5,dt);shell.current.scale.setScalar(s)}
 });
 return <group ref={root}>
 <group ref={shell}>
  <mesh rotation={[0,0,0]}><torusGeometry args={[1.8,.085,20,160]}/><meshPhysicalMaterial color="#87968e" metalness={1} roughness={.13} clearcoat={1} envMapIntensity={2}/></mesh>
  <mesh rotation={[.18,.34,.22]}><torusGeometry args={[1.93,.026,12,160]}/><meshPhysicalMaterial color="#b4c3b9" metalness={1} roughness={.12}/></mesh>
  <mesh rotation={[-.16,-.24,-.28]}><torusGeometry args={[2.04,.018,12,160]}/><meshBasicMaterial color="#4cbf82" transparent opacity={.6}/></mesh>
  <mesh><ringGeometry args={[1.68,1.72,128]}/><meshBasicMaterial color="#6effa5" transparent opacity={.45} side={THREE.DoubleSide}/></mesh>
 </group>
 <mesh>
  <circleGeometry args={[1.69,128]}/>
  <MeshPortalMaterial ref={portal} blur={0.06} resolution={256} transparent>
   <color attach="background" args={['#020907']}/>
   <ambientLight intensity={.6}/>
   <pointLight position={[0,1,-3]} intensity={28} distance={12} color="#54e993"/>
   <Corridor/>
  </MeshPortalMaterial>
 </mesh>
 </group>;
}
function Corridor(){
 return <group position={[0,0,-3]}>
 {Array.from({length:15},(_,i)=>{const z=-i*4;return <group key={i} position={[0,0,z]}>
  <mesh position={[-3.3,0,0]}><boxGeometry args={[.1,5.5,.1]}/><meshStandardMaterial color="#385d4b" metalness={.8} roughness={.25}/></mesh>
  <mesh position={[3.3,0,0]}><boxGeometry args={[.1,5.5,.1]}/><meshStandardMaterial color="#385d4b" metalness={.8} roughness={.25}/></mesh>
  <mesh position={[0,2.75,0]}><boxGeometry args={[6.7,.1,.1]}/><meshStandardMaterial color="#385d4b" metalness={.8} roughness={.25}/></mesh>
  <mesh position={[0,-2.75,0]}><boxGeometry args={[6.7,.1,.1]}/><meshStandardMaterial color="#385d4b" metalness={.8} roughness={.25}/></mesh>
  <mesh position={[-3.2,0,.02]}><boxGeometry args={[.018,5.3,.025]}/><meshBasicMaterial color="#5adf94" transparent opacity={.45}/></mesh>
  <mesh position={[3.2,0,.02]}><boxGeometry args={[.018,5.3,.025]}/><meshBasicMaterial color="#5adf94" transparent opacity={.45}/></mesh>
 </group>})}
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2.79,-28]}><planeGeometry args={[6.7,70]}/><meshStandardMaterial color="#09140e" metalness={.7} roughness={.3}/></mesh>
 </group>;
}
function CameraRig({entered}:{entered:boolean}){
 const{camera}=useThree();const pos=useRef({z:8});
 useEffect(()=>{gsap.to(pos.current,{z:entered?-2.8:8,duration:entered?2.8:1.6,ease:'power3.inOut'})},[entered]);
 useFrame(({pointer},dt)=>{camera.position.z=pos.current.z;camera.position.x=THREE.MathUtils.damp(camera.position.x,pointer.x*(entered?.15:.25),1,dt);camera.position.y=THREE.MathUtils.damp(camera.position.y,pointer.y*(entered?.1:.16),1,dt);camera.lookAt(0,0,-2)});
 return null;
}
function World({entered,selected}:{entered:boolean;selected:Page}){
 return <Canvas dpr={[1,1.5]} camera={{position:[0,0,8],fov:42}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} onCreated={({gl})=>gl.setClearColor('#060a08')}>
 <fog attach="fog" args={['#060a08',9,67]}/>
 <ambientLight intensity={.75}/><hemisphereLight args={['#d7ffe8','#102519',1.1]}/>
 <spotLight position={[3,6,5]} intensity={100} distance={25} angle={.5} penumbra={1} color="#d3ffe6" />
 <pointLight position={[-4,-2,3]} intensity={35} distance={15} color="#2da66b"/>
 <Suspense fallback={null}><Environment preset="city"/></Suspense>
 <PortalArchitecture entered={entered}/><CameraRig entered={entered}/>
 </Canvas>;
}
function Calculator(){
 const[type,setType]=useState('site'),[pages,setPages]=useState(5),[ai,setAi]=useState(false);
 const base=type==='site'?35000:type==='app'?110000:65000;
 const total=base+(pages-1)*2500+(ai?30000:0);
 return <div className="form-panel"><label>Тип проекта<select value={type} onChange={e=>setType(e.target.value)}><option value="site">Веб-сайт</option><option value="app">Приложение</option><option value="ai">AI-инструмент</option></select></label><label>Количество экранов: {pages}<input type="range" min="1" max="20" value={pages} onChange={e=>setPages(Number(e.target.value))}/></label><label className="check"><input type="checkbox" checked={ai} onChange={e=>setAi(e.target.checked)}/> Интеграция AI</label><div className="estimate"><span>Ориентировочная стоимость</span><strong>{total.toLocaleString('ru-RU')} ₽</strong><small>Предварительная оценка, не публичная оферта</small></div></div>;
}
function Contacts(){
 const[name,setName]=useState(''),[address,setAddress]=useState(''),[message,setMessage]=useState('');
 return <form className="form-panel" onSubmit={e=>{e.preventDefault();window.location.href='mailto:hello@codemum.ru?subject='+encodeURIComponent('Проект CODE_MUM')+'&body='+encodeURIComponent(name+' / '+address+'\n\n'+message)}}>
 <label>Имя<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Как к вам обращаться"/></label>
 <label>Контакт<input required value={address} onChange={e=>setAddress(e.target.value)} placeholder="Email или Telegram"/></label>
 <label>Ваш проект<textarea required rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Расскажите об идее"/></label>
 <button className="primary" type="submit">Создать письмо ↗</button><small>Откроется почтовое приложение для отправки.</small></form>;
}
function App(){
 const[entered,setEntered]=useState(false),[selected,setSelected]=useState<Page>('works'),[transition,setTransition]=useState(false);
 const[reduced,setReduced]=useState(false);
 useEffect(()=>{const m=window.matchMedia('(prefers-reduced-motion: reduce)');setReduced(m.matches)},[]);
 const enter=()=>{if(transition)return;setTransition(true);setEntered(true);window.setTimeout(()=>setTransition(false),reduced?150:3000)};
 const leave=()=>{setEntered(false);setTransition(false)};
 const current=pages.find(p=>p.id===selected)!;
 return <main className={'app '+(entered?'is-entered':'is-intro')}>
 <div className="stage"><World entered={entered} selected={selected}/><div className="stage-vignette"/></div>
 <header className="site-header"><button className="brand" onClick={leave}>CODE<span>_</span>MUM</button>{entered&&<nav aria-label="Основная навигация">{pages.map(p=><button key={p.id} className={selected===p.id?'current':''} onClick={()=>setSelected(p.id)}>{p.label}</button>)}</nav>}<span className="header-index">DIGITAL STUDIO / 2026</span></header>
 {!entered?<section className="intro" aria-label="Главная"><div className="intro-copy"><div className="eyebrow"><i/> INDEPENDENT DIGITAL STUDIO</div><h1>Beyond<br/><em>the code.</em></h1><p>Создаём цифровые миры, которые хочется исследовать.</p><button className="primary enter" onClick={enter} disabled={transition}>Войти в пространство <span>↗</span></button></div><div className="intro-bottom"><span>ДИЗАЙН / РАЗРАБОТКА / AI</span><span>01 — ∞</span></div></section>:
 <section className="content" key={selected}><div className="content-head"><span className="eyebrow">{current.eyebrow}</span><h2>{current.title}</h2><p>{current.intro}</p></div>
 {(selected==='works'||selected==='gallery')&&<div className="projects">{(selected==='works'?['Сайты нового поколения','Мобильные продукты','Интеллектуальные инструменты']:['Пространственные интерфейсы','Живая типографика','Цифровые материалы']).map((name,i)=><article className="project" key={name}><span>0{i+1} / {selected==='works'?'НАПРАВЛЕНИЕ':'ЭКСПЕРИМЕНТ'}</span><div className={'project-art art-'+i}><div className="project-shape"/></div><h3>{name}</h3><p>{selected==='works'?'Направление работы студии':'Концептуальное исследование'}</p></article>)}</div>}
 {selected==='calculator'&&<Calculator/>}{selected==='contacts'&&<Contacts/>}
 <footer><span>CODE_MUM © 2026</span><button onClick={leave}>Вернуться к началу ↑</button></footer></section>}
 </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
