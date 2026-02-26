/* اسم الملف: surahLinks.js */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('surah-container');
    const searchInput = document.getElementById('search-input');
    const installBtn = document.getElementById('install-btn');
    let allSurahs = [];

    // 1. تنظيف النص العربي للبحث
    function normalizeArabic(text) {
        if (!text) return "";
        return text.toString()
            .replace(/[\u064B-\u065F\u0670]/g, "") 
            .replace(/[أإآ]/g, "ا")
            .replace(/ة/g, "ه")
            .replace(/ى/g, "ي");
    }

    // 2. جلب قائمة السور
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

    // 3. عرض السور
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

    // 4. البحث الذكي
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = normalizeArabic(e.target.value.toLowerCase());
            const filtered = allSurahs.filter(s => 
                normalizeArabic(s.name).includes(term) || 
                s.englishName.toLowerCase().includes(term) || 
                s.number.toString() === term
            );
            displaySurahs(filtered);
        });
    }

    // 5. استعادة آخر قراءة (تم التعديل لإظهار رقم الآية)
    const lastId = localStorage.getItem('lastReadId');
    const lastName = localStorage.getItem('lastReadName');
    const lastAyah = localStorage.getItem('lastReadAyah'); // جلب رقم الآية المخزن
    const continueBox = document.getElementById('continue-reading');
    
    if (lastId && lastName && continueBox) {
        continueBox.style.display = 'block';
        document.getElementById('last-surah-link').href = `quran.html?surah=${lastId}`;
        
        // إذا كان هناك رقم آية محفوظ، يظهره بجانب اسم السورة
        if (lastAyah) {
            document.getElementById('last-surah-name').textContent = `${lastName} - آية (${lastAyah})`;
        } else {
            document.getElementById('last-surah-name').textContent = lastName;
        }
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

    // 7. تشغيل الخدمة
    fetchSurahs();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(console.error);
    }
});
 
