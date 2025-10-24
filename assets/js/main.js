
let currentLang = localStorage.getItem('lang') || 'ar';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  location.reload(); // reload page to apply translation
}

// UI text translations
const uiText = {
  ar: {
    details: "التفاصيل",
    addToCalendar: "أضف للتقويم",
    noEvents: "لا توجد فعاليات حسب الفلترة الحالية.",
    bookingSuccess: "تم تأكيد الحجز (وهمي). شكرًا",
    contactSuccess: "تم إرسال الرسالة بنجاح. شكرًا لتواصلك معنا.",
    invalidEmail: "صيغة البريد غير صحيحة.",
    fillFields: "يرجى ملء الحقول المطلوبة.",
    copySuccess: "تم نسخ رابط الفعالية"
  },
  en: {
    details: "Details",
    addToCalendar: "Add to Calendar",
    noEvents: "No events match the current filters.",
    bookingSuccess: "Booking confirmed (simulated). Thank you",
    contactSuccess: "Message sent successfully. Thank you for contacting us.",
    invalidEmail: "Invalid email format.",
    fillFields: "Please fill in all required fields.",
    copySuccess: "Event link copied"
  }
};

// ==================== Data ====================

const eventsData = [
  {
    id: "e1",
    title: { ar: "مهرجان الموسيقى الصيفي", en: "Summer Music Festival" },
    date: "2025-10-10T19:00:00",
    location: { ar: "ساحة المدينة", en: "City Square" },
    category: { ar: "موسيقى", en: "Music" },
    shortDesc: { ar: "حفلات ليلية مع فرق محلية.", en: "Night concerts with local bands." },
    fullDesc: { ar: "وصف كامل للمهرجان مع تفاصيل الفنانين وبرنامج اليوم.", en: "Full description of the festival, artists, and daily schedule." },
    image: "https://i.postimg.cc/d1ZJHCN3/Chat-GPT-Image-Oct-24-2025-08-41-40-PM.png",
    featured: true
  },
  {
    id: "e2",
    title: { ar: "ماراثون المدينة", en: "City Marathon" },
    date: "2025-10-18T08:00:00",
    location: { ar: "شارع الرياضة", en: "Sports Street" },
    category: { ar: "رياضة", en: "Sports" },
    shortDesc: { ar: "سباق سنوي للمحترفين والهواة.", en: "Annual race for professionals and amateurs." },
    fullDesc: { ar: "تفاصيل المسارات ونقاط التجمع والجوائز.", en: "Track details, meeting points, and prizes." },
    image: "https://i.postimg.cc/5tRs9Q4F/we8si2hrlduzkaqkdaxw.webp",
    featured: true
  },
  {
    id: "e3",
    title: { ar: "معرض الفن التشكيلي", en: "Art Exhibition" },
    date: "2025-11-02T10:00:00",
    location: { ar: "صالة المعارض", en: "Exhibition Hall" },
    category: { ar: "ثقافة", en: "Culture" },
    shortDesc: { ar: "أعمال لفنانين محليين.", en: "Works by local artists." },
    fullDesc: { ar: "تفاصيل الفنانين والمواعيد وورش العمل.", en: "Details about artists, times, and workshops." },
    image: "https://i.postimg.cc/4xrKJJCp/07art-fair-sidebar-gzjw-article-Large.webp",
    featured: false
  },
  {
    id: "e4",
    title: { ar: "سينما في الهواء الطلق", en: "Open-Air Cinema" },
    date: "2025-10-25T20:30:00",
    location: { ar: "الحديقة العامة", en: "Public Park" },
    category: { ar: "عائلي", en: "Family" },
    shortDesc: { ar: "عرض أفلام مناسبة للعائلات.", en: "Family-friendly movie screenings." },
    fullDesc: { ar: "قائمة الأفلام والأنشطة المصاحبة.", en: "List of movies and related activities." },
    image: "https://i.postimg.cc/tgQ0qcBH/images.jpg",
    featured: false
  },
  {
    id: "e5",
    title: { ar: "سوق المزارعين", en: "Farmers Market" },
    date: "2025-10-12T09:00:00",
    location: { ar: "البلدة القديمة", en: "Old Town" },
    category: { ar: "ثقافة", en: "Culture" },
    shortDesc: { ar: "منتجات طازجة وحرف يدوية.", en: "Fresh produce and handmade crafts." },
    fullDesc: { ar: "ساعات العمل وبطاقات البائعين.", en: "Working hours and vendor list." },
    image: "https://i.postimg.cc/fTnYvjqd/Market-83ee3e0a-7a08-475e-8fc3-0e2581558290.jpg",
    featured: false
  }
];

