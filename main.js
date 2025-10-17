// main.js
// بيانات تجريبية للفعاليات. في المشروع الحقيقي يمكنك استبدالها بملف JSON خارجي.
const eventsData = [
    {
        id: "e1",
        title: "مهرجان الموسيقى الصيفي",
        date: "2025-10-10T19:00:00",
        location: "ساحة المدينة",
        category: "موسيقى",
        shortDesc: "حفلات ليلية مع فرق محلية.",
        fullDesc: "وصف كامل للمهرجان مع تفاصيل الفنانين وبرنامج اليوم.",
        image: "https://picsum.photos/seed/sport/800/400",
        featured: true
    },
    {
        id: "e2",
        title: "ماراثون المدينة",
        date: "2025-10-18T08:00:00",
        location: "شارع الرياضة",
        category: "رياضة",
        shortDesc: "سباق سنوي للمحترفين والهواة.",
        fullDesc: "تفاصيل المسارات ونقاط التجمع والجوائز.",
        image: "https://picsum.photos/seed/sport/800/400",
        featured: true
    },
    {
        id: "e3",
        title: "معرض الفن التشكيلي",
        date: "2025-11-02T10:00:00",
        location: "صالة المعارض",
        category: "ثقافة",
        shortDesc: "أعمال لفنانين محليين.",
        fullDesc: "تفاصيل الفنانين والمواعيد وورش العمل.",
        image: "https://picsum.photos/seed/art/800/400",
        featured: false
    },
    {
        id: "e4",
        title: "سينما في الهواء الطلق",
        date: "2025-10-25T20:30:00",
        location: "الحديقة العامة",
        category: "عائلي",
        shortDesc: "عرض أفلام مناسبة للعائلات.",
        fullDesc: "قائمة الأفلام والأنشطة المصاحبة.",
        image: "https://picsum.photos/seed/cinema/800/400",
        featured: false
    },
    {
        id: "e5",
        title: "سوق المزارعين",
        date: "2025-10-12T09:00:00",
        location: "البلدة القديمة",
        category: "ثقافة",
        shortDesc: "منتجات طازجة وحرف يدوية.",
        fullDesc: "ساعات العمل وبطاقات البائعين.",
        image: "https://picsum.photos/seed/market/800/400",
        featured: false
    }
];

// Utility: تحويل ISO date إلى تنسيق ظاهر
function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString('ar-EG', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// --- DOM helpers لتوليد المحتوى حسب الصفحة ---
document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedCarousel();
    renderCategoryBadges();
    renderLatestCards();
    initEventsPage();
    initEventDetailPage();
    initContactForm();
});

// توليد Carousel في الصفحة الرئيسية
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
      <img src="${ev.image}" class="d-block w-100" alt="${ev.title}">
      <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
        <h5>${ev.title}</h5>
        <p>${formatDate(ev.date)} - ${ev.location}</p>
        <a href="event.html?id=${ev.id}" class="btn btn-sm btn-light">التفاصيل</a>
      </div>
    </div>
  `).join('');
}

// شارات التصنيفات السريعة (index)
function renderCategoryBadges() {
    const el = document.getElementById('category-badges');
    if (!el) return;
    const cats = [...new Set(eventsData.map(e => e.category))];
    el.innerHTML = cats.map(c => `<span class="badge bg-secondary badge-cat p-2" onclick="filterByCategory('${c}')">${c}</span>`).join(' ');
}
window.filterByCategory = function (cat) {
    // يحفظ التفضيل ويفتح صفحة الفعاليات مفعل بها التصنيف
    localStorage.setItem('preferredCategory', cat);
    location.href = 'events.html?category=' + encodeURIComponent(cat);
};

// بطاقات أحدث الفعاليات في index (أول 4)
function renderLatestCards() {
    const container = document.getElementById('latest-cards');
    if (!container) return;
    const latest = [...eventsData].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);
    container.innerHTML = latest.map(ev => `
    <div class="col-md-6 col-lg-3 mb-3">
      <div class="card card-event h-100">
        <img src="${ev.image}" class="card-img-top" alt="${ev.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${ev.title}</h5>
          <p class="card-text small text-muted">${formatDate(ev.date)} | ${ev.location}</p>
          <p class="card-text">${ev.shortDesc}</p>
          <div class="mt-auto">
            <a href="event.html?id=${ev.id}" class="btn btn-primary btn-sm">التفاصيل</a>
            <button class="btn btn-outline-secondary btn-sm" onclick="addToCalendar('${ev.id}')">أضف للتقويم</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// --- صفحة events.html: فلترة وبناء القائمة ---
