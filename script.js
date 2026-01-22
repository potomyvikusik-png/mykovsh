// год в футере
document.getElementById('year').textContent = new Date().getFullYear();

// reveal при скролле
const items = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
items.forEach(el => io.observe(el));

// печатающийся текст (креативно, но аккуратно)
const typeEl = document.getElementById('typeTarget');
if (typeEl) {
  const text = typeEl.dataset.text || "";
  let i = 0;
  typeEl.textContent = "";
  const timer = setInterval(() => {
    typeEl.textContent += text[i] ?? "";
    i++;
    if (i >= text.length) clearInterval(timer);
  }, 18);
}

// lightbox для фото
// ===== Carousel =====
document.querySelectorAll('[data-carousel]').forEach((root) => {
  const track = root.querySelector('.car__track');
  const slides = Array.from(root.querySelectorAll('.car__slide'));
  const prev = root.querySelector('.car__btn--prev');
  const next = root.querySelector('.car__btn--next');
  const dotsWrap = root.querySelector('.car__dots');
  const viewport = root.querySelector('.car__viewport');

  let index = 0;

  // dots
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.className = 'car__dot';
    b.type = 'button';
    b.ariaLabel = `Фото ${i + 1}`;
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function update(){
    track.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    update();
  }

  prev?.addEventListener('click', () => goTo(index - 1));
  next?.addEventListener('click', () => goTo(index + 1));

  // swipe
  let startX = 0;
  let dx = 0;
  let dragging = false;

  viewport.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    dx = 0;
    viewport.setPointerCapture(e.pointerId);
    track.style.transition = 'none';
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
    const percent = (dx / viewport.clientWidth) * 100;
    track.style.transform = `translateX(${-(index * 100) + percent}%)`;
  });

  function endDrag(){
    if (!dragging) return;
    dragging = false;
    track.style.transition = 'transform .35s ease';

    const threshold = viewport.clientWidth * 0.18; // насколько надо протянуть
    if (dx > threshold) goTo(index - 1);
    else if (dx < -threshold) goTo(index + 1);
    else update();
  }

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('pointerleave', endDrag);

  // init
  update();
});