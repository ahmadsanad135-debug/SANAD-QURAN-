/* اسم الملف: surahLinks.js */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('surah-container');
    const searchInput = document.getElementById('search-input');
    const installBtn = document.getElementById('install-btn');
    let allSurahs = [];

    // 1. دالة احترافية لتنظيف النص العربي (لجعل البحث مرناً جداً)
    function normalizeArabic(text) {
        if (!text) return "";
        return text.toString()
            // إزالة التشكيل بالكامل
            .replace(/[\u064B-\u065F\u0670]/g, "") 
            // توحيد الألفات (أ إ آ) لتصبح (ا)
            .replace(/[أإآ]/g, "ا")
            // توحيد الهاء والتاء المربوطة (ة) لتصبح (ه)
            .replace(/ة/g, "ه")
            // توحيد الياء والألف المقصورة (ى) لتصبح (ي)
            .replace(/ى/g, "ي")
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

    // 4. البحث الذكي (يتجاهل أخطاء الإملاء والحركات)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = normalizeArabic(e.target.value.toLowerCase());
            
            const filtered = allSurahs.filter(s => {
                const cleanName = normalizeArabic(s.name);
                const englishName = s.englishName.toLowerCase();
                const surahNumber = s.number.toString();
                
                return cleanName.includes(term) || 
                       englishName.includes(term) || 
                       surahNumber === term;
            });
            displaySurahs(filtered);
        });
    }

    // 5. ميزة استكمال القراءة (تظهر رقم الآية بجانب اسم السورة)
    const lastId = localStorage.getItem('lastReadId');
    const lastName = localStorage.getItem('lastReadName');
    const lastAyah = localStorage.getItem('lastReadAyah'); // رقم الآية الذي حفظناه في quran.html
    const continueBox = document.getElementById('continue-reading');
    
    if (lastId && lastName && continueBox) {
        continueBox.style.display = 'block';
        document.getElementById('last-surah-link').href = `quran.html?surah=${lastId}`;
        
        // عرض اسم السورة مع رقم الآية إذا وجد
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
 
