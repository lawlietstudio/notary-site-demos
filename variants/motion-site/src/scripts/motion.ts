// Option F: the animation layer on top of option E.
// Everything here is progressive enhancement: with JavaScript off, or when the visitor prefers
// reduced motion, the page is simply option E.

const root = document.documentElement;
const calm = root.classList.contains('calm');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Seconds the opening curtain takes (0 when it is skipped), read from the CSS custom property.
 *  The production CSS minifier rewrites `0.05s` as `50ms`, so both units must be understood
 *  (reading "50ms" as 50 seconds once made the count-up wait 50 seconds on every page after the first). */
const introDelay = (): number => {
  const v = getComputedStyle(root).getPropertyValue('--d0').trim();
  const n = parseFloat(v);
  if (Number.isNaN(n)) return 0;
  return v.endsWith('ms') ? n / 1000 : v.endsWith('s') ? n : 0;
};

// ---------- reduced-motion switch (this is a demo of the animations, so the visitor can opt in) ----------
if (root.classList.contains('os-calm')) {
  const on = root.classList.contains('motion-on');
  document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach((toggle) => {
    toggle.hidden = false;
    toggle.textContent = on ? toggle.dataset.off! : toggle.dataset.on!;
    toggle.addEventListener('click', () => {
      try { localStorage.setItem('motion', on ? 'off' : 'on'); sessionStorage.removeItem('intro-seen'); } catch { /* ignore */ }
      location.reload();
    });
  });
}

// ---------- opening curtain ----------
const intro = document.querySelector<HTMLElement>('.intro');
const finishIntro = () => {
  root.classList.add('intro-done');
  try { sessionStorage.setItem('intro-seen', '1'); } catch { /* private mode */ }
};
if (intro && !calm && !root.classList.contains('no-intro')) {
  intro.addEventListener('animationend', (e) => { if (e.animationName === 'curtain') finishIntro(); });
  setTimeout(finishIntro, 4500); // failsafe if animations are throttled
} else {
  finishIntro();
}

// ---------- split headings into words that rise out of a mask ----------
const segmenter = 'Segmenter' in Intl ? new Intl.Segmenter(root.lang || 'en', { granularity: 'word' }) : null;
function splitWords(el: HTMLElement) {
  const text = (el.textContent ?? '').trim();
  if (!text) return;
  const parts = segmenter ? Array.from(segmenter.segment(text), (s) => s.segment) : text.split(/(\s+)/);
  el.setAttribute('aria-label', text);
  el.textContent = '';
  let i = 0;
  for (const part of parts) {
    if (/^\s+$/.test(part)) { el.append(' '); continue; }
    const mask = document.createElement('span');
    mask.className = 'w';
    mask.setAttribute('aria-hidden', 'true');
    const word = document.createElement('span');
    word.textContent = part;
    word.style.setProperty('--i', String(i++));
    mask.append(word);
    el.append(mask);
  }
  el.classList.add('is-split');
}

