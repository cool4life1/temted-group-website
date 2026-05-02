/* =========================================================
   TemTed — App JS
   Nav, mega menu, mobile nav, tabs, accordions, filters, modals, reveal-on-scroll
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Inject partials (header / footer) ---------- */
  async function injectPartial(slot, url) {
    const target = $(`[data-partial="${slot}"]`);
    if (!target) return;
    try {
      const res = await fetch(url);
      const html = await res.text();
      target.innerHTML = html;
    } catch (err) {
      console.warn('Partial inject failed:', slot, err);
    }
  }

  async function loadPartials() {
    await Promise.all([
      injectPartial('header', './partials/header.html'),
      injectPartial('footer', './partials/footer.html'),
      injectPartial('announce', './partials/announce.html')
    ]);
    initNav();
    initSignInMenu();
    initMobileNav();
    setActiveNavLink();
  }

  /* ---------- Navigation: mega menu ---------- */
  function initNav() {
    $$('.primary-nav__link[data-mega]').forEach(trigger => {
      const id = trigger.getAttribute('aria-controls');
      const mega = id ? document.getElementById(id) : null;
      if (!mega) return;

      const open = () => {
        closeAllMegas();
        trigger.setAttribute('aria-expanded', 'true');
        mega.classList.add('is-open');
      };
      const close = () => {
        trigger.setAttribute('aria-expanded', 'false');
        mega.classList.remove('is-open');
      };

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        isOpen ? close() : open();
      });

      // Hover support on desktop
      const item = trigger.closest('.primary-nav__item');
      if (item) {
        let hoverTimeout;
        item.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimeout);
          if (window.matchMedia('(min-width: 1041px)').matches) open();
        });
        item.addEventListener('mouseleave', () => {
          hoverTimeout = setTimeout(() => {
            if (window.matchMedia('(min-width: 1041px)').matches) close();
          }, 150);
        });
      }
    });

    // Click-outside to close
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.primary-nav__item')) closeAllMegas();
    });

    // Escape closes all
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllMegas();
        closeSignIn();
      }
    });
  }

  function closeAllMegas() {
    $$('.primary-nav__link[aria-expanded="true"]').forEach(t => t.setAttribute('aria-expanded', 'false'));
    $$('.mega.is-open').forEach(m => m.classList.remove('is-open'));
  }

  /* ---------- Sign-in dropdown ---------- */
  function initSignInMenu() {
    const trigger = $('[data-signin-trigger]');
    const dropdown = $('[data-signin-dropdown]');
    if (!trigger || !dropdown) return;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('is-open');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.signin-menu')) dropdown.classList.remove('is-open');
    });
  }
  function closeSignIn() {
    $('[data-signin-dropdown]')?.classList.remove('is-open');
  }

  /* ---------- Mobile nav ---------- */
  function initMobileNav() {
    const toggle = $('.nav-toggle');
    const wrap = $('.mobile-nav');
    if (!toggle || !wrap) return;
    toggle.addEventListener('click', () => {
      const open = wrap.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Toggle mega submenus on mobile via click
    $$('.primary-nav__link[data-mega]', wrap).forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 1040px)').matches) {
          e.preventDefault();
          const id = link.getAttribute('aria-controls');
          const mega = id ? document.getElementById(id) : null;
          if (!mega) return;
          const isOpen = mega.classList.toggle('is-open');
          link.setAttribute('aria-expanded', String(isOpen));
        }
      });
    });
  }

  /* ---------- Active nav link ---------- */
  function setActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    $$('.primary-nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href.endsWith(path)) link.classList.add('is-active');
    });
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    $$('[role="tablist"]').forEach(list => {
      const tabs = $$('[role="tab"]', list);
      const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));

      function activate(i) {
        tabs.forEach((t, idx) => {
          const on = idx === i;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          if (panels[idx]) panels[idx].hidden = !on;
        });
      }

      tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => activate(i));
        tab.addEventListener('keydown', (e) => {
          let next = -1;
          if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
          if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          if (next >= 0) {
            tabs[next].focus();
            activate(next);
          }
        });
      });

      const initial = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
      activate(initial >= 0 ? initial : 0);
    });
  }

  /* ---------- Accordion ---------- */
  function initAccordion() {
    $$('.accordion-item').forEach(item => {
      const btn = $('.accordion__trigger', item);
      const panel = $('.accordion__panel', item);
      if (!btn || !panel) return;
      btn.addEventListener('click', () => {
        const open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ---------- Product Hub filters ---------- */
  function initFilters() {
    const bar = $('[data-filterbar]');
    if (!bar) return;
    const chips = $$('.chip', bar);
    const cards = $$('[data-product-card]');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const active = chip.classList.contains('is-active');
        const filter = chip.getAttribute('data-filter');

        // Toggle
        chips.forEach(c => c.classList.remove('is-active'));
        if (!active) chip.classList.add('is-active');

        const target = active ? 'all' : filter;
        cards.forEach(card => {
          const tags = (card.getAttribute('data-tags') || '').split(',').map(t => t.trim());
          const show = target === 'all' || tags.includes(target);
          card.style.display = show ? '' : 'none';
        });
      });
    });

    // Sidebar category links
    $$('[data-cat]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.getAttribute('data-cat');
        $$('[data-cat]').forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
        cards.forEach(card => {
          const tags = (card.getAttribute('data-tags') || '').split(',').map(t => t.trim());
          const show = cat === 'all' || tags.includes(cat);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Catalog filters (Academy, Insights) ---------- */
  function initCatalogFilters() {
    $$('.catalog-filters').forEach(bar => {
      const chips = $$('.chip', bar);
      const items = $$('[data-track]');
      const emptyState = document.getElementById('post-grid-empty');

      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('chip--active'));
          chip.classList.add('chip--active');
          const target = chip.getAttribute('data-filter');
          let visibleCount = 0;
          items.forEach(item => {
            const track = item.getAttribute('data-track');
            const show = target === 'all' || track === target;
            item.style.display = show ? '' : 'none';
            if (show) visibleCount++;
          });
          if (emptyState) {
            emptyState.classList.toggle('is-visible', visibleCount === 0);
          }
        });
      });
    });
  }

  /* ---------- Modal ---------- */
  function initModals() {
    $$('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-modal-open');
        const modal = document.getElementById(id);
        if (modal) {
          modal.classList.add('is-open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    $$('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    });
    $$('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  }

  /* ---------- Announcement bar dismiss ---------- */
  function initAnnounce() {
    const close = $('.announce__close');
    if (!close) return;
    close.addEventListener('click', () => {
      const wrap = close.closest('.announce-wrap');
      if (wrap) wrap.style.display = 'none';
      try { sessionStorage.setItem('tt_announce_dismissed', '1'); } catch {}
    });
    try {
      if (sessionStorage.getItem('tt_announce_dismissed') === '1') {
        const wrap = $('.announce-wrap');
        if (wrap) wrap.style.display = 'none';
      }
    } catch {}
  }

  /* ---------- Scroll to top ---------- */
  function initScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;
    const toggle = () => btn.classList.toggle('is-visible', window.scrollY > 400);
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Year stamp ---------- */
  function stampYear() {
    $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Dark / Light mode ---------- */
  function initTheme() {
    // Apply saved preference immediately (called before partials so no flash)
    const saved = localStorage.getItem('tt_theme');
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  }

  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('tt_theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('tt_theme', 'dark');
      }
    });
  }

  /* ---------- Boot ---------- */
  // Apply theme before DOM renders to prevent flash
  initTheme();

  document.addEventListener('DOMContentLoaded', async () => {
    await loadPartials();
    initThemeToggle();
    initTabs();
    initAccordion();
    initFilters();
    initCatalogFilters();
    initModals();
    initReveal();
    initAnnounce();
    initScrollTop();
    stampYear();
  });
})();
