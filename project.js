(() => {
  const links = [...document.querySelectorAll('.project-image')];
  if (!links.length || !window.HTMLDialogElement) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-label', 'Project image preview');
  const close = document.createElement('button');
  close.textContent = 'Close ×';
  const image = document.createElement('img');
  dialog.append(close, image);
  document.body.append(dialog);
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  links.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    dialog.showModal();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.animate([{opacity:0,filter:'blur(7px)'},{opacity:1,filter:'blur(0)'}], {duration:300,easing:'ease-out'});
    }
  }));
})();
