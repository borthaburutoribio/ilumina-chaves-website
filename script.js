// Ilumina — escenario que cambia de colgante, calculadora de luz por ambiente, colgantes del salón y movimiento.
document.documentElement.classList.add('js');
const WA = '5492983400634';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

/* Entradas escalonadas por sección */
const rise = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); rise.unobserve(e.target); } });
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('section, header, footer').forEach((sec) => {
  sec.querySelectorAll('[data-rise]').forEach((el, i) => { el.style.setProperty('--d', `${Math.min(i, 6) * 80}ms`); rise.observe(el); });
});

/* Escenario fijo: cada sección prende su colgante */
const stageImgs = [...document.querySelectorAll('.stage__frame img')];
const setStage = (key) => stageImgs.forEach((img) => img.classList.toggle('is-on', img.dataset.key === key));
const stageObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) setStage(e.target.dataset.stage); });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('[data-stage]').forEach((s) => stageObs.observe(s));

/* Menú móvil */
const menuBtn = document.querySelector('.nav__menu');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => { const open = menu.classList.toggle('is-open'); menuBtn.setAttribute('aria-expanded', String(open)); });
menu.addEventListener('click', (e) => { if (e.target.closest('a')) { menu.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); } });

/* Calculadora de luz por ambiente.
   Nivel de luz general orientativo (lux) × m² × 1,25 por pérdidas de pantalla y techo.
   LED 9 W ≈ 806 lm (reemplaza a la de 60 W); LED 12 W ≈ 1100 lm. */
const ROOMS = {
  living:     { n: 'el living',     lux: 150, tono: 'cálida', img: 'globos-vidrio-rojo-naranja',          sug: 'los globos de vidrio de color', alt: 'Colgantes de vidrio rojo y naranja', uso: 'luz general' },
  comedor:    { n: 'el comedor',    lux: 200, tono: 'cálida', img: 'colgante-vitreaux-tiffany',           sug: 'el vitreaux de flores sobre la mesa', alt: 'Colgante vitreaux estilo Tiffany', uso: 'luz sobre la mesa' },
  cocina:     { n: 'la cocina',     lux: 300, tono: 'neutra', img: 'colgante-jaula-negra-globo-amarillo', sug: 'las jaulas negras sobre la barra', alt: 'Colgantes de jaula negra y globo amarillo', uso: 'buena luz en la mesada' },
  dormitorio: { n: 'el dormitorio', lux: 120, tono: 'cálida', img: 'colgante-mimbre-gota-salon-ilumina',  sug: 'la gota de mimbre claro', alt: 'Colgante de mimbre en forma de gota', uso: 'luz suave' },
  bano:       { n: 'el baño',       lux: 250, tono: 'neutra', img: 'colgante-esfera-alambre',             sug: 'un plafón o aplique LED (en el salón hay varios)', alt: 'Colgante esfera de alambre', uso: 'luz pareja frente al espejo' },
  escritorio: { n: 'el escritorio', lux: 400, tono: 'neutra', img: 'campana-negra-y-bronce',              sug: 'una campana negra o de bronce sobre la mesa', alt: 'Colgantes campana negra y bronce', uso: 'luz para leer y trabajar' },
  galeria:    { n: 'la galería',    lux: 100, tono: 'cálida', img: 'colgantes-mimbre-campana',            sug: 'las campanas de mimbre', alt: 'Colgantes de mimbre en forma de campana', uso: 'luz de estar afuera' },
  taller:     { n: 'el taller',     lux: 500, tono: 'fría',   img: 'barral-negro-rectangular',            sug: 'tubos LED o un barral de varias luces', alt: 'Barral rectangular de metal negro', uso: 'mucha luz para trabajar' },
};
const form = document.getElementById('calc-form');
const tabs = [...document.querySelectorAll('[data-room]')];
const m2 = document.getElementById('m2');
const plateImg = document.getElementById('plate-img');
const tint = document.getElementById('tint');
const lmEl = document.getElementById('lm');
let room = 'living';
const fmt = (n) => n.toLocaleString('es-AR');

