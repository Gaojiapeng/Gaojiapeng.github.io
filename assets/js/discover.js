(() => {
  const sheet = document.querySelector('.homepage-sheet');
  const reveal = document.querySelector('.gallery-discover');
  const cue = document.querySelector('.gallery-pull');
  if (!sheet || !reveal || !cue) return;

  const root = document.documentElement;
  const link = cue.querySelector('.gallery-pull-link');
  const instruction = cue.querySelector('.gallery-pull-instruction');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const IDLE_GAP = 420;
  const MIN_DURATION = 1100;
  const REQUIRED_EFFORT = 2160;
  const MAX_SAMPLE = 90;
  const idleText = 'Keep scrolling to unlock the gallery';
  let effort = 0;
  let startedAt = null;
  let lastInput = 0;
  let idleTimer;
  let hideTimer;
  let navigationTimer;
  let touchPoint = null;
  let unlocked = false;
  let readyAfter = performance.now() + 400;

  root.classList.add('gallery-pull-enabled');
  instruction.textContent = idleText;

  const atBottom = () => window.scrollY >= root.scrollHeight - window.innerHeight - 3;
  const blocked = () => document.hidden || !!document.querySelector('dialog[open]');

  const setProgress = (progress) => {
    // Travel becomes harder as pressure increases; even full effort only peeks.
    const resistance = (1 - Math.exp(-2.2 * progress)) / (1 - Math.exp(-2.2));
    const maxPull = Math.min(220, window.innerHeight * .27);
    root.style.setProperty('--gallery-pull-offset', `${resistance * maxPull}px`);
    root.style.setProperty('--gallery-pull-progress', (progress * 100).toFixed(1));
  };

  const reset = (immediate = false) => {
    window.clearTimeout(idleTimer);
    window.clearTimeout(hideTimer);
    window.clearTimeout(navigationTimer);
    effort = 0;
    startedAt = null;
    lastInput = 0;
    unlocked = false;
    root.classList.remove('gallery-pull-active', 'gallery-pull-unlocked');
    instruction.textContent = idleText;
    setProgress(0);
    if (immediate || reducedMotion.matches) {
      root.classList.remove('gallery-pull-visible');
    } else {
      hideTimer = window.setTimeout(() => root.classList.remove('gallery-pull-visible'), 420);
    }
  };

  const openGallery = () => {
    unlocked = true;
    window.clearTimeout(idleTimer);
    root.classList.add('gallery-pull-unlocked');
    instruction.textContent = 'Gallery unlocked — opening…';
    navigationTimer = window.setTimeout(() => {
      if (!blocked()) window.location.assign(link.href);
      else reset(true);
    }, reducedMotion.matches ? 0 : 420);
  };

  const pull = (distance) => {
    const now = performance.now();
    if (unlocked || distance <= 0 || now < readyAfter || !atBottom() || blocked()) return;
    if (now - lastInput > IDLE_GAP) {
      effort = 0;
      startedAt = now;
    }
    if (startedAt === null) startedAt = now;
    lastInput = now;
    effort = Math.min(REQUIRED_EFFORT, effort + Math.min(distance, MAX_SAMPLE));
    const duration = now - startedAt;
    const progress = Math.min(effort / REQUIRED_EFFORT, .12 + .88 * duration / MIN_DURATION, 1);
    window.clearTimeout(idleTimer);
    window.clearTimeout(hideTimer);
    root.classList.add('gallery-pull-visible', 'gallery-pull-active');
    setProgress(progress);
    if (duration >= MIN_DURATION && effort >= REQUIRED_EFFORT) openGallery();
    else idleTimer = window.setTimeout(() => reset(), IDLE_GAP);
  };

  // Let nested scroll areas and editing controls keep their usual interactions.
  const consumesScroll = (target, direction) => {
    if (!(target instanceof Element)) return false;
    if (target.closest('input, textarea, select, video, [contenteditable]')) return true;
    for (let element = target; element && element !== document.body; element = element.parentElement) {
      if (/(auto|scroll)/.test(getComputedStyle(element).overflowY) && element.scrollHeight > element.clientHeight + 1) {
        if (direction > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 1) return true;
        if (direction < 0 && element.scrollTop > 0) return true;
      }
    }
    return false;
  };

  const handleDirection = (event, distance) => {
    if (distance < 0) { reset(); return; }
    if (!distance || blocked() || consumesScroll(event.target, distance)) return;
    if (!atBottom()) return;
    if (event.cancelable) event.preventDefault();
    pull(distance);
  };

  window.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    handleDirection(event, event.deltaY * scale);
  }, { passive: false });

  window.addEventListener('touchstart', (event) => {
    // Brief gaps between swipes preserve pressure; a real pause lets it spring back.
    touchPoint = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    if (!touchPoint) reset();
  }, { passive: true });
  window.addEventListener('touchmove', (event) => {
    if (!touchPoint || event.touches.length !== 1) { touchPoint = null; reset(); return; }
    const point = event.touches[0];
    const dx = touchPoint.x - point.clientX;
    const dy = touchPoint.y - point.clientY;
    touchPoint = { x: point.clientX, y: point.clientY };
    if (Math.abs(dy) >= Math.abs(dx)) handleDirection(event, dy * 1.7);
  }, { passive: false });
  window.addEventListener('touchend', () => { touchPoint = null; }, { passive: true });
  window.addEventListener('touchcancel', () => { touchPoint = null; reset(); }, { passive: true });

  window.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select, button, a, video, [contenteditable]')) return;
    if (['ArrowUp', 'PageUp', 'Home', 'End', 'Escape'].includes(event.key) || (event.key === ' ' && event.shiftKey)) {
      reset();
    } else if (!event.shiftKey && ['ArrowDown', 'PageDown', ' '].includes(event.key)) {
      handleDirection(event, event.key === 'ArrowDown' ? 40 : 90);
    }
  });

  window.addEventListener('scroll', () => { if ((effort || unlocked) && !atBottom()) reset(); }, { passive: true });
  window.addEventListener('resize', () => reset(true));
  window.addEventListener('pagehide', () => reset(true));
  window.addEventListener('pageshow', () => { readyAfter = performance.now() + 400; touchPoint = null; reset(true); });
  document.addEventListener('visibilitychange', () => reset(true));
  link.addEventListener('focus', () => reset(true));
})();
