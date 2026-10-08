(() => {
  const input = document.querySelector('#collection-search');
  if (!input) return;
  const cards = [...document.querySelectorAll('.collection-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  let category = 'all';
  function update() {
    const query = input.value.trim().toLowerCase();
    let count = 0;
    cards.forEach(card => {
      card.hidden = !((category === 'all' || card.dataset.category === category) && card.dataset.search.includes(query));
      if (!card.hidden) count++;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    document.querySelector('#collection-count').textContent = `Showing ${count} of ${cards.length} projects`;
    document.querySelector('#collection-empty').hidden = count !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; update(); }));
  input.addEventListener('input', update);
  document.querySelector('[data-reset]').addEventListener('click', () => { category = 'all'; input.value = ''; update(); input.focus(); });
})();