const paint = (swap) => {
  const r = ROOMS[room];
  const sup = Number(m2.value);
  const tono = form.querySelector('input[name="tono"]:checked').value;
  const lm = Math.round((r.lux * sup * 1.25) / 50) * 50;
  const n9 = Math.max(1, Math.ceil(lm / 806));
  const n12 = Math.max(1, Math.ceil(lm / 1100));
  document.getElementById('m2-out').textContent = sup;
  lmEl.textContent = fmt(lm);
  if (!reduce) { lmEl.classList.remove('is-bump'); void lmEl.offsetWidth; lmEl.classList.add('is-bump'); setTimeout(() => lmEl.classList.remove('is-bump'), 300); }
  document.getElementById('res-text').textContent =
    `Para ${r.n} de ${sup} m² (${r.uso}): unas ${n9} lámparas LED de 9 W, las que reemplazan a la de 60 W, o ${n12} de 12 W. Luz ${tono}.`;
  document.getElementById('pick').textContent = `Sugerencia del salón: ${r.sug}`;
  tint.dataset.t = tono;
  document.getElementById('calc-wa').href = wa(
    `Hola Ilumina! Estoy armando la luz de ${r.n} (${sup} m²). La calculadora de la web me dio unos ${fmt(lm)} lúmenes: ${n9} lámparas LED de 9 W o ${n12} de 12 W, luz ${tono}. Me interesa ${r.sug}. ¿Qué me recomiendan?`);
  if (swap) {
    plateImg.classList.add('is-swapping');
    setTimeout(() => { plateImg.src = `assets/img/${r.img}.webp`; plateImg.alt = r.alt; plateImg.classList.remove('is-swapping'); }, reduce ? 0 : 240);
  }
};
const pickRoom = (key) => {
  room = key;
  tabs.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.room === key)));
  const t = form.querySelector(`input[name="tono"][value="${ROOMS[key].tono}"]`);
  if (t) t.checked = true;
  paint(true);
};
tabs.forEach((b, i) => {
  b.addEventListener('click', () => pickRoom(b.dataset.room));
  b.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    n.focus(); pickRoom(n.dataset.room);
  });
});
form.addEventListener('input', () => paint(false));
form.addEventListener('submit', (e) => e.preventDefault());
Object.values(ROOMS).forEach((r) => { const i = new Image(); i.src = `assets/img/${r.img}.webp`; });
paint(false);

/* Colgantes: la fila activa cambia la foto fija */
const items = [...document.querySelectorAll('.item')];
const hangImg = document.getElementById('hang-img');
const hangWa = document.getElementById('hang-wa');
const activate = (li) => {
  if (li.classList.contains('is-on')) return;
  items.forEach((x) => { x.classList.toggle('is-on', x === li); x.querySelector('button').setAttribute('aria-expanded', String(x === li)); });
  const name = li.querySelector('span').textContent;
  hangWa.href = wa(`Hola Ilumina! Vi en la web el colgante "${name}". ¿Lo tienen? ¿En qué colores y a qué precio?`);
  hangImg.classList.add('is-swapping');
  setTimeout(() => { hangImg.src = `assets/img/${li.dataset.img}.webp`; hangImg.alt = li.dataset.alt; hangImg.classList.remove('is-swapping'); }, reduce ? 0 : 200);
};
items.forEach((li) => {
  li.querySelector('button').addEventListener('click', () => activate(li));
  li.addEventListener('mouseenter', () => { if (window.matchMedia('(hover: hover)').matches) activate(li); });
});
items.forEach((li) => { const i = new Image(); i.src = `assets/img/${li.dataset.img}.webp`; });

/* Botón fijo de WhatsApp en celular + logo del pie que crece */
const fab = document.querySelector('.wa-fab');
const hideIn = new Set();
new IntersectionObserver((entries) => {
  entries.forEach((e) => (e.isIntersecting ? hideIn.add(e.target) : hideIn.delete(e.target)));
  fab.classList.toggle('is-hidden', hideIn.size > 0);
}).observe(document.querySelector('.cells'));
const grow = document.querySelector('[data-scale-in]');
const onScroll = () => {
  const vh = window.innerHeight;
  fab.classList.toggle('is-shown', window.scrollY > vh * 0.6);
  if (!reduce && grow) {
    const p = Math.min(Math.max((vh - grow.getBoundingClientRect().top) / vh, 0), 1);
    grow.style.transform = `scale(${0.92 + p * 0.08})`;
  }
};
window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
onScroll();

/* Compartir */
document.querySelector('[data-share]').addEventListener('click', async (e) => {
  const data = { title: 'Ilumina · Gonzales Chaves', text: 'Iluminación y materiales eléctricos en Av. Dori 28', url: location.href };
  if (navigator.share) { try { await navigator.share(data); } catch (_) { /* cancelado */ } return; }
  try { await navigator.clipboard.writeText(location.href); e.target.textContent = 'Link copiado'; } catch (_) { /* sin portapapeles */ }
});
