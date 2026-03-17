/* ════════════════════════════════════════════════════
   Alpha Consulting — Interactive Features
   ════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll effect ───
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ─── Mobile menu ───
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ─── Active nav link on scroll ───
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a:not(.btn)');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ─── Scroll animations ───
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  animatedEls.forEach(el => observer.observe(el));

  // ─── Counter animation ───
  const countEls = document.querySelectorAll('.stat-number[data-target]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 2000;
      const start  = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / dur, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  countEls.forEach(el => countObserver.observe(el));

  // ─── Testimonial Carousel ───
  const track   = document.getElementById('testimonialTrack');
  const cards   = track.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsBox = document.getElementById('carouselDots');
  let current   = 0;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  });
  const dots = dotsBox.querySelectorAll('.dot');

  const goTo = (index) => {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-play every 6s
  let autoPlay = setInterval(() => goTo(current + 1), 6000);
  const carousel = document.getElementById('testimonialCarousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
  carousel.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => goTo(current + 1), 6000);
  });

  // ─── Contact form ───
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoader  = submitBtn.querySelector('.btn-loader');
  const successMsg = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const fields = form.querySelectorAll('[required]');
    let valid = true;
    fields.forEach(f => {
      if (!f.value.trim()) {
        f.style.borderColor = '#f43f5e';
        valid = false;
      } else {
        f.style.borderColor = '';
      }
    });
    if (!valid) return;

    // Simulate submission
    btnText.hidden  = true;
    btnLoader.hidden = false;
    submitBtn.disabled = true;

    setTimeout(() => {
      btnText.hidden   = false;
      btnLoader.hidden = true;
      submitBtn.disabled = false;
      successMsg.hidden = false;

      // Reset after 5s
      setTimeout(() => {
        successMsg.hidden = true;
        form.reset();
      }, 5000);
    }, 1500);
  });

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
