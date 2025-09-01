(() => {
  const state = { category: 'all', availableOnly: false };

  const grid = document.querySelector('[data-grid]');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('[data-item]'));
  const btns  = Array.from(document.querySelectorAll('[data-filter]'));
  const onlyAvail = document.getElementById('onlyAvailable');

  function setActive(btn) {
    btns.forEach((b) => b.classList.remove('bg-white', 'text-black'));
    btn.classList.add('bg-white', 'text-black');
  }

  function apply() {
    cards.forEach((card) => {
      const cat = card.dataset.category || '';
      const sold = card.dataset.status === 'sold';
      const okCat = state.category === 'all' || cat === state.category;
      const okAvail = !state.availableOnly || !sold;
      card.classList.toggle('hidden', !(okCat && okAvail));
    });
  }

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      state.category = filter || 'all';
      setActive(btn);
      apply();
    });
  });

  if (onlyAvail) {
    onlyAvail.addEventListener('change', () => {
      state.availableOnly = !!onlyAvail.checked;
      apply();
    });
  }

  const defaultBtn = document.querySelector('[data-filter="all"]');
  if (defaultBtn) setActive(defaultBtn);
  apply();
})();
