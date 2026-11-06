(function () {
  document.documentElement?.classList.add('enhanced');
  function track(name, parameters) {
    if (window.portfolioAnalyticsStarted && typeof window.gtag === 'function') window.gtag('event', name, parameters);
  }
  document.addEventListener('click', function (event) {
    const contact = event.target.closest('[data-contact]');
    if (contact) track('contact_click', { method: 'email', placement: contact.dataset.contact });
    const cv = event.target.closest('[data-cv]');
    if (cv) track('cv_download', { placement: document.body.className });
    const copy = event.target.closest('[data-copy-email]');
    if (copy) {
      const status = copy.parentElement.querySelector('.copy-status');
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        if (status) status.textContent = 'Please select and copy the email address above.';
        return;
      }
      navigator.clipboard.writeText(copy.dataset.copyEmail).then(function () {
        if (status) status.textContent = 'Email address copied.';
        track('email_copy', { placement: 'footer' });
      }).catch(function () { if (status) status.textContent = 'Please select and copy the email address above.'; });
    }
  });
  document.querySelectorAll('.abstract').forEach(function (details) {
    details.addEventListener('toggle', function () {
      if (details.open) track('abstract_open', { year: details.closest('.publication-item').querySelector('.year').textContent });
    });
  });
  // Section links follow the part of the CV/research account currently being read.
  document.querySelectorAll('[data-scroll-nav]').forEach(function (nav) {
    const entries = Array.from(nav.querySelectorAll('a[href^="#"]')).map(function (link) {
      return { link: link, section: document.getElementById(link.hash.slice(1)) };
    }).filter(function (entry) { return entry.section; });
    if (!entries.length) return;
    let queued = false;
    function update() {
      queued = false;
      const readingLine = Math.max(135, window.innerHeight * 0.22);
      let selected = entries[0];
      entries.forEach(function (entry) { if (entry.section.getBoundingClientRect().top <= readingLine) selected = entry; });
      entries.forEach(function (entry) {
        if (entry === selected) entry.link.setAttribute('aria-current', 'location');
        else entry.link.removeAttribute('aria-current');
      });
    }
    function schedule() { if (!queued) { queued = true; window.requestAnimationFrame(update); } }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        nav.classList.remove('is-open');
        const toggle = document.querySelector('[aria-controls="' + nav.id + '"]');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
    update();
  });
  document.querySelectorAll('.nav-toggle').forEach(function (button) {
    button.addEventListener('click', function () {
      const nav = document.getElementById(button.getAttribute('aria-controls'));
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
  });
  document.querySelectorAll('[data-abstract-toggle]').forEach(function (button) {
    const detail = document.getElementById(button.dataset.abstractToggle);
    if (!detail) return;
    button.hidden = false; detail.dataset.toggleEnhanced = 'true';
    function syncAbstract() { button.setAttribute('aria-expanded', String(detail.open)); button.querySelector('span').textContent = detail.open ? '−' : '+'; }
    button.addEventListener('click', function () { detail.open = !detail.open; syncAbstract(); });
    detail.addEventListener('toggle', syncAbstract); syncAbstract();
  });
  // Pause scientific figures and molecular rotation videos while offscreen.
  const motionPreference = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: true };
  document.querySelectorAll('[data-visual]').forEach(function (figure) {
    const motionButton = figure.querySelector('[data-motion]');
    const videos = Array.from(figure.querySelectorAll('video'));
    const stepButtons = Array.from(figure.querySelectorAll('[data-visual-step]'));
    const fallbackDescriptions = ['Exons 1 and 2 occur in both transcripts.', 'The same exons are CDS in ISF-1 and UTR in ISF-2: ENACT assigns dual scope.', 'Alternative initiation and exon-5 skipping accompany loss of the intact kinase domain; OSR1_C is retained.'];
    const descriptions = stepButtons.map(function (button, index) { return button.dataset.caption || fallbackDescriptions[index] || ''; });
    let visible = false, pausedByUser = motionPreference.matches, interval = null, mediaSyncTimer = null;
    function selectStep(step) {
      figure.dataset.step = String(step);
      stepButtons.forEach(function (button) { button.setAttribute('aria-pressed', String(Number(button.dataset.visualStep) === step)); });
      const text = figure.querySelector('[data-state-text]');
      if (text) text.textContent = descriptions[step];
    }
    function syncMotion() {
      const playing = visible && !document.hidden && !pausedByUser && (!motionPreference.matches || figure.dataset.motionOverride === 'true');
      figure.dataset.playing = String(playing);
      if (motionButton) { motionButton.textContent = playing ? 'Pause' : 'Play'; motionButton.setAttribute('aria-pressed', String(playing)); }
      videos.forEach(function (video) {
        if (playing) { if (video.paused) { video.muted = true; const started = video.play(); if (started && started.catch) started.catch(function (error) { if (error.name !== 'AbortError' && figure.dataset.playing === 'true') { pausedByUser = true; syncMotion(); } }); } }
        else video.pause();
      });
      if (interval) { window.clearInterval(interval); interval = null; }
      if (mediaSyncTimer) { window.clearInterval(mediaSyncTimer); mediaSyncTimer = null; }
      if (playing && figure.hasAttribute('data-sync-movies')) mediaSyncTimer = window.setInterval(function () { const master = videos[0]; if (!master || master.readyState < 2) return; videos.slice(1).forEach(function (video) { if (video.readyState >= 2 && Math.abs(video.currentTime - master.currentTime) > 0.12) video.currentTime = master.currentTime; }); }, 300);
      if (playing && stepButtons.length) interval = window.setInterval(function () { selectStep((Number(figure.dataset.step) + 1) % stepButtons.length); }, 3200);
    }
    if (motionButton) motionButton.addEventListener('click', function () { pausedByUser = figure.dataset.playing === 'true'; if (motionPreference.matches && !pausedByUser) figure.dataset.motionOverride = 'true'; syncMotion(); });
    stepButtons.forEach(function (button) { button.addEventListener('click', function () { pausedByUser = true; selectStep(Number(button.dataset.visualStep)); syncMotion(); }); });
    if (typeof window.IntersectionObserver === 'function') {
      const observer = new window.IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; syncMotion(); }, { threshold: 0.2 });
      observer.observe(figure);
    } else { visible = true; syncMotion(); }
    if (typeof motionPreference.addEventListener === 'function') motionPreference.addEventListener('change', function () { if (motionPreference.matches) { pausedByUser = true; delete figure.dataset.motionOverride; } syncMotion(); });
    document.addEventListener('visibilitychange', syncMotion);
  });
  // Preserve older external links to the former tabbed profile.
  const legacy = { publications: 'publications', projects: 'projects', methods: 'methods', training: 'education', life: 'mentoring' };
  const hash = location.hash.slice(1);
  if (document.body.classList.contains('home-page') && legacy[hash]) location.replace('cv.html#' + legacy[hash]);
})();
