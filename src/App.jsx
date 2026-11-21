import {useEffect,useRef,useState} from 'react';
import {motion,useScroll,useSpring,useReducedMotion,AnimatePresence} from 'framer-motion';
import {LINKS,NAV,STATS,SKILLS,JOBS,PROJECTS,CERTS} from './data.js';
import Game from './Game.jsx';

const ease=[.22,1,.36,1];
function Reveal({children,delay=0,as='div',className=''}){const r=useReducedMotion();const M=motion[as];
  return <M className={className} initial={r?false:{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} transition={{duration:.9,ease,delay}}>{children}</M>}
function ClipImg({src,alt,className='',onClick,eager}){const r=useReducedMotion();
  return <motion.button type="button" className={'clip '+className} onClick={onClick} aria-label={'Open '+alt} initial={r?false:{clipPath:'inset(0 0 100% 0)'}} whileInView={{clipPath:'inset(0 0 0% 0)'}} viewport={{once:true,margin:'-60px'}} transition={{duration:1.1,ease}}>
    <img src={src} alt={alt} loading={eager?'eager':'lazy'} decoding="async"/></motion.button>}
function Magnetic({children,...p}){const ref=useRef(null);const r=useReducedMotion();
  const mv=e=>{if(r||!ref.current)return;const b=ref.current.getBoundingClientRect();ref.current.style.transform=`translate(${(e.clientX-b.left-b.width/2)*.18}px,${(e.clientY-b.top-b.height/2)*.28}px)`};
  return <a ref={ref} {...p} onMouseMove={mv} onMouseLeave={()=>{if(ref.current)ref.current.style.transform=''}}>{children}</a>}
function Count({n,pre,suf}){const ref=useRef(null),[v,setV]=useState(0),r=useReducedMotion();
  useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;io.disconnect();if(r){setV(n);return}const t0=performance.now();const f=t=>{const p=Math.min(1,(t-t0)/1600);setV(Math.round(n*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)},{threshold:.6});io.observe(el);return()=>io.disconnect()},[n,r]);
  return <span ref={ref}>{pre&&v<10?pre:''}{v}{suf}</span>}

function Loader({done}){return <motion.div className="loader" initial={{y:0}} animate={{y:'-100%'}} transition={{duration:.9,ease,delay:1.3}} onAnimationComplete={done} aria-hidden="true"><motion.span initial={{opacity:0,letterSpacing:'.6em'}} animate={{opacity:1,letterSpacing:'.2em'}} transition={{duration:1,ease}}>MMA®</motion.span></motion.div>}

function Nav({active}){const [open,setOpen]=useState(false);const {scrollYProgress}=useScroll();const sx=useSpring(scrollYProgress,{stiffness:120,damping:24});
  return <header className="nav"><motion.div className="progress" style={{scaleX:sx}}/>
    <a href="#home" className="brand" aria-label="MMA home">MMA<sup>®</sup></a>
    <nav aria-label="Primary" className={open?'open':''}>{NAV.map(n=><a key={n} href={'#'+n.toLowerCase()} className={active===n.toLowerCase()?'on':''} aria-current={active===n.toLowerCase()?'true':undefined} onClick={()=>setOpen(false)}>{n}</a>)}</nav>
    <button className="burger" aria-expanded={open} aria-label="Toggle menu" onClick={()=>setOpen(o=>!o)}><i/><i/></button></header>}

function Hero(){const r=useReducedMotion();const {scrollY}=useScroll();
  const line=(t,i)=><span className="mask"><motion.span initial={r?false:{y:'110%'}} animate={{y:0}} transition={{duration:1.1,ease,delay:1.9+i*.12}}>{t}</motion.span></span>;
  return <section id="home" className="hero"><Monolith/>
    <div className="wrap hero-in"><h1 aria-label="Muhammad Musa Abbasi">{line('MUHAMMAD',0)}{line('MUSA ABBASI',1)}</h1>
      <motion.p className="role" initial={r?false:{opacity:0}} animate={{opacity:1}} transition={{delay:2.4,duration:1}}>Frontend Developer | Software Engineer | Data Analyst</motion.p>
      <motion.p className="lede" initial={r?false:{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:2.55,duration:1,ease}}>I build responsive web applications, create meaningful digital experiences, and transform raw data into actionable insights through modern frontend technologies and data analytics.</motion.p>
      <motion.div className="cta" initial={r?false:{opacity:0}} animate={{opacity:1}} transition={{delay:2.75,duration:1}}>
        <Magnetic href="#projects" className="btn">Explore My Work</Magnetic><Magnetic href={LINKS.cv} download className="btn ghost">Download CV</Magnetic>
        <span className="social"><a className="link" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a><a className="link" href={'mailto:'+LINKS.email}>Email</a></span></motion.div></div></section>}

