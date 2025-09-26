(() => {
  const state = { category: 'all', subcategory: 'all', brand: 'all', sizes: [], availableOnly: false };

  const grid = document.querySelector('[data-grid]');
  if (!grid) return;

  const cards     = Array.from(grid.querySelectorAll('[data-item]'));
  const btns      = Array.from(document.querySelectorAll('[data-filter]'));
  const dropdown  = document.getElementById('filterDropdown');
  const brandSelect = document.getElementById('brandFilter');
  const onlyAvail = document.getElementById('onlyAvailable');
  const resetBtn  = document.getElementById('resetFilters');

  function setActiveBtn(btn) {
    btns.forEach((b) => b.classList.remove('is-active'));
    if (btn) btn.classList.add('is-active');
  }

  function apply() {
    cards.forEach((card) => {
      const cat    = card.dataset.category || '';
      const subcat = card.dataset.subcategory || '';
      const brand  = (card.dataset.brand || '').toLowerCase();
      const sold   = card.dataset.status === 'sold';

      const sizesAttr = card.dataset.sizes || '';
      const sizesArr  = sizesAttr.split(',').map(s => s.trim()).filter(Boolean);

      const okCat   = state.category === 'all' || cat === state.category;
      const okSub   = state.subcategory === 'all' || subcat === state.subcategory;
      const okBrand = state.brand === 'all' || brand === state.brand;
      const okSize  = state.sizes.length === 0 || state.sizes.some(sel => sizesArr.includes(sel));
      const okAvail = !state.availableOnly || !sold;

      card.classList.toggle('hidden', !(okCat && okSub && okBrand && okSize && okAvail));
    });

    // zobrazit/skrýt tlačítko reset podle toho, zda je něco vybráno
    if (resetBtn) {
      const anyFilter =
        state.category !== 'all' ||
        state.subcategory !== 'all' ||
        state.brand !== 'all' ||
        state.sizes.length > 0 ||
        state.availableOnly;
      resetBtn.classList.toggle('hidden', !anyFilter);
    }
  }

  // Kategorie – desktop tlačítka (TOGGLE)
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      const alreadyActive = btn.classList.contains('is-active');

      if (alreadyActive) {
        state.category = 'all';
        state.subcategory = 'all';
        setActiveBtn(null);
        if (dropdown) dropdown.value = 'all';
      } else {
        state.category = filter;
        state.subcategory = 'all';
        setActiveBtn(btn);
        if (dropdown) dropdown.value = filter;
      }
      apply();
    });
  });

  // Kategorie – mobilní select
  if (dropdown) {
    dropdown.addEventListener('change', () => {
      state.category = dropdown.value || 'all';
      state.subcategory = 'all';
      setActiveBtn(null);
      apply();
    });
  }

  // Značky – nativní select
  if (brandSelect) {
    brandSelect.addEventListener('change', () => {
      state.brand = (brandSelect.value || 'all').toLowerCase();
      apply();
    });
  }

  // Značky – vlastní dropdown
  const brandBtn   = document.getElementById('brandDropdownBtn');
  const brandLabel = document.getElementById('brandDropdownLabel');
  const brandMenu  = document.getElementById('brandDropdownMenu');

  if (brandBtn && brandMenu) {
    brandBtn.addEventListener('click', () => {
      brandMenu.classList.toggle('hidden');
    });

    brandMenu.querySelectorAll('[data-brand-value]').forEach((item) => {
      item.addEventListener('click', () => {
        const val = (item.getAttribute('data-brand-value') || 'all').toLowerCase();
        state.brand = val;
        if (brandLabel) brandLabel.textContent = item.textContent || 'Všechny značky';
        brandMenu.classList.add('hidden');
        apply();
      });
    });

    document.addEventListener('click', (e) => {
      if (!brandBtn.contains(e.target) && !brandMenu.contains(e.target)) {
        brandMenu.classList.add('hidden');
      }
    });
  }

  // Velikosti – vlastní dropdown (multi select)
  const sizeBtn   = document.getElementById('sizeDropdownBtn');
  const sizeLabel = document.getElementById('sizeDropdownLabel');
  const sizeMenu  = document.getElementById('sizeDropdownMenu');

  if (sizeBtn && sizeMenu) {
    sizeBtn.addEventListener('click', () => {
      sizeMenu.classList.toggle('hidden');
    });

    sizeMenu.querySelectorAll('[data-size-value]').forEach((item) => {
      item.addEventListener('click', () => {
        const val = item.getAttribute('data-size-value');
        if (val === 'all') {
          state.sizes = [];
          if (sizeLabel) sizeLabel.textContent = 'Vybrat velikosti';
        } else {
          if (state.sizes.includes(val)) {
            state.sizes = state.sizes.filter(v => v !== val);
          } else {
            state.sizes.push(val);
          }
          if (sizeLabel) {
            sizeLabel.textContent =
              state.sizes.length > 0 ? state.sizes.join(', ') : 'Vybrat velikosti';
          }
        }
        apply();
      });
    });

    document.addEventListener('click', (e) => {
      if (!sizeBtn.contains(e.target) && !sizeMenu.contains(e.target)) {
        sizeMenu.classList.add('hidden');
      }
    });
  }

  // Oblečení dropdown (subkategorie)
  const obleceniBtn   = document.getElementById('obleceniDropdownBtn');
  const obleceniMenu  = document.getElementById('obleceniDropdownMenu');
  const obleceniLabel = document.getElementById('obleceniDropdownLabel');

  if (obleceniBtn && obleceniMenu) {
    obleceniBtn.addEventListener('click', () => {
      obleceniMenu.classList.toggle('hidden');
    });

    obleceniMenu.querySelectorAll('[data-subcategory-value]').forEach((item) => {
      item.addEventListener('click', () => {
        const val = item.getAttribute('data-subcategory-value') || 'all';
        state.category = 'obleceni';
        state.subcategory = val;

        setActiveBtn(null);
        if (dropdown) dropdown.value = 'obleceni';

        if (obleceniLabel) {
          obleceniLabel.textContent = val === 'all' ? 'Oblečení' : item.textContent || 'Oblečení';
        }

        obleceniMenu.classList.add('hidden');
        apply();
      });
    });

    document.addEventListener('click', (e) => {
      if (!obleceniBtn.contains(e.target) && !obleceniMenu.contains(e.target)) {
        obleceniMenu.classList.add('hidden');
      }
    });
  }

  // Reset filtry
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.category = 'all';
      state.subcategory = 'all';
      state.brand = 'all';
      state.sizes = [];
      state.availableOnly = false;

      btns.forEach((b) => b.classList.remove('is-active'));
      if (dropdown) dropdown.value = 'all';
      if (brandSelect) brandSelect.value = 'all';

      const obleceniLabel = document.getElementById('obleceniDropdownLabel');
      if (obleceniLabel) obleceniLabel.textContent = 'Oblečení';
      const sizeLabel = document.getElementById('sizeDropdownLabel');
      if (sizeLabel) sizeLabel.textContent = 'Vybrat velikosti';
      const brandLabel = document.getElementById('brandDropdownLabel');
      if (brandLabel) brandLabel.textContent = 'Všechny značky';

      if (onlyAvail) onlyAvail.checked = false;

      apply();
    });
  }

  // Pouze skladem
  if (onlyAvail) {
    onlyAvail.addEventListener('change', () => {
      state.availableOnly = !!onlyAvail.checked;
      apply();
    });
  }

  // Mobilní glass dropdown kategorií
  const mobileBtn   = document.getElementById('mobileDropdownBtn');
  const mobileLabel = document.getElementById('mobileDropdownLabel');
  const mobileMenu  = document.getElementById('mobileDropdownMenu');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const open = mobileMenu.getAttribute('data-open') === 'true';
      mobileMenu.setAttribute('data-open', (!open).toString());
    });

    mobileMenu.querySelectorAll('[data-mobile-option]').forEach((item) => {
      item.addEventListener('click', () => {
        const val = item.getAttribute('data-mobile-option') || 'all';
        state.category = val;
        state.subcategory = 'all';
        if (mobileLabel) mobileLabel.textContent = item.textContent || 'Vše';
        setActiveBtn(null);
        apply();
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.setAttribute('data-open', 'false');
      }
    });
  }

  apply();
})();
