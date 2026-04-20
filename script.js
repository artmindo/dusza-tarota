// REMOVE test_event_code after testing in Meta Events Manager
const TEST_EVENT_CODE = 'TEST32795';

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

// ===========================
// TAROT TICKER LOGIC
// ===========================
const tickerRows = document.querySelectorAll('.ticker-row');
const logoSection = document.querySelector('.logo-section');
const logoPerspectiveContainer = document.querySelector('.logo-perspective');

const CLONES_COUNT = 20;

window.addEventListener('load', () => {
  tickerRows.forEach(row => {
    const track = row.querySelector('.ticker-track');
    if (!track) return;
    const originals = Array.from(track.children);

    track.innerHTML = '';

    for (let i = 0; i < CLONES_COUNT; i++) {
      originals.forEach(el => {
        track.appendChild(el.cloneNode(true));
      });
    }

    // Force display to calculate metrics even if hidden by CSS
    const wasHidden = getComputedStyle(row).display === 'none';
    if (wasHidden) {
      row.style.display = 'block';
    }

    const totalWidth = track.scrollWidth;
    const sequenceWidth = totalWidth / CLONES_COUNT;

    if (wasHidden) {
      row.style.display = '';
    }

    track._sequenceWidth = sequenceWidth;
    track._offset = - (sequenceWidth * (CLONES_COUNT / 2));
  });

  if (tickerRows.length > 0) {
    requestAnimationFrame(animateTicker);
  }
});

let tickerLastTime = null;

function animateTicker(time) {
  if (!tickerLastTime) tickerLastTime = time;
  const delta = time - tickerLastTime;
  tickerLastTime = time;

  tickerRows.forEach(row => {
    const track = row.querySelector('.ticker-track');
    if (!track || !track._sequenceWidth) return;
    
    const w = track._sequenceWidth;
    let speed = -0.036;
    if (row.classList.contains('reverse')) speed = 0.036;

    track._offset += delta * speed;

    if (track._offset > 0) {
      track._offset -= w;
    }
    if (track._offset < -w) {
      track._offset += w;
    }

    track.style.transform = `translate3d(${track._offset}px, 0, 0)`;
  });

  if (logoSection && logoPerspectiveContainer) {
    const rect = logoSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    let progress = (rect.top + rect.height * 0.5) / viewportHeight;

    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    const angle = progress * 40;

    logoPerspectiveContainer.style.transform = `rotateX(${angle}deg)`;
  }

  requestAnimationFrame(animateTicker);
}

// ===========================
// META PIXEL TRACKING
// ===========================

function waitForFbq(callback) {
  if (typeof fbq === 'function') {
    callback();
  } else {
    setTimeout(() => waitForFbq(callback), 100);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Add Lead event on main CTA buttons ("Zarezerwuj sesję")
  const floatingCta = document.getElementById('floating-cta');
  if (floatingCta) {
    floatingCta.addEventListener('click', () => {
      waitForFbq(() => {
        console.log('FB EVENT: Lead fired');
        fbq('track', 'Lead', {
          test_event_code: TEST_EVENT_CODE
        });
      });
    });
  }

  // 2. Add InitiateCheckout and Lead on pricing selections ("Wybieram")
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    const btn = card.querySelector('.pricing-btn');
    const priceEl = card.querySelector('.pricing-price');

    if (btn && priceEl) {
      btn.addEventListener('click', () => {
        waitForFbq(() => {
          console.log('FB EVENT: Lead fired');
          fbq('track', 'Lead', {
            test_event_code: TEST_EVENT_CODE
          });

          // Extract price value
          let value = 0;
          const priceText = priceEl.textContent || '';
          if (priceText.includes('90')) {
            value = 90;
          } else if (priceText.includes('150')) {
            value = 150;
          }

          console.log('FB EVENT: InitiateCheckout fired', value);
          fbq('track', 'InitiateCheckout', {
            value: value,
            currency: 'PLN',
            test_event_code: TEST_EVENT_CODE
          });
        });
      });
    }
  });

  // 3. Temporary manual test button
  const testBtn = document.getElementById('test-fb');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      waitForFbq(() => {
        console.log('FB EVENT: Lead fired');
        fbq('track', 'Lead', {
          test_event_code: TEST_EVENT_CODE
        });
      });
    });
  }
});
