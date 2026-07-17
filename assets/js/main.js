/**
 * Warung Teladan — main.js
 * Handles: Navbar scroll, Hamburger menu, Smooth scroll,
 *          Menu filter, Gallery lightbox, AOS init, Misc UI
 */

'use strict';

/* ============================================================
   1. AOS (Animate on Scroll) — Initialize
============================================================ */
AOS.init({
  duration: 550,
  easing: 'ease-out',
  once: true,
  offset: 60,
});

/* ============================================================
   2. NAVBAR — Scroll behavior & active link highlight
============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    // Toggle scrolled state
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link highlight
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load
})();

/* ============================================================
   3. HAMBURGER MENU — Mobile toggle
============================================================ */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ============================================================
   4. SMOOTH SCROLL — Anchor links
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   5. MENU FILTER — Category tabs
============================================================ */
(function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards  = document.querySelectorAll('.menu-card');

  if (!filterBtns.length || !menuCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update button states
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Show/hide cards with fade
      menuCards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          // Slight stagger for re-appearing cards
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ============================================================
   6. GALLERY LIGHTBOX
============================================================ */
(function initLightbox() {
  const galeriItems   = document.querySelectorAll('.galeri-item');
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox) return;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Foto galeri Warung Teladan';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  galeriItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.galeri-img');
      if (img) openLightbox(img.src, img.alt);
    });

    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const img = item.querySelector('.galeri-img');
        if (img) openLightbox(img.src, img.alt);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  // Click outside image closes lightbox
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
})();

/* ============================================================
   7. BACK TO TOP BUTTON
============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   8. FOOTER YEAR — Auto-update copyright year
============================================================ */
(function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   9. CTA BUTTON PRESS EFFECT — Scale feedback on click
============================================================ */
(function initCtaPress() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('pointerdown', () => {
      btn.style.transform = 'scale(0.96)';
    });
    btn.addEventListener('pointerup', () => {
      btn.style.transform = '';
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ============================================================
   10. NAVBAR: Transparent when at top (hero has its own bg)
============================================================ */
(function initNavbarTransparency() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Ensure navbar is always visible with dark text on hero
  if (window.scrollY <= 80) {
    navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)';
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY <= 80) {
      navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)';
    } else {
      navbar.style.background = '';
    }
  }, { passive: true });
})();
