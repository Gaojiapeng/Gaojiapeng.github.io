/* No requests or dependencies: the links and captions remain useful offline
   and without JavaScript. */
(() => {
  'use strict';
  const gallery = document.querySelector('.apple-gallery');
  if (!gallery) return;

  const cards = Array.from(gallery.querySelectorAll('.ag-card'));
  const collectionLinks = cards.map(card => card.querySelector('.ag-photo-link'));
  const filters = gallery.querySelector('.ag-filters');
  const filterButtons = Array.from(gallery.querySelectorAll('[data-gallery-filter]'));
  const count = gallery.querySelector('.ag-count');
  if (filters) filters.hidden = false;
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const location = button.dataset.galleryFilter;
      let visible = 0;
      cards.forEach(card => {
        card.hidden = location !== 'all' && card.dataset.location !== location;
        if (!card.hidden) visible += 1;
      });
      filterButtons.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      count.textContent = `${visible} photograph${visible === 1 ? '' : 's'}`;
    });
  });

  const strip = gallery.querySelector('.ag-feature-strip');
  const previousFeature = gallery.querySelector('[data-feature-previous]');
  const nextFeature = gallery.querySelector('[data-feature-next]');
  if (strip && previousFeature && nextFeature) {
    gallery.querySelector('.ag-strip-controls').hidden = false;
    const updateStrip = () => {
      previousFeature.disabled = strip.scrollLeft < 4;
      nextFeature.disabled = strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 4;
    };
    const moveStrip = direction => {
      const first = strip.querySelector('.ag-feature');
      const gap = parseFloat(getComputedStyle(strip).columnGap) || 0;
      const step = first.getBoundingClientRect().width + gap;
      strip.scrollBy({
        left: direction * step,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    };
    previousFeature.addEventListener('click', () => moveStrip(-1));
    nextFeature.addEventListener('click', () => moveStrip(1));
    strip.addEventListener('scroll', updateStrip, { passive: true });
    window.addEventListener('resize', updateStrip, { passive: true });
    updateStrip();
  }

  const viewer = document.querySelector('.ag-viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  const viewerImage = viewer.querySelector('.ag-viewer-image');
  const viewerTitle = viewer.querySelector('#ag-viewer-title');
  const viewerLocation = viewer.querySelector('.ag-viewer-location');
  const viewerDate = viewer.querySelector('.ag-viewer-date');
  const viewerPosition = viewer.querySelector('.ag-viewer-position');
  const viewerOriginal = viewer.querySelector('.ag-viewer-original');
  let activeLinks = collectionLinks;
  let activeIndex = 0;
  let returnFocus = null;
  let previousOverflow = '';

  const renderPhoto = () => {
    const link = activeLinks[activeIndex];
    viewerImage.src = link.href;
    viewerImage.alt = link.querySelector('img').alt;
    viewerTitle.textContent = link.dataset.photoTitle;
    viewerLocation.textContent = link.dataset.photoLocation;
    viewerDate.textContent = link.dataset.photoDate;
    viewerDate.dateTime = link.dataset.photoDatetime;
    viewerPosition.textContent = `${activeIndex + 1} of ${activeLinks.length}`;
    viewerOriginal.href = link.href;
  };
  const movePhoto = direction => {
    activeIndex = (activeIndex + direction + activeLinks.length) % activeLinks.length;
    renderPhoto();
  };
  gallery.querySelectorAll('.ag-photo-link').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const fromCollection = Boolean(link.closest('.ag-card'));
      activeLinks = fromCollection
        ? collectionLinks.filter(item => !item.closest('.ag-card').hidden)
        : collectionLinks;
      activeIndex = activeLinks.findIndex(item => item.dataset.photoId === link.dataset.photoId);
      if (activeIndex < 0) activeIndex = 0;
      returnFocus = link;
      renderPhoto();
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      viewer.showModal();
    });
  });
  viewer.querySelector('.ag-viewer-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('[data-viewer-previous]').addEventListener('click', () => movePhoto(-1));
  viewer.querySelector('[data-viewer-next]').addEventListener('click', () => movePhoto(1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      movePhoto(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  viewer.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    if (returnFocus) returnFocus.focus({ preventScroll: true });
    viewerImage.removeAttribute('src');
  });
})();
