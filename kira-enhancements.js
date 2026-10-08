/* Small integration layer: accessible overlays and a searchable reference archive. */
(() => {
  'use strict';
  // A failed dependency must never strand visitors behind a loading screen.
  setTimeout(() => { const loader = document.getElementById('loader'); if (loader) loader.remove(); }, 5000);
  const grid = document.getElementById('projectsGrid');
  if (grid) {
    const label = document.createElement('label');
    label.className = 'kira-search-label'; label.htmlFor = 'kira-search'; label.textContent = 'SEARCH THE CASE FILES /   ';
    const search = document.createElement('input'); search.type = 'search'; search.id = 'kira-search'; search.className = 'kira-search'; search.placeholder = 'Project name or sector';
    const empty = document.createElement('p'); empty.className = 'kira-no-results'; empty.textContent = 'No matching case files. Try another search.'; empty.hidden = true; empty.setAttribute('role','status');
    grid.before(label,search); grid.after(empty);
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase(); let visible = 0;
      grid.querySelectorAll('.proj-card').forEach(card => { const match = card.textContent.toLowerCase().includes(q); card.hidden = !match; if (match) visible++; });
      empty.hidden = visible > 0; const count=document.getElementById('projectsCount'); if(count) count.textContent=String(visible);
    });
    document.getElementById('projectsFilter')?.addEventListener('click', () => { search.value = ''; empty.hidden = true; });
    const archive = document.createElement('a'); archive.href = 'work.html'; archive.className = 'kira-archive-link'; archive.textContent = 'OPEN THE COMPLETE KIRA ARCHIVE / 48 PROJECTS ↗'; grid.after(archive);
  }
  // Keep keyboard focus within visible overlays and return it to the opener.
  const observer = new MutationObserver(records => {
    for (const {target} of records) {
      if (!(target instanceof HTMLElement) || !target.matches('.case,.rwall')) continue;
      if (target.dataset.open === 'true') {
        target._kiraOpener = document.activeElement;
        target.setAttribute('aria-label',target.classList.contains('case')?'Project case file':'Campaign results');
        target.querySelector('button')?.focus();
      } else if (target._kiraOpener?.isConnected) target._kiraOpener.focus();
    }
  });
  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['data-open']});
  document.addEventListener('keydown',e => {
    if (e.key !== 'Tab') return;
    const modal = document.querySelector('.case[data-open="true"],.rwall[data-open="true"],.mobile-menu[data-open="true"]');
    if (!modal) return;
    const controls = [...modal.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
    if (!controls.length) return;
    const first=controls[0],last=controls[controls.length-1];
    if (e.shiftKey&&(document.activeElement===first||!modal.contains(document.activeElement))) {e.preventDefault();last.focus();}
    else if (!e.shiftKey&&(document.activeElement===last||!modal.contains(document.activeElement))) {e.preventDefault();first.focus();}
  });
})();

document.addEventListener('kira:pagechange', e => {
 const titles={home:'The Mind Behind the Impact',about:'The Mind',services:'Instruments',work:'Case Files',kirastudio:'Evidence Room',contact:'Open a Briefing'};
 document.title='KIRA — '+(titles[e.detail.page]||'Studio');
 document.querySelectorAll('.nav__menu [data-route]').forEach(a=>{if(a.dataset.route===e.detail.page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
});