// ==================== Helpers ====================

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ==================== DOM Ready ====================
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  renderFeaturedCarousel();
  renderCategoryBadges();
  renderLatestCards();
  initEventsPage();
  initEventDetailPage();
  initContactForm();
});

// ==================== Functions ====================

// Carousel on homepage
function renderFeaturedCarousel() {
  const carouselInner = document.getElementById('featured-carousel-inner');
  if (!carouselInner) return;
  const featured = eventsData.filter(e => e.featured);
  if (featured.length === 0) {
    carouselInner.innerHTML = '<div class="carousel-item active"><img src="https://picsum.photos/800/400?random=1" class="d-block w-100" alt="placeholder"></div>';
    return;
  }
  carouselInner.innerHTML = featured.map((ev, idx) => `
    <div class="carousel-item ${idx === 0 ? 'active' : ''}">
      <img src="${ev.image}" class="d-block w-100" alt="${ev.title[currentLang]}">
      <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
        <h5>${ev.title[currentLang]}</h5>
        <p>${formatDate(ev.date)} - ${ev.location[currentLang]}</p>
        <a href="event.html?id=${ev.id}" class="btn btn-sm btn-light">${uiText[currentLang].details}</a>
      </div>
    </div>
  `).join('');
}

// Category badges
function renderCategoryBadges() {
  const el = document.getElementById('category-badges');
  if (!el) return;
  const cats = [...new Set(eventsData.map(e => e.category[currentLang]))];
  el.innerHTML = cats.map(c => `<span class="badge bg-secondary badge-cat p-2" onclick="filterByCategory('${c}')">${c}</span>`).join(' ');
}

window.filterByCategory = function (cat) {
  localStorage.setItem('preferredCategory', cat);
  location.href = 'events.html?category=' + encodeURIComponent(cat);
};

// Latest events
function renderLatestCards() {
  const container = document.getElementById('latest-cards');
  if (!container) return;
  const latest = [...eventsData].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);
  container.innerHTML = latest.map(ev => `
    <div class="col-md-6 col-lg-3 mb-3">
      <div class="card card-event h-100">
        <img src="${ev.image}" class="card-img-top" alt="${ev.title[currentLang]}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${ev.title[currentLang]}</h5>
          <p class="card-text small text-muted">${formatDate(ev.date)} | ${ev.location[currentLang]}</p>
          <p class="card-text">${ev.shortDesc[currentLang]}</p>
          <div class="mt-auto">
            <a href="event.html?id=${ev.id}" class="btn btn-primary btn-sm">${uiText[currentLang].details}</a>
            <button class="btn btn-outline-secondary btn-sm" onclick="addToCalendar('${ev.id}')">${uiText[currentLang].addToCalendar}</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Events page
function initEventsPage() {
  const listEl = document.getElementById('events-list');
  if (!listEl) return;
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const sortSelect = document.getElementById('sort-select');
  const clearBtn = document.getElementById('clear-filters');

  const cats = [''].concat([...new Set(eventsData.map(e => e.category[currentLang]))]);
  categorySelect.innerHTML = cats.map(c => c ? `<option value="${c}">${c}</option>` : `<option value="">${currentLang === 'ar' ? 'كل التصنيفات' : 'All Categories'}</option>`).join('');

  const urlParams = new URLSearchParams(location.search);
  const preCat = urlParams.get('category') || localStorage.getItem('preferredCategory') || '';
  if (preCat) {
    categorySelect.value = preCat;
    localStorage.removeItem('preferredCategory');
  }

  function renderFiltered() {
    const q = searchInput.value.trim().toLowerCase();
    const cat = categorySelect.value;
    const sort = sortSelect.value;

    let filtered = eventsData.filter(e => {
      const matchesQ = !q || (e.title[currentLang] + ' ' + e.shortDesc[currentLang] + ' ' + e.fullDesc[currentLang]).toLowerCase().includes(q);
      const matchesCat = !cat || e.category[currentLang] === cat;
      return matchesQ && matchesCat;
    });

    if (sort === 'date_asc') filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    else filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    listEl.innerHTML = filtered.map(ev => `
      <div class="col-md-6 mb-3">
        <div class="card h-100">
          <div class="row g-0">
            <div class="col-5">
              <img src="${ev.image}" class="img-fluid rounded-start" alt="${ev.title[currentLang]}">
            </div>
            <div class="col-7">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${ev.title[currentLang]}</h5>
                <p class="card-text small text-muted">${formatDate(ev.date)} - ${ev.location[currentLang]}</p>
                <p class="card-text">${ev.shortDesc[currentLang]}</p>
                <div class="mt-auto d-flex justify-content-between">
                  <div>
                    <a href="event.html?id=${ev.id}" class="btn btn-primary btn-sm">${uiText[currentLang].details}</a>
                    <button class="btn btn-outline-secondary btn-sm" onclick="addToCalendar('${ev.id}')">${uiText[currentLang].addToCalendar}</button>
                  </div>
                  <span class="badge bg-info">${ev.category[currentLang]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    if (filtered.length === 0)
      listEl.innerHTML = `<div class="col-12"><div class="alert alert-warning">${uiText[currentLang].noEvents}</div></div>`;
  }

  [searchInput, categorySelect, sortSelect].forEach(inp => inp.addEventListener('input', renderFiltered));
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = '';
    sortSelect.value = 'date_asc';
    renderFiltered();
  });

  renderFiltered();
}

