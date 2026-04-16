/**
 * Cityhub AI – Landing Page JavaScript
 */

'use strict';

/* ──────────────────────────────────────────── Nav scroll effect */
(function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 40
      ? 'rgba(5,7,15,0.96)'
      : 'rgba(5,7,15,0.8)';
  }, { passive: true });
})();

/* ──────────────────────────────────────────── Mobile burger menu */
(function initMobileMenu() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  function toggle(open) {
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    toggle(!isOpen);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggle(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !menu.contains(e.target)) {
      toggle(false);
    }
  });
})();

/* ──────────────────────────────────────────── Smooth-scroll for anchor links */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('nav')?.offsetHeight ?? 72;
        const y = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
})();

/* ──────────────────────────────────────────── Scroll-reveal animations */
(function initReveal() {
  const sections = document.querySelectorAll(
    '.feature-card, .step, .case-card, .pricing-card, .section-header, .logos, .hero__card'
  );

  sections.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  sections.forEach((el) => observer.observe(el));
})();

/* ──────────────────────────────────────────── Demo modal */
(function initDemoModal() {
  const overlay   = document.getElementById('modal-overlay');
  const openBtn   = document.getElementById('open-demo');
  const closeBtn  = document.getElementById('modal-close');
  const demoCta   = document.getElementById('demo-cta');
  if (!overlay) return;

  function open() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    openBtn?.focus();
  }

  openBtn?.addEventListener('click', (e) => { e.preventDefault(); open(); });
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  // Also open demo on hero CTA
  document.querySelectorAll('a[href="#demo"]').forEach(a => {
    a.addEventListener('click', (e) => {
      // Let the smooth scroll happen, then optionally open modal on click of button inside section
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });

  // CTA inside modal scrolls to contact and closes modal
  demoCta?.addEventListener('click', () => close());
})();

/* ──────────────────────────────────────────── Typing animation in demo chat */
(function initTypingAnimation() {
  const bubble = document.getElementById('typing-bubble');
  if (!bubble) return;

  const responses = [
    'Energy demand tonight is forecast at <span class="blue">87% capacity</span>. Renewable share: <span class="green">42%</span>. Auto-scheduling off-peak street-lighting in 3 districts.',
    'Based on current patterns, I recommend activating 3 additional solar-storage units between 21:00–23:00 to reduce grid peak by <span class="green">11%</span>.',
    'Temperature drop of 4°C expected at 20:00. Heating demand will increase by <span class="orange">18%</span>. Alerting facilities management.',
  ];

  let idx = 0;

  function showNext() {
    bubble.classList.add('typing');
    bubble.innerHTML = '<span></span><span></span><span></span>';

    setTimeout(() => {
      bubble.classList.remove('typing');
      bubble.classList.add('demo-chat__bubble--ai');
      bubble.innerHTML = `<strong>CityAI:</strong> ${responses[idx % responses.length]}`;
      idx++;
      setTimeout(showNext, 5000);
    }, 2000);
  }

  // Start after a short delay
  setTimeout(showNext, 3000);
})();

/* ──────────────────────────────────────────── Contact form */
(function initContactForm() {
  const form    = document.getElementById('cta-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic client-side validation
    let valid = true;
    form.querySelectorAll('input[required]').forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('invalid');
        valid = false;
      } else {
        input.classList.remove('invalid');
      }
    });

    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput.classList.add('invalid');
      valid = false;
    }

    if (!valid) return;

    // Simulate submission
    form.hidden = true;
    if (success) success.hidden = false;
  });

  // Remove invalid state on input
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('invalid'));
  });
})();

/* ──────────────────────────────────────────── Active nav link on scroll */
(function initActiveNav() {
  const sections = ['features', 'how-it-works', 'use-cases', 'pricing', 'demo', 'contact'];
  const navLinks = document.querySelectorAll('.nav__links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => {
            const href = a.getAttribute('href');
            a.style.color = href === `#${id}` ? 'var(--clr-text)' : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();
