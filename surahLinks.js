document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('surah-container');
    const searchInput = document.getElementById('search-input');
    let allSurahs = [];

    function normalizeArabic(text) {
        if (!text) return "";
        return text.toString().replace(/[\u064B-\u065F\u0670]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
    }

    async function fetchSurahs() {
        try {
            const response = await fetch('https://api.alquran.cloud/v1/surah');
            const data = await response.json();
            if (data.code === 200) {
                allSurahs = data.data;
                // هذه الإضافة تسمح لصفحة quran.html بالوصول للبيانات
                window.allSurahsData = allSurahs; 
                displaySurahs(allSurahs);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displaySurahs(surahs) {
        if (!container) return; // لضمان عدم حدوث خطأ في صفحة quran.html
        container.innerHTML = '';
        surahs.forEach(surah => {
            const card = document.createElement('a');
            card.className = 'surah-card';
            card.href = `quran.html?surah=${surah.number}`; 
            const typeAr = surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية';

            card.innerHTML = `
                <div class="surah-number">${surah.number}</div>
                <span class="surah-name">${surah.name}</span>
                <div class="surah-info">
                    ${surah.englishName} <br>
                    <span style="font-size: 0.85em; color: #777;">${typeAr} - آياتها ${surah.numberOfAyahs}</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

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
    fetchSurahs();
});
