const menu=document.getElementById("menu"),nav=document.getElementById("nav");
const bars=menu.querySelector(".iconBars"),close=menu.querySelector(".iconClose");
menu.onclick=()=>{
  nav.classList.toggle("active");
  const open=nav.classList.contains("active");
  bars.style.display=open?"none":"block";
  close.style.display=open?"block":"none";
};
document.querySelectorAll("#nav a").forEach(a=>a.onclick=()=>{
  nav.classList.remove("active");
  bars.style.display="block";
  close.style.display="none";
});

const floatLayer=document.getElementById("floatLayer");
if(floatLayer && window.matchMedia("(pointer:fine)").matches){
  document.addEventListener("mousemove",e=>{
    const x=(e.clientX/window.innerWidth-.5)*24;
    const y=(e.clientY/window.innerHeight-.5)*24;
    floatLayer.style.transform=`translate(${x}px,${y}px)`;
  });
}

const contactForm=document.getElementById("contactForm");
if(contactForm){
  const sendBtn=document.getElementById("sendBtn");
  const status=document.getElementById("formStatus");
  contactForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    sendBtn.disabled=true;
    sendBtn.innerHTML='Sending...';
    status.textContent='';
    status.className='';
    try{
      const res = await fetch(contactForm.action, {
        method:'POST',
        body:new FormData(contactForm),
        headers:{'Accept':'application/json'}
      });
      if(res.ok){
        status.textContent='✓ Message sent successfully! I\'ll get back to you soon.';
        status.className='formSuccess';
        contactForm.reset();
      } else {
        throw new Error('Failed');
      }
    } catch(err){
      status.textContent='✗ Something went wrong. Please try again or email directly.';
      status.className='formError';
    }
    sendBtn.disabled=false;
    sendBtn.innerHTML='Send Message <i class="fa-solid fa-paper-plane"></i>';
  });
}

/* Preloader */
window.addEventListener("load",()=>{
  const pre=document.getElementById("preloader");
  if(pre){ pre.classList.add("done"); setTimeout(()=>pre.remove(),700); }
});

/* Typing effect on hero tagline */
const typedEl=document.getElementById("typedText");
if(typedEl){
  const words=["IT Student","Web Developer","Creative Developer"];
  let wi=0, ci=0, deleting=false;
  function typeLoop(){
    const word=words[wi];
    if(!deleting){
      ci++;
      typedEl.textContent=word.slice(0,ci);
      if(ci===word.length){ deleting=true; setTimeout(typeLoop,1400); return; }
    } else {
      ci--;
      typedEl.textContent=word.slice(0,ci);
      if(ci===0){ deleting=false; wi=(wi+1)%words.length; }
    }
    setTimeout(typeLoop, deleting?45:90);
  }
  typeLoop();
}

/* Scroll reveal animations */
const revealTargets=document.querySelectorAll("section h2, .card, .project, .certCard, .box, .contactBox, .team .card");
revealTargets.forEach(el=>el.classList.add("reveal"));
const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("inView");
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:0.15});
revealTargets.forEach(el=>revealObserver.observe(el));

/* Skill progress bar fill on scroll */
const skillBars=document.querySelectorAll(".skillBar span");
const barObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.width=getComputedStyle(entry.target).getPropertyValue('--p');
      barObserver.unobserve(entry.target);
    }
  });
},{threshold:0.3});
skillBars.forEach(el=>barObserver.observe(el));

/* Back to top button */
const toTop=document.getElementById("toTop");
if(toTop){
  window.addEventListener("scroll",()=>{
    toTop.classList.toggle("show", window.scrollY>500);
  });
  toTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
}

/* Plexus network background animation */
(function(){
  const canvas = document.getElementById("plexusCanvas");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles, animId;
  const isMobile = window.matchMedia("(max-width:700px)").matches;
  const COUNT = isMobile ? 45 : 90;
  const MAX_DIST = isMobile ? 120 : 150;
  const colors = [
    {r:0,g:245,b:255},   // cyan
    {r:124,g:60,b:255},  // purple
    {r:255,g:20,b:147}   // pink
  ];

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticles(){
    particles = [];
    for(let i=0;i<COUNT;i++){
      const c = colors[Math.floor(Math.random()*colors.length)];
      particles.push({
        x: Math.random()*W,
        y: Math.random()*H,
        vx: (Math.random()-0.5)*0.35,
        vy: (Math.random()-0.5)*0.35,
        r: Math.random()*1.6+1,
        color: c
      });
    }
  }

  function step(){
    ctx.clearRect(0,0,W,H);
    for(const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
    }
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a=particles[i], b=particles[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<MAX_DIST){
          const alpha=(1-dist/MAX_DIST)*0.5;
          const cr=Math.round((a.color.r+b.color.r)/2);
          const cg=Math.round((a.color.g+b.color.g)/2);
          const cb=Math.round((a.color.b+b.color.b)/2);
          ctx.strokeStyle=`rgba(${cr},${cg},${cb},${alpha})`;
          ctx.lineWidth=0.7;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    for(const p of particles){
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.color.r},${p.color.g},${p.color.b},0.85)`;
      ctx.shadowColor=`rgba(${p.color.r},${p.color.g},${p.color.b},0.8)`;
      ctx.shadowBlur=6;
      ctx.fill();
      ctx.shadowBlur=0;
    }
    animId = requestAnimationFrame(step);
  }

  function init(){
    resize();
    makeParticles();
    cancelAnimationFrame(animId);
    step();
  }

  let resizeTimer;
  window.addEventListener("resize", ()=>{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 300);
  });

  init();
})();


// Certificate lightbox: tap thumbnail to view full certificate
(function(){
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certModalImg");
  const closeBtn = document.getElementById("certModalClose");
  if(!modal) return;
  document.querySelectorAll(".certImgWrap").forEach(wrap=>{
    wrap.addEventListener("click", ()=>{
      const img = wrap.querySelector("img");
      modalImg.src = img.getAttribute("src");
      modalImg.alt = img.getAttribute("alt") || "Certificate";
      modal.classList.add("open");
    });
  });
  function closeModal(){ modal.classList.remove("open"); modalImg.src=""; }
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e)=>{ if(e.target===modal) closeModal(); });
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeModal(); });
})();
