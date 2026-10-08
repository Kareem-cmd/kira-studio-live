/* Content is visible by default. Motion only runs when supported and requested. */
(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const seen=new WeakSet();
 document.querySelector('a[href="#client-section"]')?.addEventListener('click',e=>{e.preventDefault();document.getElementById('client-section')?.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});});
 function dissolve(el,delay=0){
  if(reduced.matches||!el.animate)return;
  el.animate([{opacity:0,filter:'blur(7px)',transform:'translateY(10px)'},{opacity:1,filter:'blur(0px)',transform:'translateY(0)'}],{duration:650,delay,easing:'cubic-bezier(.2,.65,.3,1)',fill:'none'});
 }
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting&&!seen.has(target)){seen.add(target);dissolve(target);observer.unobserve(target);}}),{threshold:.12});
  document.querySelectorAll('[data-soft-reveal]').forEach(el=>observer.observe(el));
 }
 document.addEventListener('kira:pagechange',e=>{
  const page=document.getElementById(e.detail.page);if(!page)return;
  dissolve(page);
  const title=page.querySelector('h1');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
 });
 // Preserve the mobile menu's keyboard boundary and restore its opener.
 const menu=document.getElementById('mobileMenu'),burger=document.getElementById('burger');
 if(menu&&burger){new MutationObserver(()=>{if(menu.dataset.open==='true'){menu.inert=false;menu.querySelector('a')?.focus();}else{menu.inert=true;if(menu.contains(document.activeElement))burger.focus();}}).observe(menu,{attributes:true,attributeFilter:['data-open']});menu.inert=menu.dataset.open!=='true';}
})();
