import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

type Variant='vertigo'|'sequin-wave';
type Theme='dark'|'light';
type Profile={quality:number;fps:number;label:string};
function getProfile():Profile{
 const n=navigator as Navigator & {deviceMemory?:number;connection?:{saveData?:boolean}};
 const cores=n.hardwareConcurrency||4,ram=n.deviceMemory||4;
 if(n.connection?.saveData||cores<=2||ram<=2)return{quality:.5,fps:24,label:'Экономный'};
 if(cores<=4||ram<=4||Math.min(innerWidth,innerHeight)<650)return{quality:.72,fps:30,label:'Сбалансированный'};
 return{quality:1,fps:60,label:'Высокий'};
}
const cards=[
 {number:'01',title:'Сайты и магазины',desc:'Выразительные цифровые пространства, которые работают на ваш бизнес.'},
 {number:'02',title:'Мобильные приложения',desc:'Продуманные интерфейсы и удобные продукты для Android и других платформ.'},
 {number:'03',title:'ИИ и автоматизация',desc:'Умные инструменты, которые ускоряют процессы и открывают новые возможности.'},
 {number:'04',title:'Дизайн и анимация',desc:'Визуальные системы с характером, движением и вниманием к деталям.'}
];
function App(){
 const[variant,setVariant]=useState<Variant>('vertigo');
 const[theme,setTheme]=useState<Theme>(()=>{const saved=localStorage.getItem('cm-theme');return saved==='dark'||saved==='light'?saved:matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'});
 const[profile,setProfile]=useState<Profile>(getProfile);
 const[menu,setMenu]=useState(false);
 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('cm-theme',theme)},[theme]);
 useEffect(()=>{const handler=()=>setProfile(getProfile());window.addEventListener('resize',handler);return()=>window.removeEventListener('resize',handler)},[]);
 const base=import.meta.env.BASE_URL;
 const q=useMemo(()=>new URLSearchParams({theme,quality:String(profile.quality),fps:String(profile.fps)}).toString(),[theme,profile]);
 const heroUrl=base+'effects/'+variant+'.html?'+q;
 const rainUrl=base+'effects/digital-rain.html?'+q+'&plain=1';
 return <div className={'site '+theme+' variant-'+variant}>
 <header className="site-header"><a href="#top" className="logo" aria-label="CODE MUM — наверх">CODE<span>_</span>MUM<span>.</span></a>
 <nav className="header-links"><a href="#services">Услуги</a><a href="#approach">Подход</a><a href="#contact">Контакты</a></nav>
 <div className="header-controls"><div className="variant-toggle" role="group" aria-label="Эффект первого экрана"><button className={variant==='vertigo'?'active':''} onClick={()=>setVariant('vertigo')}>VERTIGO</button><button className={variant==='sequin-wave'?'active':''} onClick={()=>setVariant('sequin-wave')}>SEQUIN WAVE</button></div><button className="theme-toggle" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} aria-label="Переключить тему">{theme==='dark'?'☀':'☾'}<span>{theme==='dark'?'Светлая':'Тёмная'}</span></button><button className="menu-toggle" aria-label="Открыть меню" onClick={()=>setMenu(x=>!x)}>☰</button></div></header>
 {menu&&<nav className="mobile-menu"><a onClick={()=>setMenu(false)} href="#services">Услуги</a><a onClick={()=>setMenu(false)} href="#approach">Подход</a><a onClick={()=>setMenu(false)} href="#contact">Контакты</a></nav>}
 <main id="top">
 <section className="hero" aria-label="Первый экран">
 <iframe key={heroUrl} className="hero-effect" src={heroUrl} title={'Анимация '+variant} tabIndex={-1}/>
 <div className="hero-shade"/>
 <div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> ЦИФРОВАЯ СТУДИЯ / CODE_MUM</div><h1>ЗА ГРАНЬЮ<br/><em>КОДА.</em></h1><p>Создаём сайты, приложения и цифровые продукты, в которых технологии встречаются с дизайном.</p><a className="primary-cta" href="#services">Исследовать возможности <span>↗</span></a></div>
 <div className="hero-foot"><span>ДВА ВАРИАНТА · ОДНА ЭСТЕТИКА</span><a href="#services">ЛИСТАЙТЕ ВНИЗ ↓</a></div>
 </section>
 <div className="content-zone">
 <iframe key={rainUrl} className="rain-effect" src={rainUrl} title="Цифровой дождь — фон следующих разделов" tabIndex={-1}/>
 <div className="rain-tint"/>
 <section id="services" className="content-section services"><div className="section-top"><span className="eyebrow">01 / НАШИ НАПРАВЛЕНИЯ</span><h2>Идеи становятся<br/><em>реальностью.</em></h2><p>От первой концепции до готового продукта — эстетика, функциональность и современные технологии.</p></div><div className="service-grid">{cards.map(c=><article className="service-card" key={c.number}><span className="card-number">{c.number} /</span><h3>{c.title}</h3><p>{c.desc}</p><span className="card-arrow" aria-hidden="true">↗</span></article>)}</div></section>
 <section id="approach" className="content-section approach"><div className="eyebrow">02 / НАШ ПОДХОД</div><h2>Не просто код.<br/><em>Впечатление.</em></h2><p>Внимание к деталям, адаптивность и плавная анимация — не дополнительные опции, а часть каждого проекта.</p><div className="approach-tags"><span>ДИЗАЙН</span><span>ТЕХНОЛОГИИ</span><span>ДВИЖЕНИЕ</span></div></section>
 <section id="contact" className="content-section contact"><span className="eyebrow">03 / СОТРУДНИЧЕСТВО</span><h2>Создадим<br/><em>что-то новое.</em></h2><p>Расскажите о своей идее — и мы найдём для неё выразительную цифровую форму.</p><a href="mailto:hello@example.com" className="contact-note" onClick={e=>e.preventDefault()}>Контактные данные будут добавлены позже</a></section>
 <footer className="site-footer"><span>© CODE_MUM</span><span>DESIGN BY MUMORTSEV</span><span>{profile.label.toUpperCase()} · {profile.fps} FPS</span></footer>
 </div></main></div>
}
createRoot(document.getElementById('root')!).render(<App/>);
