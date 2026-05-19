/* اسم الملف: surahLinks.js */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('surah-container');
    const searchInput = document.getElementById('search-input');
    const installBtn = document.getElementById('install-btn');
    let allSurahs = [];

    // 1. دالة احترافية لتنظيف النص العربي (لجعل البحث مرناً جداً ويتجاهل الهمزات والتشكيل)
    function normalizeArabic(text) {
        if (!text) return "";
        return text.toString()
            // تفكيك الحروف لإزالة أي تشكيل خفي
            .normalize("NFD")
            // إزالة التشكيل بالكامل (الفتحة، الضمة، الكسرة، التنوين، الشدة)
            .replace(/[\u064B-\u065F\u0670]/g, "") 
            // توحيد الألفات (أ إ آ) لتصبح (ا) عادية
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

    // 3. عرض السور في الفهرس لأول مرة
    function displaySurahs(surahs) {
        container.innerHTML = '';
        surahs.forEach(surah => {
            const card = document.createElement('a');
            card.className = 'surah-card';
            card.href = `quran.html?surah=${surah.number}`; 
            
            // تخزين الاسم الإنجليزي ورقم السورة كخصائص مخصصة (data attributes) لتسهيل البحث الشامل لاحقاً
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

    // 4. البحث الذكي الفوري (إخفاء وإظهار العناصر مباشرة للحفاظ على الأداء وسرعة الاستجابة)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = normalizeArabic(e.target.value.toLowerCase());
            const cards = document.querySelectorAll('.surah-card');
            
            cards.forEach(card => {
                const surahNameElement = card.querySelector('.surah-name');
                const surahName = surahNameElement ? surahNameElement.textContent : "";
                
                // تنظيف اسم السورة الحالي من الحركات والهمزات لتطبيقه مع المدخلات
                const cleanName = normalizeArabic(surahName);
                const englishName = card.getAttribute('data-english') || "";
                const surahNumber = card.getAttribute('data-number') || "";
                
                // التحقق من تطابق نص البحث مع (الاسم العربي، الإنجليزي، أو الرقم)
                if (cleanName.includes(term) || englishName.includes(term) || surahNumber === term) {
                    card.style.display = 'flex'; // إظهار البطاقة في حال التطابق
                } else {
                    card.style.display = 'none'; // إخفاء البطاقة في حال عدم التطابق
                }
            });
        });
    }

    // 5. ميزة استكمال القراءة (تظهر رقم الآية بجانب اسم السورة)
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
 
