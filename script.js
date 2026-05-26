const modeButtons=[...document.querySelectorAll('.mode-btn')];
const panels=[...document.querySelectorAll('[data-mode-panel]')];
const toc=document.getElementById('toc');
const searchInput=document.getElementById('searchInput');
const topBtn=document.getElementById('topBtn');
function activePanel(){return document.querySelector('.doc-panel.active')}
function buildToc(){
  toc.innerHTML='';
  activePanel().querySelectorAll('.doc-section').forEach(sec=>{
    const a=document.createElement('a');
    a.href='#'+sec.id;
    a.textContent=sec.dataset.title || sec.querySelector('h2')?.textContent || sec.id;
    a.addEventListener('click',()=>setTimeout(updateActiveToc,50));
    toc.appendChild(a);
  });
  updateActiveToc();
}
function setMode(mode){
  modeButtons.forEach(btn=>{const on=btn.dataset.mode===mode;btn.classList.toggle('active',on);btn.setAttribute('aria-selected',on?'true':'false')});
  panels.forEach(p=>p.classList.toggle('active',p.dataset.modePanel===mode));
  searchInput.value='';
  document.querySelectorAll('.doc-section').forEach(s=>s.classList.remove('hidden-by-search'));
  buildToc();
  window.scrollTo({top:0,behavior:'smooth'});
}
modeButtons.forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.mode)));
function updateActiveToc(){
  const sections=[...activePanel().querySelectorAll('.doc-section:not(.hidden-by-search)')];
  let current=sections[0]?.id;
  for(const sec of sections){if(sec.getBoundingClientRect().top<160) current=sec.id;}
  toc.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));
}
window.addEventListener('scroll',()=>{updateActiveToc();topBtn.classList.toggle('show',window.scrollY>500)});
topBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
searchInput.addEventListener('input',()=>{
  const q=searchInput.value.trim().toLowerCase();
  activePanel().querySelectorAll('.doc-section').forEach(sec=>{
    const text=sec.innerText.toLowerCase();
    sec.classList.toggle('hidden-by-search', q && !text.includes(q));
  });
  buildToc();
});
document.querySelectorAll('.copy-btn').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    const target=document.getElementById(btn.dataset.copy);
    if(!target) return;
    await navigator.clipboard.writeText(target.innerText);
    const old=btn.textContent; btn.textContent='복사됨';
    setTimeout(()=>btn.textContent=old,1200);
  });
});
buildToc();