function Monolith(){return <svg className="mono" viewBox="0 0 600 700" aria-hidden="true" focusable="false">
  <defs><linearGradient id="m1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3a3d42"/><stop offset=".5" stopColor="#292C30"/><stop offset="1" stopColor="#202226"/></linearGradient><linearGradient id="m2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#1d1f23"/><stop offset="1" stopColor="#34373c"/></linearGradient></defs>
  <g className="slabs"><rect x="250" y="70" width="190" height="540" fill="url(#m1)"/><rect x="160" y="150" width="150" height="460" fill="url(#m2)"/><rect x="380" y="210" width="130" height="400" fill="url(#m2)"/>
  <path d="M250 70 L440 70 M160 150 L310 150 M380 210 L510 210" stroke="#C5A46D" strokeWidth="1"/><path d="M250 70V610M310 150V610M440 70V610" stroke="#C5A46D" strokeOpacity=".35"/>
  {Array.from({length:9}).map((_,i)=><line key={i} x1="140" x2="530" y1={170+i*50} y2={170+i*50} stroke="#E8E5DE" strokeOpacity=".05"/>)}
  <text x="268" y="598" fill="#C5A46D" fontFamily="Space Grotesk" fontSize="13" letterSpacing="4">MMA®</text></g></svg>}

const Section=({id,title,children,cls=''})=><section id={id} className={'sec '+cls}><div className="wrap"><Reveal as="h2" className="h2">{title}</Reveal>{children}</div></section>;

function Lightbox({p,i,setI}){const n=p.shots.length;
  useEffect(()=>{const k=e=>{if(e.key==='Escape')setI(null);if(e.key==='ArrowRight')setI((i+1)%n);if(e.key==='ArrowLeft')setI((i-1+n)%n)};window.addEventListener('keydown',k);document.body.style.overflow='hidden';return()=>{window.removeEventListener('keydown',k);document.body.style.overflow=''}},[i,n,setI]);
  return <motion.div className="lb" role="dialog" aria-modal="true" aria-label={p.name+' gallery'} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setI(null)}>
    <motion.img key={i} src={p.shots[i]} alt={p.alt[i]} initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.4,ease}} onClick={e=>e.stopPropagation()}/>
    <p className="lb-cap" onClick={e=>e.stopPropagation()}>{p.alt[i]} ({i+1} of {n})</p>
    <button className="lb-x link" onClick={()=>setI(null)}>Close</button>
    <button className="lb-n lb-p link" aria-label="Previous image" onClick={e=>{e.stopPropagation();setI((i-1+n)%n)}}>Prev</button>
    <button className="lb-n lb-nx link" aria-label="Next image" onClick={e=>{e.stopPropagation();setI((i+1)%n)}}>Next</button></motion.div>}

function Project({p,idx}){const [open,setOpen]=useState(null);const s=p.shots;
  const meta=<Reveal className="pmeta"><p className="kind">{p.kind}</p><h3>{p.name}</h3><p>{p.desc}</p><ul>{p.pts.map(t=><li key={t}>{t}</li>)}</ul>{p.note&&<p className="note">{p.note}</p>}
    <ul className="tags" aria-label="Technologies">{p.tech.map(t=><li key={t}>{t}</li>)}</ul>{p.live&&<a className="link" href={p.live} target="_blank" rel="noopener noreferrer">Visit live site</a>}</Reveal>;
  let art;
  if(p.mobile)art=<div className="phones">{s.slice(0,6).map((x,i)=><ClipImg key={x} src={x} alt={p.alt[i]} className={'ph ph'+i} onClick={()=>setOpen(i)}/>)}</div>;
  else if(p.id==='wirefizz')art=<div className="stack"><ClipImg src={s[0]} alt={p.alt[0]} className="big" onClick={()=>setOpen(0)}/><ClipImg src={s[1]} alt={p.alt[1]} className="over o1" onClick={()=>setOpen(1)}/><ClipImg src={s[2]} alt={p.alt[2]} className="over o2" onClick={()=>setOpen(2)}/></div>;
  else if(p.id==='estavora')art=<div className="film"><ClipImg src={s[0]} alt={p.alt[0]} className="big" onClick={()=>setOpen(0)}/><div className="strip">{s.slice(1).map((x,i)=><ClipImg key={x} src={x} alt={p.alt[i+1]} onClick={()=>setOpen(i+1)}/>)}</div></div>;
  else art=<Reveal className="typo-panel"><span>Framer Motion</span><span>React 18</span><span>Vite</span><span>Tailwind</span></Reveal>;
  return <article className={'proj p'+(idx%2)} aria-labelledby={p.id}>{meta}<div className="part">{art}</div>
    {s.length>0&&<div className="thumbs">{s.map((x,i)=><button key={x} onClick={()=>setOpen(i)} aria-label={'View '+p.alt[i]}><img src={x} alt="" loading="lazy"/></button>)}</div>}
    <AnimatePresence>{open!==null&&<Lightbox p={p} i={open} setI={setOpen}/>}</AnimatePresence></article>}