function initEventsPage() {
    const listEl = document.getElementById('events-list');
    if (!listEl) return;
    // عناصر البحث والفلتر
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const sortSelect = document.getElementById('sort-select');
    const clearBtn = document.getElementById('clear-filters');

    // ملأ الخيارات
    const cats = [''].concat([...new Set(eventsData.map(e => e.category))]);
    categorySelect.innerHTML = cats.map(c => c ? `<option value="${c}">${c}</option>` : `<option value="">كل التصنيفات</option>`).join('');

    // إذا وصلت عبر رابط مع ?category=
    const urlParams = new URLSearchParams(location.search);
    const preCat = urlParams.get('category') || localStorage.getItem('preferredCategory') || '';
    if (preCat) {
        categorySelect.value = preCat;
        localStorage.removeItem('preferredCategory');
    }

    // الحدث لفلترة وعرض
    function renderFiltered() {
        const q = searchInput.value.trim().toLowerCase();
        const cat = categorySelect.value;
        const sort = sortSelect.value;

        let filtered = eventsData.filter(e => {
            const matchesQ = !q || (e.title + ' ' + e.shortDesc + ' ' + e.fullDesc).toLowerCase().includes(q);
            const matchesCat = !cat || e.category === cat;
            return matchesQ && matchesCat;
        });

        if (sort === 'date_asc') filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        else filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        listEl.innerHTML = filtered.map(ev => `
      <div class="col-md-6 mb-3">
        <div class="card h-100">
          <div class="row g-0">
            <div class="col-5">
              <img src="${ev.image}" class="img-fluid rounded-start" alt="${ev.title}">
            </div>
            <div class="col-7">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${ev.title}</h5>
                <p class="card-text small text-muted">${formatDate(ev.date)} - ${ev.location}</p>
                <p class="card-text">${ev.shortDesc}</p>
                <div class="mt-auto d-flex justify-content-between">
                  <div>
                    <a href="event.html?id=${ev.id}" class="btn btn-primary btn-sm">تفاصيل</a>
                    <button class="btn btn-outline-secondary btn-sm" onclick="addToCalendar('${ev.id}')">أضف للتقويم</button>
                  </div>
                  <span class="badge bg-info">${ev.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

        if (filtered.length === 0) listEl.innerHTML = `<div class="col-12"><div class="alert alert-warning">لا توجد فعاليات حسب الفلترة الحالية.</div></div>`;
    }

    // event listeners
    [searchInput, categorySelect, sortSelect].forEach(inp => inp.addEventListener('input', renderFiltered));
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        categorySelect.value = '';
        sortSelect.value = 'date_asc';
        renderFiltered();
    });

    renderFiltered();
}

// --- التفاصيل: event.html ---
function initEventDetailPage() {
    const container = document.getElementById('event-detail-container');
    if (!container) return;
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get('id');
    const ev = eventsData.find(x => x.id === id);
    if (!ev) {
        container.innerHTML = `<div class="alert alert-danger">الفعالية غير موجودة.</div>`;
        return;
    }

    container.innerHTML = `
    <div class="row">
      <div class="col-md-8">
        <img src="${ev.image}" class="img-fluid mb-3" alt="${ev.title}">
        <h2>${ev.title}</h2>
        <p class="text-muted">${formatDate(ev.date)} - ${ev.location}</p>
        <p>${ev.fullDesc}</p>
        <div class="mb-3">
          <button class="btn btn-success" onclick="addToCalendar('${ev.id}')">أضف للتقويم</button>
          <button class="btn btn-outline-primary" onclick="shareEvent('${ev.id}')">مشاركة</button>
          <button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#fakeBookModal">حجز وهمي</button>
        </div>
        <h5>فعاليات ذات صلة</h5>
        <div id="related-cards" class="row"></div>
      </div>
      <div class="col-md-4">
        <div class="card p-3">
          <h5>معلومات</h5>
          <p><strong>التصنيف:</strong> ${ev.category}</p>
          <p><strong>المكان:</strong> ${ev.location}</p>
          <p><strong>التاريخ:</strong> ${formatDate(ev.date)}</p>
        </div>
      </div>
    </div>

    <!-- Modal للحجز الوهمي -->
    <div class="modal fade" id="fakeBookModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">حجز مكان (وهمي)</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="book-form">
              <div class="mb-2"><input class="form-control" id="book-name" placeholder="الاسم" required></div>
              <div class="mb-2"><input class="form-control" id="book-email" type="email" placeholder="البريد" required></div>
              <button class="btn btn-primary" type="submit">تأكيد الحجز</button>
            </form>
            <div id="book-alert" class="mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  `;

    // Related events (share same category)
    const related = eventsData.filter(x => x.category === ev.category && x.id !== ev.id).slice(0, 3);
    const relatedEl = document.getElementById('related-cards');
    relatedEl.innerHTML = related.map(r => `
    <div class="col-12 mb-2">
      <div class="card">
        <div class="card-body d-flex align-items-center">
          <img src="${r.image}" alt="" style="width:80px;height:60px;object-fit:cover;margin-left:10px;">
          <div>
            <h6 class="mb-0">${r.title}</h6>
            <small class="text-muted">${formatDate(r.date)}</small>
          </div>
          <div class="ms-auto"><a href="event.html?id=${r.id}" class="btn btn-sm btn-outline-primary">عرض</a></div>
        </div>
      </div>
    </div>
  `).join('');

    // Fake booking handler
    const bookForm = document.getElementById('book-form');
    if (bookForm) {
        bookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('book-alert').innerHTML = `<div class="alert alert-success">تم تأكيد الحجز (وهمي). شكرًا ${document.getElementById('book-name').value}.</div>`;
            bookForm.reset();
        });
    }
}

