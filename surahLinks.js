// surahLinks.js

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('surah-container');
    const searchInput = document.getElementById('search-input');
    let allSurahs = []; // مخزن لبيانات السور للبحث لاحقاً

    // 1. دالة لجلب قائمة السور من الـ API
    async function fetchSurahs() {
        try {
            // جلب البيانات من مصدر موثوق (Al Quran Cloud)
            const response = await fetch('https://api.alquran.cloud/v1/surah');
            const data = await response.json();

            if (data.code === 200) {
                allSurahs = data.data; // حفظ البيانات في المصفوفة
                displaySurahs(allSurahs); // عرض السور في الصفحة
            } else {
                container.innerHTML = '<p style="text-align:center; color:red;">عذراً، تعذر تحميل قائمة السور حالياً.</p>';
            }
        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = '<p style="text-align:center; color:red;">يرجى التأكد من اتصالك بالإنترنت.</p>';
        }
    }

    // 2. دالة بناء مربعات السور (Cards) وعرضها
    function displaySurahs(surahs) {
        container.innerHTML = ''; // مسح المحتوى القديم (مثل كلمة "جاري التحميل")

        if (surahs.length === 0) {
            container.innerHTML = '<p style="text-align:center;">لا توجد سورة بهذا الاسم.</p>';
            return;
        }

        surahs.forEach(surah => {
            // إنشاء عنصر الرابط لكل سورة
            const card = document.createElement('a');
            card.className = 'surah-card';
            
            // الربط مع صفحة القراءة والاستماع مع تمرير رقم السورة
            card.href = `quran.html?surah=${surah.number}`; 

            // تحديد نوع السورة بالعربي
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

    // 3. تفعيل خاصية البحث الذكي
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim().toLowerCase();
            
            // تصفية السور حسب الاسم العربي أو الإنجليزي أو الرقم
            const filtered = allSurahs.filter(surah => 
                surah.name.includes(searchTerm) || 
                surah.englishName.toLowerCase().includes(searchTerm) ||
                surah.number.toString() === searchTerm
            );

            displaySurahs(filtered);
        });
    }

    // تشغيل الدالة عند فتح الصفحة
    fetchSurahs();
});
 