// ---------- count-up numbers ----------
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
function countUp(el: HTMLElement, delay = 0) {
  const raw = el.dataset.count ?? '';
  const target = parseFloat(raw);
  if (Number.isNaN(target)) return;
  const prefix = el.dataset.prefix ?? '';
  const suffix = el.dataset.suffix ?? '';
  const decimals = (raw.split('.')[1] ?? '').length;
  const duration = 1700;
  const start = performance.now() + delay * 1000;
  let done = false;
  const step = () => {
    if (done) return;
    const p = Math.min(1, Math.max(0, (performance.now() - start) / duration));
    el.textContent = prefix + (target * easeOut(p)).toFixed(decimals) + suffix;
    if (p >= 1) { done = true; clearInterval(timer); }
  };
  // Animation frames give the smooth count; the timer is a safety net, because frames are held back in
  // unfocused, embedded or background views and the number would otherwise stay at 0.
  const timer = window.setInterval(step, 100);
  const frame = () => { step(); if (!done) requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
}

if (!calm) {
  const splits = Array.from(document.querySelectorAll<HTMLElement>('[data-split]'));
  splits.forEach(splitWords);
  const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  counters.forEach((el) => {
    el.textContent = (el.dataset.prefix ?? '') + (0).toFixed((el.dataset.count!.split('.')[1] ?? '').length) + (el.dataset.suffix ?? '');
  });

  const targets = [...splits, ...counters];
  const started = new WeakSet<HTMLElement>();
  const begin = (el: HTMLElement) => {
    if (started.has(el)) return;
    started.add(el);
    if (el.hasAttribute('data-split')) el.classList.add('is-in');
    if (el.hasAttribute('data-count')) countUp(el, el.closest('.hero') ? introDelay() + 0.6 : 0);
    io.unobserve(el);
  };
  const io = new IntersectionObserver(
    (entries) => { for (const entry of entries) if (entry.isIntersecting) begin(entry.target as HTMLElement); },
    { threshold: 0.25 },
  );
  targets.forEach((el) => io.observe(el));

  // Safety net: observer callbacks are also held back in unfocused, embedded or background views (the numbers then
  // stayed at 0 until the page got focus), so check the geometry as well: on a timer, on scroll, and when the page
  // gets focus or becomes visible again. The same applies to the scroll-reveal items.
  const inView = (el: Element, share: number) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.bottom <= 0 || r.top >= vh || (!r.width && !r.height)) return false;
    return Math.min(r.bottom, vh) - Math.max(r.top, 0) >= Math.min(r.height, vh) * share;
  };
  const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
  const sweep = () => {
    for (const el of targets) if (!started.has(el) && inView(el, 0.25)) begin(el);
    for (const el of reveals) if (!el.classList.contains('is-in') && inView(el, 0.1)) el.classList.add('is-in');
  };
  (['scroll', 'resize', 'focus', 'pageshow'] as const).forEach((ev) => window.addEventListener(ev, sweep, { passive: true }));
  document.addEventListener('visibilitychange', sweep);
  let sweeps = 0;
  const sweeper = window.setInterval(() => { sweep(); if (++sweeps > 40) clearInterval(sweeper); }, 500);
}

// ---------- header: hides while scrolling down, returns on the way up ----------
const header = document.querySelector<HTMLElement>('[data-header]');
if (header && !calm) {
  let last = window.scrollY;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    const dy = y - last;
    const busy = document.querySelector('details[data-lang-switch][open]') || (document.getElementById('menu-toggle') as HTMLInputElement | null)?.checked;
    if (busy || y < 240 || dy < -6) header.classList.remove('is-hidden');
    else if (dy > 6) header.classList.add('is-hidden');
    if (Math.abs(dy) > 6) last = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
}

// ---------- cursor ring and magnetic buttons (mouse and trackpad only) ----------
if (finePointer && !calm) {
  const ring = document.querySelector<HTMLElement>('.cursor');
  if (ring) {
    let x = -100, y = -100, rx = -100, ry = -100;
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    window.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; ring.classList.add('is-on'); }, { passive: true });
    document.addEventListener('pointerleave', () => ring.classList.remove('is-on'));
    window.addEventListener('pointerdown', () => ring.classList.add('is-down'));
    window.addEventListener('pointerup', () => ring.classList.remove('is-down'));
    const interactive = 'a, button, summary, label, .svc, input, textarea';
    document.addEventListener('pointerover', (e) => { ring.classList.toggle('is-hover', !!(e.target as Element).closest(interactive)); });
  }

  document.querySelectorAll<HTMLElement>('.btn-gold, .btn-ink, .btn-line').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      btn.style.setProperty('--mx', `${(dx * 14).toFixed(1)}px`);
      btn.style.setProperty('--my', `${(dy * 10).toFixed(1)}px`);
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.setProperty('--mx', '0px');
      btn.style.setProperty('--my', '0px');
    });
  });
}
