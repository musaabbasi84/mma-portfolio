import {useEffect,useRef,useState,useCallback} from 'react';
const C={bg:'#17191C',panel:'#202226',gold:'#C5A46D',white:'#E8E5DE',red:'#B3402F'};
const DUR=30;
export default function Game(){
  const cv=useRef(null),st=useRef(null),raf=useRef(0),audio=useRef(null);
  const [ui,setUi]=useState({phase:'idle',score:0,time:DUR});
  const [best,setBest]=useState(()=>{try{return +localStorage.getItem('mma-best')||0}catch{return 0}});
  const [sound,setSound]=useState(false);const soundRef=useRef(false);soundRef.current=sound;
  const beep=(f)=>{if(!soundRef.current)return;try{audio.current=audio.current||new (window.AudioContext||window.webkitAudioContext)();const a=audio.current,o=a.createOscillator(),g=a.createGain();o.frequency.value=f;g.gain.value=.04;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.08)}catch{}};
  const reset=()=>({x:.5,keys:{},items:[],t:0,score:0,spawn:0,phase:'idle',left:DUR});
  if(!st.current)st.current=reset();
  const sync=()=>setUi({phase:st.current.phase,score:st.current.score,time:Math.ceil(st.current.left)});
  const draw=useCallback(()=>{const c=cv.current;if(!c)return;const g=c.getContext('2d'),w=c.width,h=c.height,s=st.current;
    g.fillStyle=C.bg;g.fillRect(0,0,w,h);g.strokeStyle='rgba(197,164,109,.08)';for(let i=1;i<6;i++){g.beginPath();g.moveTo(w*i/6,0);g.lineTo(w*i/6,h);g.stroke()}
    s.items.forEach(o=>{const x=o.x*w,y=o.y*h,r=w*.025;if(o.bad){g.fillStyle=C.red;g.fillRect(x-r,y-r,r*2,r*2);g.strokeStyle=C.white;g.beginPath();g.moveTo(x-r/2,y-r/2);g.lineTo(x+r/2,y+r/2);g.moveTo(x+r/2,y-r/2);g.lineTo(x-r/2,y+r/2);g.stroke()}else{g.fillStyle=C.gold;g.beginPath();g.moveTo(x,y-r);g.lineTo(x+r,y);g.lineTo(x,y+r);g.lineTo(x-r,y);g.fill()}});
    const pw=w*.12,ph=h*.05,px=s.x*w-pw/2,py=h-ph-12;g.fillStyle=C.panel;g.fillRect(px,py,pw,ph);g.strokeStyle=C.gold;g.lineWidth=1.5;g.strokeRect(px,py,pw,ph);g.lineWidth=1;g.fillStyle=C.gold;g.fillRect(px+pw/2-3,py+ph/2-3,6,6)},[]);
  const loop=useCallback((ts)=>{const s=st.current;if(s.phase!=='play'){draw();return}
    const dt=Math.min(.05,(ts-(s.last||ts))/1000);s.last=ts;
    const dir=(s.keys.l?-1:0)+(s.keys.r?1:0);s.x=Math.max(.06,Math.min(.94,s.x+dir*dt*.9));
    s.left-=dt;s.spawn-=dt;if(s.spawn<=0){s.items.push({x:.05+Math.random()*.9,y:-.05,bad:Math.random()<.38,v:.28+Math.random()*.2+(DUR-s.left)*.006});s.spawn=.45}
    const c=cv.current,w=c.width,h=c.height,pw=.12,pyN=(h-h*.05-12)/h;
    s.items=s.items.filter(o=>{o.y+=o.v*dt;const hit=Math.abs(o.x-s.x)<pw/2+.02&&o.y>pyN&&o.y<pyN+.06;if(hit){if(o.bad){s.score=Math.max(0,s.score-5);beep(140)}else{s.score+=10;beep(660)}return false}return o.y<1.1});
    if(s.left<=0){s.left=0;s.phase='over';try{if(s.score>(+localStorage.getItem('mma-best')||0))localStorage.setItem('mma-best',s.score)}catch{}setBest(b=>Math.max(b,s.score))}
    draw();sync();raf.current=requestAnimationFrame(loop)},[draw]);
  const start=()=>{st.current={...reset(),phase:'play'};sync();cancelAnimationFrame(raf.current);raf.current=requestAnimationFrame(loop)};
  const pause=()=>{const s=st.current;if(s.phase==='play'){s.phase='pause';s.last=0;sync()}else if(s.phase==='pause'){s.phase='play';sync();raf.current=requestAnimationFrame(loop)}};
  useEffect(()=>{const c=cv.current;const fit=()=>{const w=c.parentElement.clientWidth;c.width=w;c.height=Math.round(Math.min(w*.62,440));draw()};fit();window.addEventListener('resize',fit);
    const kd=(e,v)=>{const k=e.key.toLowerCase();if(k==='arrowleft'||k==='a'){st.current.keys.l=v}else if(k==='arrowright'||k==='d'){st.current.keys.r=v}else return;if(st.current.phase==='play')e.preventDefault()};
    const d=e=>kd(e,true),u=e=>kd(e,false);window.addEventListener('keydown',d);window.addEventListener('keyup',u);
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener('resize',fit);window.removeEventListener('keydown',d);window.removeEventListener('keyup',u)}},[draw]);
  const touch=e=>{const r=cv.current.getBoundingClientRect();st.current.x=Math.max(.06,Math.min(.94,(e.touches[0].clientX-r.left)/r.width))};
  const label={idle:'Ready',play:'Playing',pause:'Paused',over:'Game over'}[ui.phase];
  return(<div className="game">
    <div className="game-bar"><span>Score <b>{ui.score}</b></span><span>Time <b>{ui.time}s</b></span><span>Best <b>{best}</b></span></div>
    <div className="game-stage"><canvas ref={cv} onTouchStart={touch} onTouchMove={e=>{e.preventDefault();touch(e)}} aria-label="Golden Code Run game area. Use arrow keys or A and D, or drag on touch screens."/>
      {ui.phase!=='play'&&<div className="game-overlay"><p className="game-state">{label}{ui.phase==='over'&&` — ${ui.score} points`}</p>
        {ui.phase==='pause'?<button className="btn" onClick={pause}>Resume</button>:<button className="btn" onClick={start}>{ui.phase==='over'?'Play again':'Start round'}</button>}</div>}</div>
    <div className="game-ctrl"><button className="link" onClick={pause} disabled={ui.phase!=='play'&&ui.phase!=='pause'}>{ui.phase==='pause'?'Resume':'Pause'}</button><button className="link" onClick={start}>Restart</button><button className="link" aria-pressed={sound} onClick={()=>setSound(v=>!v)}>Sound: {sound?'on':'off'}</button></div>
    <p className="muted small">Arrow keys or A / D to move. On touch screens, drag across the game area. Collect gold, avoid red.</p></div>);
}
