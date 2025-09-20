(() => {
  const state = { category: 'all', availableOnly: false };

  const grid = document.querySelector('[data-grid]');
  if (!grid) return;

  // karty
  const cards = Array.from(grid.querySelectorAll('[data-item]'));
  // desktop tlačítka
  const btns  = Array.from(document.querySelectorAll('[data-filter]'));
  // mobilní custom dropdown
  const mobBtn   = /** @type {HTMLButtonElement|null} */ (document.getElementById('mobileDropdownBtn'));
  const mobMenu  = /** @type {HTMLUListElement|null} */ (document.getElementById('mobileDropdownMenu'));
  const mobLabel = /** @type {HTMLSpanElement|null} */ (document.getElementById('mobileDropdownLabel'));
  const mobOpts  = Array.from(document.querySelectorAll('[data-mobile-option]'));
  // checkbox „pouze skladem“
  const onlyAvail = /** @type {HTMLInputElement|null} */ (document.getElementById('onlyAvailable'));

  function setActiveBtn(btn) {
    btns.forEach((b) => b.classList.remove('is-active'));
    if (btn) btn.classList.add('is-active');
  }

  function syncDesktopButtons(filter) {
    const match = document.querySelector(`[data-filter="${filter}"]`);
    setActiveBtn(match || null);
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

  // Desktop: klik na tlačítko
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      state.category = filter;
      setActiveBtn(btn);
      if (mobLabel) mobLabel.textContent = btn.textContent?.trim() || 'Vše';
      apply();
    });
  });

  // Mobile: toggle dropdown
  function setMenuOpen(open) {
    if (!mobMenu || !mobBtn) return;
    mobMenu.dataset.open = String(open);
    mobBtn.setAttribute('aria-expanded', String(open));
  }

  mobBtn?.addEventListener('click', () => {
    if (!mobMenu) return;
    const isOpen = mobMenu.dataset.open === 'true';
    setMenuOpen(!isOpen);
  });

  // Mobile: výběr položky
  mobOpts.forEach((opt) => {
    opt.addEventListener('click', () => {
      const filter = opt.getAttribute('data-mobile-option') || 'all';
      const label  = opt.textContent?.trim() || 'Vše';
      state.category = filter;
      if (mobLabel) mobLabel.textContent = label;
      setMenuOpen(false);
      // synchronizace desktop tlačítek
      syncDesktopButtons(filter);
      apply();
    });
  });

  // Klik mimo menu → zavřít
  document.addEventListener('click', (e) => {
    if (!mobMenu || !mobBtn) return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    const clickInside = mobMenu.contains(target) || mobBtn.contains(target);
    if (!clickInside) setMenuOpen(false);
  });

  // Pouze skladem
  if (onlyAvail) {
    onlyAvail.addEventListener('change', () => {
      state.availableOnly = !!onlyAvail.checked;
      apply();
    });
  }

  // Start: aktivní „Vše“
  const defaultBtn = document.querySelector('[data-filter="all"]');
  if (defaultBtn) setActiveBtn(defaultBtn);
  if (mobLabel) mobLabel.textContent = 'Vše';
  setMenuOpen(false);
  apply();
})();
