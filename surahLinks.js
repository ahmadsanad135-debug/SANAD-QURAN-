// surahLinks.js - النسخة المعتمدة والمصححة

// 1. قائمة أسماء السور (ثابتة لضمان السرعة والعمل بدون إنترنت)
const surahNames = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
    "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
    "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
    "المسد", "الإخلاص", "الفلق", "الناس"
];

// 2. تجهيز البيانات بشكل كامل (الاسم + الرقم + رابط الصوت)
// نستخدم هنا سيرفر mp3quran لأنه سريع وموثوق (القارئ مشاري العفاسي كمثال)
const audioBaseURL = "https://server8.mp3quran.net/afs/";

const surahData = surahNames.map((name, index) => {
    const id = index + 1;
    // إضافة أصفار للرقم ليناسب رابط السيرفر (001, 002, 010...)
    const paddedId = id.toString().padStart(3, '0'); 
    
    return {
        id: id,
        name: name,
        // رابط الصوت المباشر
        audio: `${audioBaseURL}${paddedId}.mp3`,
        // عدد الآيات تقريبي أو يمكن جلبه (اختياري للسرعة وضعنا نوع افتراضي)
        type: "مكية/مدنية" 
    };
});


// 3. كود التعامل مع صفحة الفهرس (index.html)
document.addEventListener('DOMContentLoaded', () => {
    
    // هل نحن في صفحة الفهرس؟ (نتحقق من وجود عنصر البحث)
    const container = document.getElementById('surah-container');
    const searchInput = document.getElementById('search-input');

    if (container && searchInput) {
        
        // دالة عرض السور
        function displaySurahs(list) {
            container.innerHTML = ''; 
            list.forEach(surah => {
                const card = document.createElement('a');
                card.className = 'surah-card';
                card.href = `quran.html?surah=${surah.id}`;
                
                card.innerHTML = `
                    <div class="surah-number">${surah.id}</div>
                    <span class="surah-name">${surah.name}</span>
                `;
                container.appendChild(card);
            });
        }

        // عرض الكل عند البدء
        displaySurahs(surahData);

        // تفعيل البحث
        searchInput.addEventListener('input', (e) => {
            const term = normalizeArabic(e.target.value.toLowerCase());
            
            const filtered = surahData.filter(surah => {
                return normalizeArabic(surah.name).includes(term) || 
                       surah.id.toString() === term;
            });
            displaySurahs(filtered);
        });
    }
});

// --- دالة مساعدة لتنظيف النص العربي للبحث ---
function normalizeArabic(text) {
    if (!text) return "";
    text = text.toString();
    text = text.replace(/[\u064B-\u065F\u0670]/g, ""); // تشكيل
    text = text.replace(/[أإآ]/g, "ا");
    text = text.replace(/ة/g, "ه");
    text = text.replace(/ى/g, "ي");
    return text;
}
 
