(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  var yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Header scroll state + scroll progress */
  var header = document.querySelector('[data-header]');
  var progress = document.querySelector('.progress-bar');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (progress) {
      var doc = document.documentElement;
      var scrollHeight = doc.scrollHeight - doc.clientHeight;
      var pct = scrollHeight > 0 ? (y / scrollHeight) * 100 : 0;
      progress.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    var links = mobileNav.querySelectorAll('a');
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open && window.gsap && !reduceMotion) {
        gsap.fromTo(
          links,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power3.out', delay: 0.05 }
        );
      }
    });
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  /* Animation */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    var heroLines = document.querySelectorAll('[data-hero-line]');
    if (heroLines.length) {
      if (reduceMotion) {
        gsap.set(heroLines, { y: 0, opacity: 1 });
      } else {
        gsap.fromTo(
          heroLines,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.95, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
        );
      }
    }

    var heroFade = document.querySelectorAll('[data-hero-fade]');
    if (heroFade.length) {
      if (reduceMotion) {
        gsap.set(heroFade, { y: 0, opacity: 1 });
      } else {
        gsap.fromTo(
          heroFade,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.45 }
        );
      }
    }

    var reveals = gsap.utils.toArray('[data-reveal]');
    reveals.forEach(function (el) {
      if (reduceMotion) {
        gsap.set(el, { y: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 87%', once: true },
        }
      );
    });

    var groups = document.querySelectorAll('[data-reveal-group]');
    groups.forEach(function (group) {
      var items = group.querySelectorAll('[data-reveal-item]');
      if (!items.length) return;
      if (reduceMotion) {
        gsap.set(items, { y: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(
        items,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: group, start: 'top 87%', once: true },
        }
      );
    });

    var drawPaths = document.querySelectorAll('[data-draw]');
    drawPaths.forEach(function (path) {
      var len;
      try {
        len = path.getTotalLength();
      } catch (e) {
        return;
      }
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: reduceMotion ? 0 : len });
      if (!reduceMotion) {
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2.1,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: path, start: 'top 90%', once: true },
        });
      }
    });

    ScrollTrigger.refresh();

    /* Safety net: hero content must appear on load regardless of rAF
       health (backgrounded tab, throttled device, etc.). Scroll-triggered
       [data-reveal] content is intentionally excluded — it is supposed to
       stay hidden until scrolled into view; ScrollTrigger owns that state. */
    setTimeout(function () {
      document.querySelectorAll('[data-hero-line], [data-hero-fade]').forEach(function (el) {
        if (getComputedStyle(el).opacity === '0') {
          gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' });
        }
      });
    }, 2500);
  } else {
    document
      .querySelectorAll('[data-reveal], [data-reveal-item], [data-hero-line], [data-hero-fade]')
      .forEach(function (el) {
        el.style.opacity = 1;
        el.style.transform = 'none';
      });
  }

  /* Discovery call form — no backend, so hand off to the visitor's mail client */
  var discoveryForm = document.querySelector('[data-discovery-form]');
  if (discoveryForm) {
    var requiredFields = discoveryForm.querySelectorAll('[required]');

    requiredFields.forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.checkValidity()) {
          field.closest('.field').classList.remove('has-error');
        }
      });
    });

    discoveryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      requiredFields.forEach(function (field) {
        var valid = field.checkValidity();
        field.closest('.field').classList.toggle('has-error', !valid);
        if (!valid && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var data = new FormData(discoveryForm);
      var name = (data.get('name') || '').toString().trim();
      var org = (data.get('organisation') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var role = (data.get('role') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();

      var subject = 'Discovery Call Request' + (org ? ' — ' + org : '');
      var bodyLines = [
        'Name: ' + name,
        'Organisation: ' + org,
        'Work email: ' + email,
        'Role / designation: ' + role,
        '',
        'What they would like to discuss:',
        message,
      ];
      var mailto =
        'mailto:hello@sapiencehq.in' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(bodyLines.join('\n'));

      window.location.href = mailto;

      var status = discoveryForm.querySelector('[data-form-status]');
      var submitBtn = discoveryForm.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (status) status.textContent = 'Opening your email client with these details…';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Opening…';
        setTimeout(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }, 1800);
      }
    });
  }

  /* Smooth in-page anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = id && document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
})();