export default function App(){
  const [ready,setReady]=useState(false),[active,setActive]=useState('home'),[copied,setCopied]=useState(false);
  useEffect(()=>{const ids=NAV.map(n=>n.toLowerCase());const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&setActive(e.target.id)),{rootMargin:'-45% 0px -50% 0px'});ids.forEach(i=>{const el=document.getElementById(i);el&&io.observe(el)});return()=>io.disconnect()},[]);
  const copy=async()=>{try{await navigator.clipboard.writeText(LINKS.email);setCopied(true);setTimeout(()=>setCopied(false),2000)}catch{window.location.href='mailto:'+LINKS.email}};
  return <>{!ready&&<Loader done={()=>setReady(true)}/>}<a className="skip" href="#about">Skip to content</a><Nav active={active}/>
  <main><Hero/>
  <section className="stats" aria-label="Highlights"><div className="wrap">{STATS.map(s=><Reveal key={s.l} className="stat"><b><Count {...s}/></b><span>{s.l}</span></Reveal>)}</div></section>
  <Section id="about" title="A LITTLE ABOUT ME" cls="about"><div className="about-g"><Reveal><p className="big-p">I am a Frontend Developer and Software Engineer focused on building responsive React.js and JavaScript web applications using modern frontend technologies.</p></Reveal>
    <Reveal delay={.1}><p>I work with reusable components, REST API integration, responsive layouts, and authentication workflows. Alongside development, I have experience in data analytics, including ETL processes, exploratory data analysis, data cleaning, and visualization using Python, SQL, and PostgreSQL.</p><p className="serif">I enjoy solving practical problems through clean interfaces, structured code, and thoughtful digital experiences.</p></Reveal></div></Section>
  <Section id="expertise" title="Expertise and skills"><div className="skills">{SKILLS.map(([g,l],i)=><Reveal key={g} delay={i*.05} className="sk"><h3>{g}</h3><ul>{l.map(x=><li key={x}>{x}</li>)}</ul></Reveal>)}</div></Section>
  <Section id="experience" title="Professional experience"><ol className="tl">{JOBS.map(j=><Reveal as="li" key={j.role} className="job"><p className="when">{j.when} | {j.mode}</p><h3>{j.role}</h3><p className="org">{j.org}</p><ul>{j.pts.map(t=><li key={t}>{t}</li>)}</ul></Reveal>)}</ol></Section>
  <section id="projects" className="sec projects"><div className="wrap"><Reveal as="h2" className="h2">Featured projects</Reveal>{PROJECTS.map((p,i)=><Project key={p.id} p={p} idx={i}/>)}</div></section>
  <Section id="education" title="Education and certifications" cls="edu"><div className="edu-g"><Reveal><h3>HND Computing – Level 4 & 5</h3><p>Pearson UK / NICON Group of Colleges, Rawalpindi</p><p className="muted">2023 – 2025</p></Reveal>
    <Reveal delay={.1}><ul className="certs">{CERTS.map(([n,o,y])=><li key={n}><span>{n}</span><em>{o}, {y}</em></li>)}</ul></Reveal></div></Section>
  <section className="sec game-sec" aria-labelledby="gh"><div className="wrap"><Reveal><h2 id="gh" className="h2 sm">ONE LAST CHALLENGE?</h2><p className="muted">Take a short break and test your reflexes.</p></Reveal><Game/></div></section>
  <Section id="contact" title="LET'S BUILD SOMETHING MEANINGFUL." cls="contact"><Reveal><p className="big-p">Have a project, an idea, or an opportunity? I'd love to hear about it.</p>
    <div className="cta"><Magnetic className="btn" href={'mailto:'+LINKS.email}>{LINKS.email}</Magnetic><button className="btn ghost" onClick={copy} aria-live="polite">{copied?'Email copied':'Copy email'}</button></div>
    <p className="clinks"><a className="link" href={'tel:'+LINKS.phone.replace(/\s/g,'')}>{LINKS.phone}</a><a className="link" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></p></Reveal></Section></main>
  <footer className="foot wrap"><span>MMA® Muhammad Musa Abbasi</span><span className="muted">Rawalpindi, Pakistan</span></footer></>}
