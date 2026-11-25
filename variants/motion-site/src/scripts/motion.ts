// Option F: the animation layer on top of option E.
// Everything here is progressive enhancement: with JavaScript off, or when the visitor prefers
// reduced motion, the page is simply option E.

const root = document.documentElement;
const calm = root.classList.contains('calm');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Seconds the opening curtain takes (0 when it is skipped), read from the CSS custom property. */
const introDelay = (): number => {
  const v = getComputedStyle(root).getPropertyValue('--d0').trim();
  return v.endsWith('s') ? parseFloat(v) : 0;
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
  const tick = (now: number) => {
    const p = Math.min(1, Math.max(0, (now - start) / duration));
    el.textContent = prefix + (target * easeOut(p)).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

if (!calm) {
  const splits = Array.from(document.querySelectorAll<HTMLElement>('[data-split]'));
  splits.forEach(splitWords);
  const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  counters.forEach((el) => {
    el.textContent = (el.dataset.prefix ?? '') + (0).toFixed((el.dataset.count!.split('.')[1] ?? '').length) + (el.dataset.suffix ?? '');
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        if (el.hasAttribute('data-split')) el.classList.add('is-in');
        if (el.hasAttribute('data-count')) countUp(el, el.closest('.hero') ? introDelay() + 0.6 : 0);
        io.unobserve(el);
      }
    },
    { threshold: 0.25 },
  );
  [...splits, ...counters].forEach((el) => io.observe(el));
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
