// surahLinks.js

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('surah-container');
    const searchInput = document.getElementById('search-input');
    let allSurahs = []; // مخزن لبيانات السور للبحث لاحقاً

    // --- دالة مساعدة لتنظيف النص العربي (إزالة التشكيل وتوحيد الأحرف) ---
    function normalizeArabic(text) {
        if (!text) return "";
        text = text.toString();
        
        // 1. إزالة التشكيل (الفتحة، الضمة، الكسرة، الشدة...الخ)
        text = text.replace(/[\u064B-\u065F\u0670]/g, "");
        
        // 2. توحيد أشكال الألف (أ، إ، آ -> ا)
        text = text.replace(/[أإآ]/g, "ا");
        
        // 3. توحيد التاء المربوطة والهاء (ة -> هـ)
        text = text.replace(/ة/g, "ه");
        
        // 4. توحيد الياء (ى -> ي)
        text = text.replace(/ى/g, "ي");

        return text;
    }
    // -----------------------------------------------------------

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

    // 3. تفعيل خاصية البحث الذكي (تم التعديل هنا)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // النص الذي يكتبه المستخدم (يتم تنظيفه)
            const rawSearchTerm = e.target.value.toLowerCase();
            const normalizedSearchTerm = normalizeArabic(rawSearchTerm);
            
            // تصفية السور
            const filtered = allSurahs.filter(surah => {
                // تنظيف اسم السورة القادم من قاعدة البيانات قبل المقارنة
                const normalizedSurahName = normalizeArabic(surah.name);

                return (
                    normalizedSurahName.includes(normalizedSearchTerm) || // بحث بالاسم العربي النظيف
                    surah.englishName.toLowerCase().includes(rawSearchTerm) || // بحث بالاسم الإنجليزي
                    surah.number.toString() === rawSearchTerm // بحث برقم السورة
                );
            });

            displaySurahs(filtered);
        });
    }

    // تشغيل الدالة عند فتح الصفحة
    fetchSurahs();
});
