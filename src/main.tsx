import React,{Suspense,useEffect,useRef,useState} from 'react';
import{createRoot}from'react-dom/client';
import{Canvas,useFrame,useThree}from'@react-three/fiber';
import{Environment,Float}from'@react-three/drei';
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
function Sculpture({active}:{active:boolean}){
 const group=useRef<THREE.Group>(null);
 const knot=useRef<THREE.Mesh>(null);
 useFrame(({clock,pointer},dt)=>{
  if(!group.current||!knot.current)return;
  const t=clock.elapsedTime;
  group.current.rotation.y=THREE.MathUtils.damp(group.current.rotation.y,active?Math.PI*1.2+pointer.x*.12:pointer.x*.17+Math.sin(t*.17)*.2,1.4,dt);
  group.current.rotation.x=THREE.MathUtils.damp(group.current.rotation.x,pointer.y*.09+Math.sin(t*.24)*.08,1.1,dt);
  knot.current.rotation.z+=dt*(active?.19:.065);
  group.current.position.z=THREE.MathUtils.damp(group.current.position.z,active?-18:0,1.25,dt);
  const scale=active?1.8:1;
  group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x,scale,1.4,dt));
 });
 return <group ref={group} position={[0,0,0]}>
 <Float speed={1.1} rotationIntensity={.08} floatIntensity={.2}>
 <mesh ref={knot} castShadow><torusKnotGeometry args={[1.14,.32,220,24,2,3]}/><meshPhysicalMaterial color="#778a80" metalness={.94} roughness={.19} clearcoat={1} clearcoatRoughness={.12} envMapIntensity={1.6}/></mesh>
 <mesh rotation={[.4,.2,0]}><torusGeometry args={[1.58,.009,8,160]}/><meshBasicMaterial color="#75dca5" transparent opacity={.28}/></mesh>
 </Float></group>;
}
function Corridor({entered,selected}:{entered:boolean;selected:Page}){
 const root=useRef<THREE.Group>(null);
 useFrame((_,dt)=>{if(root.current)root.current.position.z=THREE.MathUtils.damp(root.current.position.z,entered?0:-25,1.5,dt)});
 return <group ref={root} position={[0,0,-25]}>
 {Array.from({length:11},(_,i)=>{const z=-i*5-5;return <group key={i} position={[0,0,z]}>
 <mesh position={[-5,0,0]}><boxGeometry args={[.14,7,.14]}/><meshStandardMaterial color="#223b31" metalness={.8} roughness={.35}/></mesh>
 <mesh position={[5,0,0]}><boxGeometry args={[.14,7,.14]}/><meshStandardMaterial color="#223b31" metalness={.8} roughness={.35}/></mesh>
 <mesh position={[0,3.5,0]}><boxGeometry args={[10,.12,.14]}/><meshStandardMaterial color="#1d3b2b" metalness={.75}/></mesh>
 <mesh position={[0,-3.5,0]}><boxGeometry args={[10,.1,.14]}/><meshStandardMaterial color="#183326" metalness={.75}/></mesh>
 <mesh position={[-4.9,0,.05]}><boxGeometry args={[.025,6.7,.04]}/><meshBasicMaterial color="#46bb7a" transparent opacity={.25}/></mesh>
 <mesh position={[4.9,0,.05]}><boxGeometry args={[.025,6.7,.04]}/><meshBasicMaterial color="#46bb7a" transparent opacity={.25}/></mesh>
 </group>})}
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,-3.54,-28]}><planeGeometry args={[10,80]}/><meshStandardMaterial color="#09140e" metalness={.5} roughness={.36}/></mesh>
 <mesh position={[0,0,-58]}><planeGeometry args={[10,7]}/><meshBasicMaterial color="#143724" transparent opacity={.6}/></mesh>
 </group>;
}
function CameraRig({entered}:{entered:boolean}){
 const{camera}=useThree();const pos=useRef({z:8});
 useEffect(()=>{gsap.to(pos.current,{z:entered?3.8:8,duration:entered?2.2:1.4,ease:'power3.inOut'})},[entered]);
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
 <Sculpture active={entered}/><Corridor entered={entered} selected={selected}/><CameraRig entered={entered}/>
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
 const enter=()=>{if(transition)return;setTransition(true);setEntered(true);window.setTimeout(()=>setTransition(false),reduced?150:2400)};
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
