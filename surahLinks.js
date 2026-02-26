document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('surah-container');
    const searchInput = document.getElementById('search-input');
    let allSurahs = [];

    // دالة لتنظيف النص العربي للبحث (إزالة التشكيل والهمزات)
    function normalizeArabic(text) {
        if (!text) return "";
        return text.toString()
            .replace(/[\u064B-\u065F\u0670]/g, "") // إزالة التشكيل
            .replace(/[أإآ]/g, "ا")
            .replace(/ة/g, "ه")
            .replace(/ى/g, "ي");
    }

    // جلب السور من API
    async function fetchSurahs() {
        try {
            const response = await fetch('https://api.alquran.cloud/v1/surah');
            const data = await response.json();
            if (data.code === 200) {
                allSurahs = data.data;
                displaySurahs(allSurahs);
            }
        } catch (error) {
            container.innerHTML = '<p style="text-align:center; width:100%;">تأكد من اتصالك بالإنترنت</p>';
            console.error('Error:', error);
        }
    }

    // عرض السور في الصفحة
        function displaySurahs(surahs) {
        container.innerHTML = '';
        surahs.forEach(surah => {
            const card = document.createElement('a');
            card.className = 'surah-card';
            card.href = `quran.html?surah=${surah.number}`; 
            
            const typeAr = surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية';

            // تعديل هنا: حذفنا كلمة "سورة" اليدوية لأنها تأتي جاهزة من البيانات
            // واستخدمنا surah.name مباشرة
            card.innerHTML = `
                <div class="card-info">
                    <span class="surah-name">${surah.name}</span>
                    <div class="surah-details">
                        ${typeAr} • ${surah.numberOfAyahs} آية
                    </div>
                </div>
                <div class="surah-number">${surah.number}</div>
            `;
            container.appendChild(card);
        });
    }

    // تفعيل البحث
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

    // التحقق من "آخر قراءة"
    const lastId = localStorage.getItem('lastReadId');
    const lastName = localStorage.getItem('lastReadName');
    const continueBox = document.getElementById('continue-reading');
    
    if (lastId && lastName && continueBox) {
        continueBox.style.display = 'block';
        document.getElementById('last-surah-link').href = `quran.html?surah=${lastId}`;
        document.getElementById('last-surah-name').textContent = lastName;
    }

    // بدء التحميل
    fetchSurahs();
    
    // تسجيل Service Worker (لجعل التطبيق يعمل كتطبيق هاتف)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(console.error);
    }
});
