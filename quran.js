// quran.js

// قائمة القراء المحدثة
const reciters = [
    { name: "إسلام صبحي", server: "https://server14.mp3quran.net/islam/" },
    { name: "مشاري العفاسي", server: "https://server8.mp3quran.net/afs/" },
    { name: "ماهر المعيقلي", server: "https://server12.mp3quran.net/maher/" },
    { name: "عبدالرحمن السديس", server: "https://server11.mp3quran.net/sds/" },
    { name: "سعود الشريم", server: "https://server7.mp3quran.net/shur/" },
    { name: "عبدالباسط عبدالصمد (مجود)", server: "https://server7.mp3quran.net/basit/" },
    { name: "محمود خليل الحصري", server: "https://server13.mp3quran.net/husr/" },
    { name: "محمد صديق المنشاوي", server: "https://server10.mp3quran.net/minsh/" },
    { name: "ياسر الدوسري", server: "https://server11.mp3quran.net/yasser/" }
];

// الحصول على رقم السورة من الرابط
const urlParams = new URLSearchParams(window.location.search);
const surahId = urlParams.get('surah');

// عناصر HTML
const surahNameElement = document.getElementById('surah-name');
const quranTextElement = document.getElementById('quran-text');
const audioPlayer = document.getElementById('audio-player');
const reciterSelect = document.getElementById('reciter-select');
const headerTitle = document.getElementById('header-title');

// 1. ملء قائمة القراء
reciters.forEach((reciter, index) => {
    const option = document.createElement('option');
    option.value = reciter.server;
    option.textContent = reciter.name;
    reciterSelect.appendChild(option);
});

// 2. دالة لجلب نص السورة
async function loadSurahText(id) {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
        const data = await response.json();
        
        if (data.code === 200) {
            const surah = data.data;
            surahNameElement.textContent = `سورة ${surah.name}`;
            if (headerTitle) headerTitle.textContent = surah.name;
            document.title = `سورة ${surah.name}`;

            let fullText = '';
            
            // إضافة البسملة (إلا في سورة التوبة رقم 9)
            if (id != 9) {
                 fullText += `<div class="basmala" style="text-align:center; font-weight:bold; margin-bottom:20px;">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>`;
            }

            surah.ayahs.forEach(ayah => {
                let text = ayah.text;
                if (id != 1 && id != 9 && ayah.numberInSurah === 1) {
                     text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ', '');
                }
                fullText += `${text} <span class="ayah-number" style="color:#2c7a7b; font-weight:bold;">(${ayah.numberInSurah})</span> `;
            });

            quranTextElement.innerHTML = fullText;
        }
    } catch (error) {
        quranTextElement.innerHTML = 'حدث خطأ في تحميل النص، تأكد من الاتصال بالإنترنت.';
        console.error(error);
    }
}

// 3. دالة لتشغيل الصوت
function playSurah(serverUrl) {
    if (!surahId) return;
    const paddedId = String(surahId).padStart(3, '0');
    const audioUrl = `${serverUrl}${paddedId}.mp3`;
    
    audioPlayer.src = audioUrl;
}

// عند تغيير القارئ
reciterSelect.addEventListener('change', (e) => {
    playSurah(e.target.value);
    audioPlayer.play();
});

// التنفيذ عند تحميل الصفحة
if (surahId) {
    loadSurahText(surahId);
    // تشغيل إسلام صبحي افتراضياً لأنه الأول في القائمة
    playSurah(reciters[0].server);
} else {
    window.location.href = 'index.html';
}