// Event detail page
function initEventDetailPage() {
  const container = document.getElementById('event-detail-container');
  if (!container) return;
  const urlParams = new URLSearchParams(location.search);
  const id = urlParams.get('id');
  const ev = eventsData.find(x => x.id === id);
  if (!ev) {
    container.innerHTML = `<div class="alert alert-danger">${currentLang === 'ar' ? 'الفعالية غير موجودة.' : 'Event not found.'}</div>`;
    return;
  }

  container.innerHTML = `
    <div class="row">
      <div class="col-md-8">
        <img src="${ev.image}" class="img-fluid mb-3" alt="${ev.title[currentLang]}">
        <h2>${ev.title[currentLang]}</h2>
        <p class="text-muted">${formatDate(ev.date)} - ${ev.location[currentLang]}</p>
        <p>${ev.fullDesc[currentLang]}</p>
        <div class="mb-3">
          <button class="btn btn-success" onclick="addToCalendar('${ev.id}')">${uiText[currentLang].addToCalendar}</button>
          <button class="btn btn-outline-primary" onclick="shareEvent('${ev.id}')">${currentLang === 'ar' ? 'مشاركة' : 'Share'}</button>
          <button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#fakeBookModal">${currentLang === 'ar' ? 'حجز وهمي' : 'Fake Booking'}</button>
        </div>
        <h5>${currentLang === 'ar' ? 'فعاليات ذات صلة' : 'Related Events'}</h5>
        <div id="related-cards" class="row"></div>
      </div>
      <div class="col-md-4">
        <div class="card p-3">
          <h5>${currentLang === 'ar' ? 'معلومات' : 'Information'}</h5>
          <p><strong>${currentLang === 'ar' ? 'التصنيف:' : 'Category:'}</strong> ${ev.category[currentLang]}</p>
          <p><strong>${currentLang === 'ar' ? 'المكان:' : 'Location:'}</strong> ${ev.location[currentLang]}</p>
          <p><strong>${currentLang === 'ar' ? 'التاريخ:' : 'Date:'}</strong> ${formatDate(ev.date)}</p>
        </div>
      </div>
    </div>
  `;
}

// Share Event
function shareEvent(id) {
  const url = location.origin + location.pathname.replace(/[^\/]*$/, 'event.html') + '?id=' + id;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => alert(uiText[currentLang].copySuccess));
  } else {
    prompt(currentLang === 'ar' ? 'انسخ الرابط:' : 'Copy link:', url);
  }
}

// Add to calendar
function addToCalendar(id) {
  const ev = eventsData.find(x => x.id === id);
  if (!ev) return;
  const start = new Date(ev.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  function formatICS(d) {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${ev.id}@my-website`,
    `DTSTAMP:${formatICS(new Date())}`,
    `DTSTART:${formatICS(start)}`,
    `DTEND:${formatICS(end)}`,
    `SUMMARY:${ev.title[currentLang]}`,
    `DESCRIPTION:${ev.fullDesc[currentLang]}`,
    `LOCATION:${ev.location[currentLang]}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${ev.title[currentLang].replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Contact form
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const alertBox = document.getElementById('contact-alert');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const msg = document.getElementById('contact-message').value.trim();

    if (!name || !email || !msg) {
      showInlineAlert(alertBox, uiText[currentLang].fillFields, 'danger');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showInlineAlert(alertBox, uiText[currentLang].invalidEmail, 'danger');
      return;
    }

    showInlineAlert(alertBox, uiText[currentLang].contactSuccess, 'success');
    form.reset();
  });
}

function showInlineAlert(container, text, type = 'success') {
  container.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
}
