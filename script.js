const body=document.body;
const starCanvas=document.getElementById("stars");
const ctx=starCanvas.getContext("2d");
let stars=[], w=0,h=0,dpr=Math.min(devicePixelRatio||1,2);

function resizeStars(){
  w=innerWidth; h=innerHeight;
  starCanvas.width=w*dpr; starCanvas.height=h*dpr;
  starCanvas.style.width=w+"px"; starCanvas.style.height=h+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars=Array.from({length:Math.min(260,Math.floor(w*h/6500))},()=>({
    x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.15+.15,a:Math.random()*.55+.1,
    tw:Math.random()*Math.PI*2,s:Math.random()*.006+.001
  }));
}
resizeStars(); addEventListener("resize",resizeStars);

let mouse={x:innerWidth/2,y:innerHeight/2}, smooth={x:mouse.x,y:mouse.y};
addEventListener("mousemove",e=>{mouse.x=e.clientX;mouse.y=e.clientY});

function drawStars(t){
  ctx.clearRect(0,0,w,h);
  for(const s of stars){
    s.tw+=s.s;
    const alpha=s.a*(.72+.28*Math.sin(s.tw));
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(190,198,214,${alpha})`;ctx.fill();
  }
  requestAnimationFrame(drawStars);
}
requestAnimationFrame(drawStars);

const orbits=[...document.querySelectorAll(".orbit")];
const nebA=document.querySelector(".nebula-a"),nebB=document.querySelector(".nebula-b");
let scrollY=0;
addEventListener("scroll",()=>{
  scrollY=scrollY||window.scrollY;
  const y=window.scrollY;
  orbits.forEach((o,i)=>o.style.transform=`translate(-50%,-50%) rotate(-11deg) translateY(${y*(.012+i*.006)}px)`);
  nebA.style.transform=`translate(${y*.012}px,${y*.018}px)`;
  nebB.style.transform=`translate(${-y*.009}px,${y*.012}px)`;
});

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach((el,i)=>{
  el.style.transitionDelay=`${Math.min(i%4,3)*70}ms`;
  revealObserver.observe(el);
});

const sections=[...document.querySelectorAll("main section[id]")];
const navs=[...document.querySelectorAll(".nav-link")];
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navs.forEach(n=>n.classList.toggle("active",n.getAttribute("href")==="#"+entry.target.id));
    }
  });
},{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s=>navObserver.observe(s));

const ring=document.querySelector(".cursor-ring"),dot=document.querySelector(".cursor-dot"),trail=document.querySelector(".cursor-trail");
function cursorLoop(){
  smooth.x+=(mouse.x-smooth.x)*.18;smooth.y+=(mouse.y-smooth.y)*.18;
  dot.style.left=mouse.x+"px";dot.style.top=mouse.y+"px";
  ring.style.left=smooth.x+"px";ring.style.top=smooth.y+"px";
  trail.style.left=(smooth.x+(mouse.x-smooth.x)*.35)+"px";trail.style.top=(smooth.y+(mouse.y-smooth.y)*.35)+"px";
  requestAnimationFrame(cursorLoop);
}
cursorLoop();

document.querySelectorAll("a,button,.service,.project-card,.skill-cloud span").forEach(el=>{
  el.addEventListener("mouseenter",()=>body.classList.add("cursor-hover"));
  el.addEventListener("mouseleave",()=>body.classList.remove("cursor-hover"));
});

document.querySelectorAll(".magnetic").forEach(el=>{
  el.addEventListener("mousemove",e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.12,y=(e.clientY-r.top-r.height/2)*.18;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener("mouseleave",()=>el.style.transform="");
});

const art=document.querySelector(".hero-art");
addEventListener("mousemove",e=>{
  if(innerWidth<800)return;
  const dx=(e.clientX-innerWidth/2)/innerWidth,dy=(e.clientY-innerHeight/2)/innerHeight;
  art.style.transform=`translate(${dx*8}px,${dy*5}px)`;
  document.querySelectorAll(".orbit-tag").forEach((tag,i)=>tag.style.transform=`translate(${dx*(i+1)*3}px,${dy*(i+1)*2}px)`);
});

const menu=document.querySelector(".mobile-menu"),menuBtn=document.querySelector(".menu-btn");
menuBtn.addEventListener("click",()=>{menu.classList.toggle("open");body.classList.toggle("menu-open")});
document.querySelectorAll(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");body.classList.remove("menu-open")}));

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const target=document.querySelector(a.getAttribute("href"));
    if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth"})}
  });
});

// Project details modal
const projectData={
  atelier:{
    eyebrow:"FRONTEND / 01 · DIGITAL INTERFACES",
    title:"Atelier — Virtual Fashion Studio",
    image:"assets/projects/atelier.jpg",
    desc:"A SaaS platform for tailors, fashion designers and made-to-measure studios — not a single-store storefront. The designer workspace covers clients, orders & payments, a collection, fit profiles, a Virtual Studio and a calendar; the customer space offers style discovery, a personal fit profile and an AI-powered virtual try-on.",
    tech:["React","Vite","Tailwind CSS","AI Try-On API"],
    url:"https://atelier-react-bs2peacek-osivuetsus-projects.vercel.app"
  },
  biometric:{
    eyebrow:"SYSTEMS / 01 · SYSTEMS & INFRASTRUCTURE",
    title:"Student Biometric Database System",
    image:"assets/projects/biometric.jpg",
    desc:"A face-recognition attendance system (AttendEye) built around a course and session database. Lecturers select a course, choose Single, Confirmed or Multi recognition mode, and the system captures three frames per face before confirming and logging attendance.",
    tech:["Database","Face Recognition","API Integration","Dashboard UI"],
    url:"https://biometrics-frontend.onrender.com/"
  },
  autovybe:{
    eyebrow:"FRONTEND / 02 · DIGITAL INTERFACES",
    title:"AutoVybe Nigeria",
    image:"assets/projects/autovybe.jpg",
    desc:"A modern digital storefront for a car dealership, built from a Google Stitch prototype as both a portfolio piece and social media content. Includes inventory search and filtering, a financing calculator, and WhatsApp / call-now integration, tuned for the Nigerian market.",
    tech:["React","Vite","Tailwind CSS"],
    url:"https://auto-vybe.onrender.com/"
  }
};

const modal=document.getElementById("projectModal");
let openProjectModal=()=>{};
if(modal){
  const pmImage=document.getElementById("pmImage");
  const pmEyebrow=document.getElementById("pmEyebrow");
  const pmTitle=document.getElementById("pmTitle");
  const pmDesc=document.getElementById("pmDesc");
  const pmTech=document.getElementById("pmTech");
  const pmVisit=document.getElementById("pmVisit");
  let lastFocused=null;

  openProjectModal=function(key){
    const data=projectData[key];
    if(!data)return;
    pmImage.src=data.image;pmImage.alt=data.title+" screenshot";
    pmEyebrow.textContent=data.eyebrow;
    pmTitle.textContent=data.title;
    pmDesc.textContent=data.desc;
    pmTech.innerHTML=data.tech.map(t=>`<span>${t}</span>`).join("");
    pmVisit.href=data.url;
    lastFocused=document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    body.classList.add("menu-open");
    modal.querySelector(".project-modal-close").focus();
  }
  function closeProjectModal(){
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    body.classList.remove("menu-open");
    if(lastFocused)lastFocused.focus();
  }
  modal.querySelectorAll("[data-modal-close]").forEach(el=>el.addEventListener("click",closeProjectModal));
  addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeProjectModal()});

  // Keyboard activation (Enter/Space on a focused card) fires a real, correctly-targeted
  // click with detail===0 — handle that case here. Real mouse/touch clicks are handled
  // in the project-rail pointerup logic below, since pointer capture during drag-scroll
  // retargets the resulting click event away from the card.
  document.querySelectorAll(".project-card[data-project]").forEach(card=>{
    card.addEventListener("click",e=>{
      if(e.detail!==0)return;
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      e.preventDefault();
      openProjectModal(card.dataset.project);
    });
  });
}

// Horizontal project collections: wheel, drag, touch and arrow controls.
document.querySelectorAll('.project-rail-wrap').forEach(wrap=>{
  const rail=wrap.querySelector('.project-rail');
  const prev=wrap.parentElement.querySelector('.rail-btn.prev');
  const next=wrap.parentElement.querySelector('.rail-btn.next');
  const counter=wrap.parentElement.querySelector('.rail-count b');
  const progress=wrap.querySelector('.rail-progress i');
  const cards=[...rail.children];
  let dragging=false,startX=0,startScroll=0,pressedCard=null;

  const update=()=>{
    const max=rail.scrollWidth-rail.clientWidth;
    const ratio=max>0?rail.scrollLeft/max:0;
    progress.style.width=(Math.max(.25,ratio)*100)+'%';
    const idx=Math.min(cards.length,Math.max(1,Math.round((rail.scrollLeft/max||0)*(cards.length-1))+1));
    if(counter) counter.textContent=String(idx).padStart(2,'0');
  };
  rail.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);

  const move=(direction)=>{
    const distance=Math.max(rail.clientWidth*.78, 420);
    rail.scrollBy({left:direction*distance,behavior:'smooth'});
  };
  prev?.addEventListener('click',()=>move(-1));
  next?.addEventListener('click',()=>move(1));

  rail.addEventListener('wheel',e=>{
    if(Math.abs(e.deltaY)>Math.abs(e.deltaX) && rail.scrollWidth>rail.clientWidth){
      const rect=rail.getBoundingClientRect();
      if(e.clientX>=rect.left && e.clientX<=rect.right){
        e.preventDefault(); rail.scrollLeft+=e.deltaY;
      }
    }
  },{passive:false});

  rail.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse' && e.button!==0)return;
    dragging=true;startX=e.clientX;startScroll=rail.scrollLeft;rail.dataset.moved='0';
    pressedCard=e.target.closest('.project-card[data-project]');
    rail.classList.add('dragging');rail.setPointerCapture?.(e.pointerId);
  });
  rail.addEventListener('pointermove',e=>{
    if(!dragging)return;
    if(Math.abs(e.clientX-startX)>6)rail.dataset.moved='1';
    rail.scrollLeft=startScroll-(e.clientX-startX)*1.08;
  });
  const stop=(e)=>{
    dragging=false;rail.classList.remove('dragging');
    if(e&&e.pointerId!=null&&rail.hasPointerCapture&&rail.hasPointerCapture(e.pointerId))rail.releasePointerCapture(e.pointerId);
    // Pointer capture during a drag retargets the compatibility click event away from
    // the card, so resolve "was this a tap/click on a card" here instead of via 'click'.
    if(e&&e.type==='pointerup'&&pressedCard&&rail.dataset.moved!=='1'){
      if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){
        e.preventDefault();
        openProjectModal(pressedCard.dataset.project);
      }else{
        window.open(pressedCard.href,'_blank','noopener');
      }
    }
    pressedCard=null;
  };
  rail.addEventListener('pointerup',stop);rail.addEventListener('pointercancel',stop);rail.addEventListener('lostpointercapture',stop);
  update();
});
