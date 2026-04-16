// ===========================
// LANGUAGE SWITCHER
// ===========================

let currentLang = 'pl';

function setLang(lang) {
  currentLang = lang;

  // Update button states
  document.getElementById('lang-pl').classList.toggle('active', lang === 'pl');
  document.getElementById('lang-ua').classList.toggle('active', lang === 'ua');
  document.getElementById('lang-pl').setAttribute('aria-pressed', lang === 'pl');
  document.getElementById('lang-ua').setAttribute('aria-pressed', lang === 'ua');

  // Update all translatable elements
  document.querySelectorAll('[data-pl]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text) {
      // For anchor tags with display text, set textContent
      if (el.tagName === 'A' || el.tagName === 'SPAN') {
        el.textContent = text;
      } else {
        el.innerHTML = text;
      }
    }
  });

  // Update document language attribute
  document.documentElement.setAttribute('lang', lang === 'ua' ? 'uk' : 'pl');

  // Update page title
  const titles = {
    pl: 'Dusza Tarota – Indywidualne sesje tarota',
    ua: 'Душа Таро – Індивідуальні сеанси таро'
  };
  document.title = titles[lang];

  // Update floating CTA aria-label
  const floatingLabels = {
    pl: 'Zarezerwuj sesję',
    ua: 'Забронюйте сеанс'
  };
  document.getElementById('floating-cta').setAttribute('aria-label', floatingLabels[lang]);
}

// ===========================
// SMOOTH SCROLL ENHANCEMENT
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===========================
// FAQ ACCORDION LOGIC
// ===========================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const questionBtn = item.querySelector('.faq-question');
  
  questionBtn.addEventListener('click', () => {
    const isCurrentlyActive = item.classList.contains('active');

    // Close all other items (accordion behavior: only one open at a time)
    faqItems.forEach(otherItem => {
      otherItem.classList.remove('active');
      const otherBtn = otherItem.querySelector('.faq-question');
      if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
    });

    // If it wasn't active before, open it now
    if (!isCurrentlyActive) {
      item.classList.add('active');
      questionBtn.setAttribute('aria-expanded', 'true');
    }
  });
});
