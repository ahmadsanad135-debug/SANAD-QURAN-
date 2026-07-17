/* اسم الملف: surahLinks.js */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('surah-container');
    const searchInput = document.getElementById('search-input');
    const installBtn = document.getElementById('install-btn');
    const scrollTopBtn = document.getElementById('scrollTop');
    let allSurahs = [];

    // 1. Theme Manager
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        window.toggleTheme = function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        };

        function updateThemeIcon(theme) {
            themeBtn.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        }
    }

    // 2. تنظيف النص العربي للبحث
    function normalizeArabic(text) {
        if (!text) return "";
        return text.toString()
            .normalize("NFD")
            .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "") 
            .replace(/[أإآ]/g, "ا")
            .replace(/ة/g, "ه")
            .replace(/ى/g, "ي")
            .replace(/سوره/g, "")
            .replace(/سورة/g, "")
            .replace(/^ال/g, "") 
            .replace(/\s+/g, "")
            .trim();
    }

    // 3. جلب قائمة السور
    async function fetchSurahs() {
        if(!container) return;
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

    // 4. عرض السور
    function displaySurahs(surahs) {
        container.innerHTML = '';
        surahs.forEach(surah => {
            const card = document.createElement('a');
            card.className = 'surah-card';
            // نقوم بالتحويل لصفحة القرآن
            card.href = `quran.html`; 
            
            card.setAttribute('data-english', surah.englishName.toLowerCase());
            card.setAttribute('data-number', surah.number.toString());

            const typeAr = surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية';
            const iconClass = surah.revelationType === 'Meccan' ? 'fa-kaaba' : 'fa-mosque';

            card.innerHTML = `
                <div class="surah-number-wrap">
                    <i class="fas ${iconClass} surah-number-icon"></i>
                    <span class="surah-number">${surah.number}</span>
                </div>
                <div class="card-info">
                    <span class="surah-name">${surah.name}</span>
                    <div class="surah-details">
                        <span><i class="fas fa-map-marker-alt"></i> ${typeAr}</span>
                        <span><i class="fas fa-list-ol"></i> ${surah.numberOfAyahs} آية</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // 5. البحث
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
                
                if (cleanName.includes(term) || englishName.includes(term) || surahNumber === term) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 6. استكمال القراءة
    const lastPageId = localStorage.getItem('lastPage');
    const continueBox = document.getElementById('continue-reading');
    
    if (lastPageId && continueBox) {
        continueBox.style.display = 'block';
        continueBox.href = `quran.html`;
        document.getElementById('last-surah-name').textContent = 'استكمال القراءة';
        document.getElementById('last-ayah-num').textContent = `توقفت عند الصفحة رقم: ${lastPageId}`;
    }

    // 7. زر العودة للأعلى
    if(scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });
    }

    // 8. PWA Install
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if(installBtn) installBtn.style.display = 'flex';
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

    // Start
    fetchSurahs();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(console.error);
    }
});
 
