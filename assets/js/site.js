const researchDialog = document.querySelector('.research-dialog');
let researchTrigger;
if (researchDialog && typeof researchDialog.showModal === 'function') {
  document.querySelectorAll('[data-research-figure]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      researchTrigger = link;
      researchDialog.showModal();
      document.body.classList.add('modal-open');
    });
  });
  researchDialog.querySelector('[data-close-research]').addEventListener('click', () => researchDialog.close());
  researchDialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    researchTrigger?.focus({ preventScroll: true });
  });
  researchDialog.addEventListener('click', (event) => {
    const box = researchDialog.getBoundingClientRect();
    if (event.target === researchDialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) researchDialog.close();
  });
}
