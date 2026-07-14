(function () {
  const root = document.querySelector('[data-hero-slider]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
  const prev = root.querySelector('[data-hero-prev]');
  const next = root.querySelector('[data-hero-next]');
  const progress = root.querySelector('[data-hero-progress]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduceMotion ? 0 : 7200;
  const outDelay = reduceMotion ? 0 : 220;
  const inDelay = reduceMotion ? 0 : 360;
  let active = 0;
  let startedAt = Date.now();
  let timer = null;
  let raf = null;
  let phaseTimer = null;
  let paused = false;
  let locked = false;

  function setTheme(index) {
    const style = getComputedStyle(slides[index]);
    root.style.setProperty('--hero-accent', style.getPropertyValue('--hero-accent').trim());
    root.style.setProperty('--hero-accent-2', style.getPropertyValue('--hero-accent-2').trim());
    root.style.setProperty('--hero-glow', style.getPropertyValue('--hero-glow').trim());
  }

  function setActive(index) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const current = slideIndex === active;
      slide.classList.toggle('is-active', current);
      slide.setAttribute('aria-hidden', current ? 'false' : 'true');
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === active);
    });
    setTheme(active);
  }

  function clearPhase() {
    if (phaseTimer) window.clearTimeout(phaseTimer);
    phaseTimer = null;
    locked = false;
    root.classList.remove('is-exiting', 'is-entering', 'is-forward', 'is-back');
  }

  function show(index, direction = 'forward') {
    const nextIndex = (index + slides.length) % slides.length;
    if (nextIndex === active || locked) {
      restart();
      return;
    }

    restart(false);

    if (reduceMotion || !root.classList.contains('is-ready')) {
      setActive(nextIndex);
      restart();
      return;
    }

    locked = true;
    root.classList.remove('is-entering', 'is-forward', 'is-back');
    root.classList.add(direction === 'back' ? 'is-back' : 'is-forward', 'is-exiting');

    phaseTimer = window.setTimeout(() => {
      root.classList.remove('is-exiting');
      setActive(nextIndex);
      void root.offsetWidth;
      root.classList.add('is-entering');

      phaseTimer = window.setTimeout(() => {
        clearPhase();
        restart();
      }, inDelay);
    }, outDelay);
  }

  function tick() {
    if (!progress || paused || !duration || locked) return;
    const elapsed = Date.now() - startedAt;
    const value = Math.min(elapsed / duration, 1);
    progress.style.transform = `scaleX(${value})`;
    raf = window.requestAnimationFrame(tick);
  }

  function restart(schedule = true) {
    if (timer) window.clearTimeout(timer);
    if (raf) window.cancelAnimationFrame(raf);
    timer = null;
    raf = null;
    startedAt = Date.now();
    if (progress) progress.style.transform = 'scaleX(0)';
    if (!schedule || !duration || paused || locked) return;
    raf = window.requestAnimationFrame(tick);
    timer = window.setTimeout(() => show(active + 1, 'forward'), duration);
  }

  function setPaused(value) {
    paused = value;
    if (!locked) restart();
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => show(index, index < active ? 'back' : 'forward'));
  });
  prev?.addEventListener('click', () => show(active - 1, 'back'));
  next?.addEventListener('click', () => show(active + 1, 'forward'));
  root.addEventListener('mouseenter', () => setPaused(true));
  root.addEventListener('mouseleave', () => setPaused(false));
  root.addEventListener('focusin', () => setPaused(true));
  root.addEventListener('focusout', () => setPaused(false));

  setActive(0);
  restart();
  window.requestAnimationFrame(() => root.classList.add('is-ready'));
}());
