/* اسم الملف: surahLinks.js */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('surah-container');
    const searchInput = document.getElementById('search-input');
    const installBtn = document.getElementById('install-btn');
    let allSurahs = [];

    // 1. دالة خارقة لتنظيف النص العربي من أي تشكيل أو حركات خفية تماماً
    function normalizeArabic(text) {
        if (!text) return "";
        return text.toString()
            // تفكيك الحروف المركبة وتطير علامات التشكيل الدقيقة للقرآن
            .normalize("NFD")
            // إزالة كافة حركات التشكيل والتطريز والرموز الخاصة بالمصحف
            .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "") 
            // توحيد الألفات
            .replace(/[أإآ]/g, "ا")
            // توحيد التاء المربوطة
            .replace(/ة/g, "ه")
            // توحيد الألف المقصورة والياء
            .replace(/ى/g, "ي")
            // إزالة كلمة "سورة" من المقارنة تماماً لجعل البحث أسهل (لو بحثت عن "الكهف" مباشرة)
            .replace(/سوره/g, "")
            .replace(/سورة/g, "")
            // إزالة الـ ال التعريف اختصاراً لزيادة مرونة البحث (إذا كتب "كهف" يجد "الكهف")
            .replace(/^ال/g, "") 
            .replace(/\s+/g, "") // إزالة الفراغات لضمان التطابق اللصيق
            .trim();
    }

    // 2. جلب قائمة السور من الـ API
    async function fetchSurahs() {
        try {
            const response = await fetch('https://api.alquran.cloud/v1/surah');
            const data = await response.json();
            if (data.code === 200) {
                allSurahs = data.data;
                displaySurahs(allSurahs);
            }
        } catch (error) {
            container.innerHTML = '<p style="text-align:center; width:100%;">يوجد خطأ في الاتصال بالإنترنت...</p>';
        }
    }

    // 3. عرض السور في الفهرس
    function displaySurahs(surahs) {
        container.innerHTML = '';
        surahs.forEach(surah => {
            const card = document.createElement('a');
            card.className = 'surah-card';
            card.href = `quran.html?surah=${surah.number}`; 
            
            // تخزين البيانات الأصلية للبحث بداخل الكرت
            card.setAttribute('data-english', surah.englishName.toLowerCase());
            card.setAttribute('data-number', surah.number.toString());

            const typeAr = surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية';

            card.innerHTML = `
                <div class="surah-number">${surah.number}</div>
                <div class="card-info">
                    <span class="surah-name">${surah.name}</span>
                    <div class="surah-details">
                        ${typeAr} • ${surah.numberOfAyahs} آية
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // 4. دالة البحث المحدثة والمرنة جداً
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = normalizeArabic(e.target.value.toLowerCase());
            const cards = document.querySelectorAll('.surah-card');
            
            cards.forEach(card => {
                const surahNameElement = card.querySelector('.surah-name');
                const surahName = surahNameElement ? surahNameElement.textContent : "";
                
                const cleanName = normalizeArabic(surahName);
                const englishName = card.getAttribute('data-english') || "";
                const surahNumber = card.getAttribute('data-number') || "";
                
                // فحص التطابق الشامل
                if (cleanName.includes(term) || englishName.includes(term) || surahNumber === term) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 5. ميزة استكمال القراءة
    const lastId = localStorage.getItem('lastReadId');
    const lastName = localStorage.getItem('lastReadName');
    const lastAyah = localStorage.getItem('lastReadAyah');
    const continueBox = document.getElementById('continue-reading');
    
    if (lastId && lastName && continueBox) {
        continueBox.style.display = 'block';
        document.getElementById('last-surah-link').href = `quran.html?surah=${lastId}`;
        
        const displayText = lastAyah ? `${lastName} - آية (${lastAyah})` : lastName;
        document.getElementById('last-surah-name').textContent = displayText;
    }

    // 6. كود تثبيت التطبيق (PWA)
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if(installBtn) installBtn.style.display = 'block';
    });

    if(installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') installBtn.style.display = 'none';
                deferredPrompt = null;
            }
        });
    }

    // 7. تشغيل الخدمات
    fetchSurahs();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(console.error);
    }
});
 
