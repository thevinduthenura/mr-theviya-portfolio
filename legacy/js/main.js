/* ==============================
   Mr. Theviya Portfolio — main.js
   ============================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── CUSTOM CURSOR ──────────────────────────────────────
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const interactables = 'a, button, .service-card, .skill-tag, .contact-item';
  document.querySelectorAll(interactables).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expanded'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expanded'));
  });

  function animateCursor() {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ── NAVBAR SCROLL EFFECT ───────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── MOBILE MENU ─────────────────────────────────────────
  const burger     = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── INTERSECTION OBSERVER — FADE UP ────────────────────
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  // ── NAV ACTIVE LINK ON SCROLL ──────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });

  // ── STATS COUNTER ANIMATION ────────────────────────────
  function animateCounter(el, target, suffix) {
    const duration = 1500;
    const start    = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
      const value    = Math.floor(eased * target);
      el.innerHTML   = value + '<span>' + suffix + '</span>';
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.hero-stats');
  let statsAnimated  = false;
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      const nums = document.querySelectorAll('.stat-num');
      if (nums[0]) animateCounter(nums[0],   5, '+');
      if (nums[1]) animateCounter(nums[1], 120, '+');
      if (nums[2]) animateCounter(nums[2],  35, '+');
    }
  }, { threshold: 0.5 });

  if (statsSection) statsObserver.observe(statsSection);

  // ── CONTACT FORM ────────────────────────────────────────
  const sendBtn     = document.getElementById('sendBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const first   = document.getElementById('firstName')?.value.trim();
      const email   = document.getElementById('emailInput')?.value.trim();
      const message = document.getElementById('messageInput')?.value.trim();

      if (!first || !email || !message) {
        alert('Please fill in your name, email, and message.');
        return;
      }
      // In production, replace with actual form submission (e.g. Formspree, EmailJS)
      sendBtn.textContent = 'Sending…';
      sendBtn.disabled    = true;
      setTimeout(() => {
        sendBtn.textContent = 'Send Message →';
        sendBtn.disabled    = false;
        formSuccess.classList.add('show');
        ['firstName','lastName','emailInput','serviceInput','messageInput'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1000);
    });
  }

});
