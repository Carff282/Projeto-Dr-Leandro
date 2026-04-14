/* ============================================================
   SCRIPT.JS — Dr. Leandro Alencar | Oftalmologista
   MedCenter Açailândia — MA
   ============================================================ */

'use strict';

/* ============================================================
   1. LOADER — remove após carregamento completo
   ============================================================ */
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 600);
  }, 800);
});

// Loader: garantir aria-live já está presente no HTML

/* ============================================================
   2. CURSOR PERSONALIZADO
   ============================================================ */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

// Só ativa cursor personalizado em dispositivos com mouse
const hasPointer = window.matchMedia('(pointer: fine)').matches;

if (hasPointer) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform    = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
    cursorDot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
  });

  // Efeito hover em elementos clicáveis
  document.querySelectorAll('a, button, .spec-card, .faq__btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
    });
  });
} else {
  // Remove cursores do DOM em touch devices
  cursor.remove();
  cursorDot.remove();
}

/* ============================================================
   3. NAVBAR — scroll + menu mobile + link ativo
   ============================================================ */
const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navList   = document.getElementById('navList');

// Adiciona classe ao rolar
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  highlightNavLink();
  toggleTopBtn();
});

// Menu mobile
hamburger.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('nav__list--open');
  hamburger.classList.toggle('nav__hamburger--open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Fecha menu ao clicar em link
navList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('nav__list--open');
    hamburger.classList.remove('nav__hamburger--open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Fecha menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    navList.classList.remove('nav__list--open');
    hamburger.classList.remove('nav__hamburger--open');
    hamburger.setAttribute('aria-expanded', false);
  }
});

// Destaca link ativo conforme scroll
function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;

  sections.forEach(section => {
    const link = navList.querySelector(`a[href="#${section.id}"]`);
    if (!link) return;

    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollY >= top && scrollY < bottom) {
      navList.querySelectorAll('.nav__link').forEach(l => l.classList.remove('nav__link--active'));
      link.classList.add('nav__link--active');
    }
  });
}

/* ============================================================
   4. SMOOTH SCROLL — para navegadores que não suportam nativamente
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   5. REVEAL ON SCROLL — animações ao entrar na viewport
   ============================================================ */
function initReveal() {
  const elements = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);

      setTimeout(() => {
        el.classList.add('revealed');
      }, delay);

      observer.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   6. CONTADORES ANIMADOS — KPIs do Hero
   ============================================================ */
function animateCounters() {
  const counters = document.querySelectorAll('[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start    = performance.now();

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out quart
        const eased    = 1 - Math.pow(1 - progress, 4);
        const value    = Math.round(eased * target);
        el.textContent = prefix + value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ============================================================
   7. FAQ — accordion acessível
   ============================================================ */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach(item => {
    const btn   = item.querySelector('.faq__btn');
    const body  = item.querySelector('.faq__body');
    const inner = item.querySelector('.faq__inner');

    if (!btn || !body || !inner) return;

    // Garante altura 0 inicial
    body.style.height = '0px';

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Fecha todos os outros
      items.forEach(other => {
        if (other === item) return;
        other.classList.remove('open');
        other.querySelector('.faq__btn').setAttribute('aria-expanded', false);
        other.querySelector('.faq__body').style.height = '0px';
      });

      // Alterna o clicado
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', false);
        body.style.height = '0px';
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', true);
        body.style.height = inner.offsetHeight + 'px';
      }
    });
  });
}

/* ============================================================
   8. BOTÃO VOLTAR AO TOPO
   ============================================================ */
const topBtn = document.getElementById('topBtn');

function toggleTopBtn() {
  if (!topBtn) return;
  topBtn.classList.toggle('visible', window.scrollY > 450);
}

if (topBtn) {
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   9. EFEITO PARALLAX SUAVE — glow do hero no scroll
   ============================================================ */
function initParallax() {
  const heroLine = document.querySelector('.hero__line');
  if (!heroLine) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroLine.style.transform = `translateY(${y * 0.15}px)`;
  }, { passive: true });
}

/* ============================================================
   10. HIGHLIGHT DE CARDS — efeito de luz seguindo o mouse
   ============================================================ */
function initCardGlow() {
  const cards = document.querySelectorAll('.spec-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--gx', `${x}%`);
      card.style.setProperty('--gy', `${y}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--gx');
      card.style.removeProperty('--gy');
    });
  });
}

/* ============================================================
   11. INICIALIZAÇÃO GERAL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  animateCounters();
  initFAQ();
  initParallax();
  initCardGlow();
  highlightNavLink();
  toggleTopBtn();

  console.log('%cDr. Leandro Alencar — Site carregado com sucesso ✓',
    'color:#c9a84c;font-weight:700;font-size:13px;');
});