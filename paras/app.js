(function () {
  const tabPanels = Array.from(document.querySelectorAll('[data-tab-panel]'));
  const tabLinks = Array.from(document.querySelectorAll('.tab-link'));
  const panelIds = new Set(tabPanels.map((panel) => panel.id));
  const tabsSection = document.querySelector('.tabs-section');
  const backToTop = document.querySelector('.back-to-top');

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function setActiveLinks(activeId) {
    const allInternalLinks = Array.from(document.querySelectorAll('a[href^="#"]'));

    allInternalLinks.forEach((link) => {
      const id = link.getAttribute('href').slice(1);
      const isActive = id === activeId;

      if (link.classList.contains('tab-link')) {
        link.classList.toggle('active', isActive);
      }

      if (link.classList.contains('tab-link')) {
        link.setAttribute('aria-selected', String(isActive));
      }
    });
  }

  function activatePanel(activeId, options = {}) {
    const { scroll = true, updateHash = true } = options;

    if (!panelIds.has(activeId)) {
      setActiveLinks(activeId);
      return false;
    }

    tabPanels.forEach((panel) => {
      const isActive = panel.id === activeId;
      panel.hidden = !isActive;
      panel.classList.toggle('is-active', isActive);
    });

    setActiveLinks(activeId);

    if (updateHash) {
      history.pushState(null, '', `#${activeId}`);
    }

    if (scroll && tabsSection) {
      tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return true;
  }

  function sortPublicationsByYear() {
    const list = document.querySelector('.publication-list');
    if (!list) return;

    const items = Array.from(list.querySelectorAll('.publication-item'));
    items
      .sort((a, b) => {
        const yearA = Number(a.querySelector('.year')?.textContent.trim()) || 0;
        const yearB = Number(b.querySelector('.year')?.textContent.trim()) || 0;
        return yearB - yearA;
      })
      .forEach((item) => list.appendChild(item));
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);

    if (activatePanel(targetId)) {
      event.preventDefault();
    }
  });

  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }

  window.addEventListener('hashchange', () => {
    const targetId = window.location.hash.slice(1);
    activatePanel(targetId || 'program', { scroll: false, updateHash: false });
  });

  window.addEventListener('popstate', () => {
    const targetId = window.location.hash.slice(1);
    activatePanel(targetId || 'program', { scroll: false, updateHash: false });
  });

  window.addEventListener('scroll', updateBackToTop, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  sortPublicationsByYear();

  const initialId = window.location.hash.slice(1);
  activatePanel(panelIds.has(initialId) ? initialId : 'program', {
    scroll: false,
    updateHash: false
  });

  if (panelIds.has(initialId)) {
    window.scrollTo(0, 0);
    window.requestAnimationFrame(() => window.scrollTo(0, 0));
    window.setTimeout(() => window.scrollTo(0, 0), 80);
  }

  updateBackToTop();
})();
