import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

type Theme='dark'|'light';
type Profile={quality:number;fps:number;label:string};
function getProfile():Profile{
 const n=navigator as Navigator & {deviceMemory?:number;connection?:{saveData?:boolean}};
 const cores=n.hardwareConcurrency||4,ram=n.deviceMemory||4;
 if(n.connection?.saveData||cores<=2||ram<=2)return{quality:.5,fps:24,label:'Экономный'};
 if(cores<=4||ram<=4||Math.min(innerWidth,innerHeight)<650)return{quality:.72,fps:30,label:'Сбалансированный'};
 return{quality:1,fps:60,label:'Высокий'};
}
const services=[
 {id:'web',number:'01',title:'Сайты и магазины',desc:'От эффектного лендинга до интернет-магазина.',details:'Проектируем структуру, создаём адаптивный интерфейс, анимации, каталог, корзину и необходимые интеграции.',tags:['Лендинги','Магазины','Корпоративные сайты'],base:30000,options:[['Многостраничный сайт',15000],['Каталог и фильтры',20000],['Интерактив и анимации',12000],['CMS и управление',15000]]},
 {id:'mobile',number:'02',title:'Мобильные приложения',desc:'Удобные продукты, которые хочется открывать.',details:'Разрабатываем мобильные интерфейсы, локальные функции, интеграции с сервером и готовим продукт к выпуску.',tags:['Android','iOS','UX/UI'],base:90000,options:[['Личный кабинет',25000],['Офлайн-функции',20000],['API и интеграции',30000]]},
 {id:'bots',number:'03',title:'Боты и мини-приложения',desc:'Новые сценарии общения с вашим бизнесом.',details:'Каталоги, заявки, автоматизация, платежи и сервисы внутри мессенджеров.',tags:['Telegram','MAX','Mini Apps'],base:25000,options:[['Каталог услуг',12000],['Приём заявок',8000],['Оплата и заказы',18000]]},
 {id:'ai',number:'04',title:'ИИ и автоматизация',desc:'Интеллектуальные инструменты без лишней сложности.',details:'Встраиваем ИИ-помощников, автоматизируем рутинные задачи и соединяем существующие системы.',tags:['ИИ-ассистенты','Автоматизация','API'],base:35000,options:[['ИИ-ассистент',25000],['Интеграция с CRM',20000],['Обработка документов',18000]]},
 {id:'design',number:'05',title:'Дизайн и редизайн',desc:'Визуальный язык, который запоминается.',details:'Создаём дизайн-системы, интерактивные прототипы и переосмысляем существующие интерфейсы.',tags:['UX/UI','Редизайн','Анимация'],base:20000,options:[['Дизайн-система',20000],['Интерактивный прототип',15000],['Фирменный стиль',20000]]}
] as const;
const projects=[
 {id:'beauty',name:'Beauty Studio',type:'САЙТ · BEAUTY',description:'Премиальная эстетика, запись и интерактивные разделы.',url:'https://mumortsev.github.io/PIHTA/',color:'warm'},
 {id:'creative',name:'Музыка и Арт',type:'САЙТ · ТВОРЧЕСТВО',description:'Интерактивное пространство музыки и творчества.',url:'https://mumortsev.github.io/TO_startup/',color:'cool'}
];
const stages=[['01','Знакомство','Разбираемся в задаче, аудитории и результате.'],['02','Концепция','Определяем архитектуру, визуальный язык и сценарии.'],['03','Разработка','Создаём, анимируем и соединяем все функции.'],['04','Запуск','Тестируем, публикуем и помогаем развивать продукт.']];
function App(){
 const heroFrame=useRef<HTMLIFrameElement>(null);
 const zoneRef=useRef<HTMLDivElement>(null);
 const membraneRef=useRef<HTMLDivElement>(null);
 const meshCanvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
   const canvas=meshCanvas.current;
   const zone=zoneRef.current;
   const layer=membraneRef.current;
   if(!canvas||!zone||!layer)return;
   const ctx=canvas.getContext('2d');
   if(!ctx)return;
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   if(reduced)return;
   const size=720;
   const dpr=Math.min(window.devicePixelRatio||1,2);
   canvas.width=Math.round(size*dpr);canvas.height=Math.round(size*dpr);
   ctx.setTransform(dpr,0,0,dpr,0,0);
   let raf=0,interval=0,first=0,started=0;
   let previousX=-1,previousY=-1;
   const smooth=(x:number)=>{const v=Math.max(0,Math.min(1,x));return v*v*(3-2*v)};
   let seed=0,rotation=0;
   const draw=(now:number)=>{
     const t=Math.min((now-started)/3100,1);
     ctx.clearRect(0,0,size,size);
     const dark=zone.closest('.dark')!==null;
     const center=size/2;
     const appear=smooth(t/.11);
     const disappear=1-smooth((t-.64)/.36);
     const opacity=appear*disappear;
     const reach=65+400*smooth(t/.78);
     const hash=(n:number)=>{const v=Math.sin(n*127.1+seed*311.7)*43758.5453;return v-Math.floor(v)};
     const field=(x:number,y:number)=>{
       const dx=x-center,dy=y-center;
       const theta=Math.atan2(dy,dx)+rotation;
       const elliptical=Math.hypot(dx*1.07,dy*.91);
       const uneven=1+.14*Math.sin(theta*3+seed)+.075*Math.sin(theta*7-seed*2)+.04*Math.cos(theta*11+seed);
       const distance=elliptical/uneven;
       const leading=reach-distance;
       const reveal=smooth((leading+28)/90);
       const tail=1-smooth((leading-90)/260);
       const islands=.83+.17*Math.sin(x*.025+y*.017+seed*5)*Math.cos(y*.031-x*.013);
       return {strength:reveal*tail*opacity*Math.max(.35,islands),leading,theta};
     };
     const warp=(x:number,y:number):[number,number]=>{
       const f=field(x,y),dx=x-center,dy=y-center;
       const offset=8.5*f.strength*Math.sin(x*.023+y*.011+seed*3);
       return [x+offset+4*f.strength*Math.sin(y*.027+seed),y+7*f.strength*Math.sin(x*.019-seed*2)+2.5*f.strength*Math.cos(dy*.02)];
     };
     ctx.strokeStyle=dark?'rgba(162,220,250,.8)':'rgba(51,109,152,.78)';
     ctx.lineWidth=.95;
     const strokeSegment=(x1:number,y1:number,x2:number,y2:number,index:number)=>{
       const mx=(x1+x2)/2,my=(y1+y2)/2;
       const f=field(mx,my);
       if(f.strength<.014)return;
       const dropout=hash(index+Math.floor(t*14)*.73);
       if(dropout<.065*f.strength)return;
       const flicker=dropout>.94?1.16:1;
       ctx.globalAlpha=Math.min(.67,f.strength*.61*flicker);
       const [ax,ay]=warp(x1,y1),[bx,by]=warp(x2,y2);
       ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();
     };
     let index=0;
     for(let x=0;x<=size;x+=25){
       for(let y=0;y<size;y+=12)strokeSegment(x,y,x,Math.min(size,y+12),index++);
     }
     for(let y=0;y<=size;y+=25){
       for(let x=0;x<size;x+=12)strokeSegment(x,y,Math.min(size,x+12),y,index++);
     }
     ctx.globalAlpha=1;
     if(t<1&&document.visibilityState==='visible')raf=requestAnimationFrame(draw);
     else{raf=0;layer.classList.remove('visible');ctx.clearRect(0,0,size,size)}
   };
   const pulse=()=>{
     if(document.visibilityState!=='visible'||raf)return;
     const rect=zone.getBoundingClientRect();
     const top=Math.max(rect.top,0),bottom=Math.min(rect.bottom,window.innerHeight);
     if(bottom<=top+80)return;
     const viewportWidth=window.innerWidth;
     const visibleHeight=bottom-top;
     let x=viewportWidth*(.18+Math.random()*.64);
     let y=top+visibleHeight*(.18+Math.random()*.64);
     if(previousX>=0&&Math.hypot(x-previousX,y-previousY)<Math.min(160,viewportWidth*.3)){
       x=viewportWidth-x;
       y=top+bottom-y;
     }
     previousX=x;previousY=y;
     seed=Math.random()*10;
     rotation=Math.random()*Math.PI*2;
     layer.style.left=(x-rect.left)+'px';
     layer.style.top=(y-rect.top)+'px';
     layer.classList.add('visible');
     started=performance.now();
     raf=requestAnimationFrame(draw);
   };
   first=window.setTimeout(pulse,1400);
   interval=window.setInterval(pulse,10000);
   const onVisibility=()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;layer.classList.remove('visible');ctx.clearRect(0,0,size,size)}};
   document.addEventListener('visibilitychange',onVisibility);
   return()=>{window.clearTimeout(first);window.clearInterval(interval);document.removeEventListener('visibilitychange',onVisibility);if(raf)cancelAnimationFrame(raf)};
 },[]);
  const touchX=useRef<number|null>(null);
 const gesture=(x:number,y:number,dx:number)=>heroFrame.current?.contentWindow?.postMessage({type:'cm-gesture',x,y,dx},'*');
 const[theme,setTheme]=useState<Theme>(()=>{const saved=localStorage.getItem('cm-theme');return saved==='dark'||saved==='light'?saved:matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'});
 const[profile,setProfile]=useState<Profile>(getProfile);
 const[menu,setMenu]=useState(false);
 const[expanded,setExpanded]=useState<string|null>('web');
 const[project,setProject]=useState<(typeof projects)[number]|null>(null);
 const[device,setDevice]=useState<'desktop'|'mobile'>('desktop');
 const[chosen,setChosen]=useState<string[]>(['web']);
 const[extras,setExtras]=useState<string[]>([]);
 const[step,setStep]=useState(1);
 const[stage,setStage]=useState(0);
 const[faq,setFaq]=useState<number|null>(0);
 const [customProjects,setCustomProjects]=useState<{id:string;name:string;type:string;description:string;url:string;color:string}[]>([]);
 const total=services.filter(x=>chosen.includes(x.id)).reduce((sum,x)=>sum+x.base+x.options.reduce((n,o)=>n+(extras.includes(x.id+o[0])?o[1]:0),0),0);
 const toggle=(id:string)=>setChosen(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
 useEffect(()=>{if(!project)return;const esc=(e:KeyboardEvent)=>{if(e.key==='Escape')setProject(null)};window.addEventListener('keydown',esc);const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{window.removeEventListener('keydown',esc);document.body.style.overflow=old}},[project]);
 
 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('cm-theme',theme)},[theme]);
 useEffect(()=>{const handler=()=>setProfile(getProfile());window.addEventListener('resize',handler);return()=>window.removeEventListener('resize',handler)},[]);
 const base=import.meta.env.BASE_URL;
 const q=useMemo(()=>new URLSearchParams({theme,quality:String(profile.quality),fps:String(profile.fps)}).toString(),[theme,profile]);
 const heroUrl=base+'effects/sequin-wave.html?'+q+'&palette=silver';
 return <div className={'site '+theme+' variant-sequin-wave palette-'+(theme==='dark'?'graphite':'silver')}>
 <header className="site-header"><a href="#top" className="logo" aria-label="CODE M — наверх">CODE<span>_</span>M<span>.</span></a>
 <nav className="header-links"><a href="#services">Услуги</a><a href="#projects">Кейсы</a><a href="#calculator">Калькулятор</a><a href="#contact">Контакты</a></nav>
 <div className="header-controls"><button className="theme-toggle" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} aria-label="Переключить тему">{theme==='dark'?'☀':'☾'}<span>{theme==='dark'?'Светлая':'Тёмная'}</span></button><button className="menu-toggle" aria-label="Открыть меню" onClick={()=>setMenu(x=>!x)}>☰</button></div></header>
 {menu&&<nav className="mobile-menu"><a onClick={()=>setMenu(false)} href="#services">Услуги</a><a onClick={()=>setMenu(false)} href="#projects">Кейсы</a><a onClick={()=>setMenu(false)} href="#calculator">Калькулятор</a><a onClick={()=>setMenu(false)} href="#contact">Контакты</a></nav>}
 <main id="top">
 <section className="hero" aria-label="Первый экран" onTouchStart={e=>{touchX.current=e.touches[0]?.clientX??null;gesture(e.touches[0]?.clientX??0,e.touches[0]?.clientY??0,0)}} onTouchMove={e=>{const t=e.touches[0];if(!t)return;gesture(t.clientX,t.clientY,touchX.current===null?0:t.clientX-touchX.current);touchX.current=t.clientX}} onTouchEnd={()=>{touchX.current=null;gesture(-1,-1,0)}}>
 <iframe ref={heroFrame} key={heroUrl} className="hero-effect" src={heroUrl} title="Анимация Sequin Wave" tabIndex={-1}/>
 <div className="hero-shade"/>
 <div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> ЦИФРОВАЯ СТУДИЯ / CODE_M</div><h1>ЗА ГРАНЬЮ<br/><em>КОДА.</em></h1><p>Создаём сайты, приложения и цифровые продукты, в которых технологии встречаются с дизайном.</p><a className="primary-cta" href="#services">Исследовать возможности <span>↗</span></a></div>
 <div className="hero-foot"><span>ТЕХНОЛОГИИ · ДИЗАЙН · ДВИЖЕНИЕ</span><a href="#services">ЛИСТАЙТЕ ВНИЗ ↓</a></div>
 </section>
 <div className="content-zone" ref={zoneRef}>
 <div className="ambient-background" aria-hidden="true"><div className="aurora-field"/><div className="aurora-veil"/></div>
 <div className="membrane-touch" ref={membraneRef} aria-hidden="true"><canvas className="membrane-lines" ref={meshCanvas}/></div>\n <section id="services" className="content-section services"><div className="section-top"><span className="eyebrow">01 / ЭКСПЕРТИЗА</span><h2>Делаем сложное<br/><em>простым.</em></h2><p>Выберите направление — карточка раскроется и покажет, что входит в работу.</p></div>
 <div className="service-stack">{services.map(x=><article key={x.id} className={'service-expand '+(expanded===x.id?'is-open':'')}><button className="service-head" aria-expanded={expanded===x.id} onClick={()=>setExpanded(v=>v===x.id?null:x.id)}><span className="service-index">{x.number} /</span><span className="service-title"><strong>{x.title}</strong><small>{x.desc}</small></span><span className="round-control">{expanded===x.id?'−':'+'}</span></button><div className="service-reveal"><div className="service-inner"><p>{x.details}</p><div className="service-tags">{x.tags.map(t=><span key={t}>{t}</span>)}</div><a href="#calculator" onClick={()=>{setChosen(v=>v.includes(x.id)?v:[...v,x.id]);setStep(2)}}>Рассчитать проект <span>↗</span></a></div></div></article>)}</div></section>
 <section id="projects" className="content-section projects"><div className="section-top"><span className="eyebrow">02 / ИЗБРАННЫЕ ПРОЕКТЫ</span><h2>Идеи в<br/><em>действии.</em></h2><p>Открывайте кейсы прямо здесь: внутри — живые сайты, а не просто изображения.</p></div>
 <div className="project-grid">{[...projects,...customProjects].map((x,i)=><button key={x.id} className={'project-card project-'+x.color} onClick={()=>{setDevice('desktop');setProject(x)}}><div className="project-preview"><span className="project-glow"/><span className="preview-browser"><i/><i/><i/><span>{x.name}</span></span><span className="preview-word">{x.name}</span><span className="preview-lines"><b/><b/><b/></span></div><span className="project-bottom"><span><small>{x.type}</small><strong>{x.name}</strong><em>{x.description}</em></span><span className="round-control">↗</span></span></button>)}</div>
 <div className="project-note">Новые HTML-демо можно добавлять в каталог проектов. Для локального просмотра добавьте HTML в папку public/demos и укажите его путь в каталоге.</div></section>
 <section id="calculator" className="content-section calculator"><div className="section-top"><span className="eyebrow">03 / КОНФИГУРАТОР</span><h2>Соберите<br/><em>свой проект.</em></h2><p>Выберите услуги, настройте функции и получите ориентир по стоимости.</p></div>
 <div className="calc-shell"><div className="calc-top"><span>PROJECT BUILDER</span><span>ШАГ {String(step).padStart(2,'0')} / 03</span></div><div className="calc-progress"><span className={step>=1?'filled':''}/><span className={step>=2?'filled':''}/><span className={step>=3?'filled':''}/></div>
 <div className="calc-stage" key={step}>{step===1?<><h3>Что будем создавать?</h3><p>Можно выбрать сразу несколько направлений.</p><div className="calc-choices">{services.map(x=><button key={x.id} className={'calc-choice '+(chosen.includes(x.id)?'selected':'')} onClick={()=>toggle(x.id)}><span className="choice-check">{chosen.includes(x.id)?'✓':'+'}</span><strong>{x.title}</strong><small>от {x.base.toLocaleString('ru-RU')} ₽</small></button>)}</div></>:step===2?<><h3>Настроим детали</h3><p>Выберите необходимые функции для каждой услуги.</p>{services.filter(x=>chosen.includes(x.id)).map(x=><div className="calc-options" key={x.id}><h4>{x.title}</h4>{x.options.map(o=><label key={o[0]} className="calc-option"><input type="checkbox" checked={extras.includes(x.id+o[0])} onChange={()=>setExtras(v=>v.includes(x.id+o[0])?v.filter(k=>k!==x.id+o[0]):[...v,x.id+o[0]])}/><span>{o[0]}</span><small>+{o[1].toLocaleString('ru-RU')} ₽</small></label>)}</div>)}</>:<><h3>Ваш проект</h3><p>Предварительная оценка выбранной конфигурации.</p><div className="calc-summary">{services.filter(x=>chosen.includes(x.id)).map(x=><div key={x.id}><span>{x.title}</span><strong>{(x.base+x.options.reduce((n,o)=>n+(extras.includes(x.id+o[0])?o[1]:0),0)).toLocaleString('ru-RU')} ₽</strong></div>)}</div><p className="estimate-disclaimer">Расчёт ориентировочный. Точная стоимость определяется после обсуждения задачи.</p></>}</div>
 <div className="calc-footer"><div className="calc-price"><small>ПРЕДВАРИТЕЛЬНО ОТ</small><strong>{total.toLocaleString('ru-RU')} ₽</strong></div><div className="calc-actions">{step>1&&<button className="secondary-action" onClick={()=>setStep(s=>s-1)}>← Назад</button>}{step<3?<button className="solid-action" disabled={!chosen.length} onClick={()=>setStep(s=>s+1)}>Продолжить ↗</button>:<a className="solid-action" href="#contact">Обсудить проект ↗</a>}</div></div></div></section>
 <section id="approach" className="content-section approach"><div className="section-top"><span className="eyebrow">04 / ПРОЦЕСС</span><h2>От идеи<br/><em>до запуска.</em></h2><p>Прозрачный путь разработки — каждый шаг на своём месте.</p></div><div className="stage-nav">{stages.map((x,i)=><button key={x[0]} className={stage===i?'active':''} onClick={()=>setStage(i)}><span>{x[0]}</span><small>{x[1]}</small></button>)}</div><div className="stage-panel" key={stage}><span className="eyebrow">ЭТАП {stages[stage][0]}</span><h3>{stages[stage][1]}</h3><p>{stages[stage][2]}</p><div className="stage-buttons"><button disabled={stage===0} onClick={()=>setStage(i=>i-1)}>←</button><button disabled={stage===stages.length-1} onClick={()=>setStage(i=>i+1)}>→</button></div></div></section>
 <section className="content-section faq"><div className="section-top"><span className="eyebrow">05 / КОРОТКО О ГЛАВНОМ</span><h2>Вопросы<br/><em>и ответы.</em></h2></div><div className="faq-list">{[['Можно ли начать с небольшой идеи?','Да. Сначала обсудим задачу и определим разумный объём первой версии.'],['Можно ли доработать существующий сайт?','Да, можно обновить дизайн, ускорить сайт, добавить интерактив и новые функции.'],['Как определяется окончательная стоимость?','После уточнения объёма, интеграций и сроков составляется индивидуальная оценка.']].map((x,i)=><div className="faq-item" key={i}><button onClick={()=>setFaq(v=>v===i?null:i)} aria-expanded={faq===i}>{x[0]}<span>{faq===i?'−':'+'}</span></button><div className={'faq-answer '+(faq===i?'visible':'')}><p>{x[1]}</p></div></div>)}</div></section>
 <section id="contact" className="content-section contact"><span className="eyebrow">06 / НАЧНЁМ ДИАЛОГ</span><h2>Создадим<br/><em>что-то новое.</em></h2><p>Расскажите об идее. Мы подберём решение и обсудим детали проекта.</p><div className="contact-panel"><span>КОНТАКТЫ CODE_M</span><p>Каналы связи и форма заявки будут подключены после согласования контактных данных.</p><a href="#calculator" className="solid-action">Собрать проект ↗</a></div></section>
 </div></main>
 {project&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setProject(null)}}><section className="case-modal" role="dialog" aria-modal="true" aria-label={'Кейс '+project.name}><header className="modal-header"><div><span className="eyebrow">{project.type}</span><h3>{project.name}</h3></div><button className="modal-close" aria-label="Закрыть кейс" onClick={()=>setProject(null)}>✕</button></header><p className="modal-desc">{project.description}</p><div className="modal-toolbar"><div className="device-toggle"><button className={device==='desktop'?'active':''} onClick={()=>setDevice('desktop')}>Десктоп</button><button className={device==='mobile'?'active':''} onClick={()=>setDevice('mobile')}>Телефон</button></div><a href={project.url} target="_blank" rel="noopener noreferrer">Открыть отдельно ↗</a></div><div className={'modal-demo '+device}><iframe key={project.id} title={'Интерактивная демонстрация '+project.name} src={project.url} loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-forms allow-same-origin allow-popups"/></div><small className="modal-hint">Если сайт запрещает встраивание, используйте «Открыть отдельно».</small></section></div>}
 <footer className="site-footer"><span>© CODE_M</span><span>DESIGN BY MUMORTSEV</span><span>{profile.label.toUpperCase()} · {profile.fps} FPS</span></footer>
 </div>
}
createRoot(document.getElementById('root')!).render(<App/>);