// --- مشاركة الحدث (مشاركة بسيطة عبر نسخ رابط) ---
function shareEvent(id) {
    const url = location.origin + location.pathname.replace(/[^\/]*$/, 'event.html') + '?id=' + id;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => alert('تم نسخ رابط الفعالية'));
    } else {
        prompt('انسخ الرابط:', url);
    }
}

// --- إضافة للتقويم: ينشئ ملف ICS ويحمّله ---
function addToCalendar(id) {
    const ev = eventsData.find(x => x.id === id);
    if (!ev) return;
    const start = new Date(ev.date);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // افتراض مدة ساعتين
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
        `SUMMARY:${ev.title}`,
        `DESCRIPTION:${ev.fullDesc}`,
        `LOCATION:${ev.location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${ev.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// --- نموذج الاتصال في contact.html ---
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
            showInlineAlert(alertBox, 'يرجى ملء الحقول المطلوبة.', 'danger');
            return;
        }
        // تحقق بسيط من البريد
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showInlineAlert(alertBox, 'صيغة البريد غير صحيحة.', 'danger');
            return;
        }

        // عرض رسالة نجاح (في الواقع يمكنك إرسال البيانات لخادم أو استخدام خدمة)
        showInlineAlert(alertBox, 'تم إرسال الرسالة بنجاح. شكرًا لتواصلك معنا.', 'success');
        form.reset();
    });
}

function showInlineAlert(container, text, type = 'success') {
    container.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
}
