/* ============================================================
   Studio Mouton Noir — Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav scroll ─────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  const backTop = document.querySelector('.back-top');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav?.classList.toggle('scrolled', y > 60);
    backTop?.classList.toggle('visible', y > 600);
  }, { passive: true });

  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Mobile menu ────────────────────────────────────────── */
  const toggle   = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobileNav?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle?.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Intersection Observer — base reveal ────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  /* ── Staggered children reveal ──────────────────────────── */
  const staggerContainers = document.querySelectorAll('[data-stagger]');
  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const children = e.target.querySelectorAll('[data-stagger-child]');
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), i * 120);
      });
      staggerObs.unobserve(e.target);
    });
  }, { threshold: 0.1 });

  staggerContainers.forEach(el => staggerObs.observe(el));

  /* ── Parallax hero deco text ────────────────────────────── */
  const heroDeco = document.querySelector('.hero-deco');
  const heroBg   = document.querySelector('.hero-bg');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroDeco) {
      heroDeco.style.transform = `translateY(calc(-50% + ${y * 0.3}px))`;
      heroDeco.style.opacity = Math.max(0, 1 - y / 500);
    }
    if (heroBg) {
      heroBg.style.transform = `translateY(${y * 0.15}px)`;
    }
  }, { passive: true });

  /* ── Section line progress indicator ───────────────────── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: #9B2335; z-index: 200;
    transform-origin: left; transform: scaleX(0);
    transition: transform 0.1s linear;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = window.scrollY / max;
    progressBar.style.transform = `scaleX(${pct})`;
  }, { passive: true });

  /* ── Horizontal marquee on philosophy quote ─────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    // Clone for infinite loop
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }

  /* ── Portfolio filter ───────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const show = filter === 'all' || item.dataset.style === filter;
        item.style.opacity    = show ? '1' : '0.2';
        item.style.transform  = show ? 'scale(1)' : 'scale(0.97)';
        item.style.transition = 'opacity 0.3s, transform 0.3s';
        item.style.pointerEvents = show ? '' : 'none';
      });

      // Auto-scroll to targeted category
      const targetId = filter === 'all' ? 'portfolio_content' : `cat-${filter}`;
      const scrollTarget = document.getElementById(targetId);
      if (scrollTarget) {
        const offset = 100;
        const top = scrollTarget.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Flash page filter scroll ───────────────────────────── */
  const flashFilterBtns = document.querySelectorAll('.flash-filter-btn');
  flashFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all, add to clicked
      flashFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.target;
      const scrollTarget = document.getElementById(targetId);
      if (scrollTarget) {
        const offset = 100; // Account for sticky header
        const top = scrollTarget.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Number counter animation ───────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = parseInt(e.target.dataset.count, 10);
      const suffix = e.target.dataset.suffix || '';
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        e.target.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 16);
      countObs.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObs.observe(el));

  /* ── Cursor glow effect ─────────────────────────────────── */
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(155,35,53,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

  /* ── Tilt effect on artist cards ────────────────────────── */
  document.querySelectorAll('.artist-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
      card.style.transition = 'transform 0.4s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  /* ── Typing effect on hero tagline ─────────────────────── */
  const typingEl = document.querySelector('[data-typing]');
  if (typingEl) {
    const text = typingEl.dataset.typing;
    typingEl.textContent = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.style.cssText = 'border-right: 2px solid #9B2335; margin-left: 2px; animation: blink 1s step-end infinite;';
    typingEl.appendChild(cursor);
    const style = document.createElement('style');
    style.textContent = '@keyframes blink { 50% { border-color: transparent; } }';
    document.head.appendChild(style);
    setTimeout(() => {
      const interval = setInterval(() => {
        cursor.insertAdjacentText('beforebegin', text[i++]);
        if (i >= text.length) clearInterval(interval);
      }, 55);
    }, 800);
  }

  /* ── Smooth anchor links ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Section active highlight in nav ───────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + e.target.id ? '#F3F3F3' : '';
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => activeObs.observe(s));

  /* ── Booking form ───────────────────────────────────────── */
  const form = document.querySelector('.booking-form form');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;

    const nom       = form.querySelector('[name=name]')?.value.trim()      || '';
    const email     = form.querySelector('[name=email]')?.value.trim()     || '';
    const telephone = form.querySelector('[name=phone]')?.value.trim()     || '';
    const instagram = form.querySelector('[name=instagram]')?.value.trim() || '';
    const description = form.querySelector('[name=idea]')?.value.trim()   || '';
    const placement = form.querySelector('[name=placement]')?.value        || '';
    const taille    = form.querySelector('[name=size]')?.value             || '';
    const budget    = form.querySelector('[name=budget]')?.value           || '';

    try {
      const res = await fetch('https://studio-mouton-noir.vercel.app/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, telephone, description, placement, taille, budget, instagram }),
      });
      const data = await res.json();
      if (data.success) {
        // Replace form with success message
        form.innerHTML = `
          <div style="text-align:center; padding: 2rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">✦</div>
            <p style="font-size: 1.1rem; color: #F3F3F3; margin-bottom: 0.5rem; letter-spacing: 0.05em;">Demande reçue</p>
            <p style="color: #8A8A8A; font-size: 0.9rem; line-height: 1.6;">
              Merci ${nom} — on a bien reçu ta demande.<br>
              On te revient sous peu pour confirmer les détails.
            </p>
          </div>
        `;
        // Scroll success message into view on mobile
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error(data.error || 'Erreur');
      }
    } catch {
      btn.textContent = originalText;
      btn.disabled = false;
      // Show inline error instead of alert
      let errEl = form.querySelector('.form-error-msg');
      if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form-error-msg';
        errEl.style.cssText = 'color:#c0392b; font-size:0.85rem; margin-top:0.75rem; text-align:center;';
        btn.parentNode.insertBefore(errEl, btn.nextSibling);
      }
      errEl.textContent = 'Une erreur est survenue. Réessaie ou écris-nous directement.';
    }
  });

});
