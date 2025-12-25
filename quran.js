// quran.js

const reciters = [
    { name: "إسلام صبحي", server: "https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/" },
    { name: "مشاري العفاسي", server: "https://server8.mp3quran.net/afs/" },
    { name: "ماهر المعيقلي", server: "https://server12.mp3quran.net/maher/" },
    { name: "عبدالرحمن السديس", server: "https://server11.mp3quran.net/sds/" },
    { name: "سعود الشريم", server: "https://server7.mp3quran.net/shur/" },
    { name: "عبدالباسط عبدالصمد (مجود)", server: "https://server7.mp3quran.net/basit/" },
    { name: "محمود خليل الحصري", server: "https://server13.mp3quran.net/husr/" },
    { name: "محمد صديق المنشاوي", server: "https://server10.mp3quran.net/minsh/" },
    { name: "ياسر الدوسري", server: "https://server11.mp3quran.net/yasser/" }
];

const urlParams = new URLSearchParams(window.location.search);
const surahId = urlParams.get('surah');

const surahNameElement = document.getElementById('surah-name');
const quranTextElement = document.getElementById('quran-text');
const audioPlayer = document.getElementById('audio-player');
const reciterSelect = document.getElementById('reciter-select');

// 1. ملء قائمة القراء
reciters.forEach((reciter, index) => {
    const option = document.createElement('option');
    option.value = reciter.server;
    option.textContent = reciter.name;
    reciterSelect.appendChild(option);
});

// 2. دالة جلب النص
async function loadSurahText(id) {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
        const data = await response.json();
        if (data.code === 200) {
            const surah = data.data;
            surahNameElement.textContent = `سورة ${surah.name}`;
            let fullText = '';
            if (id != 9) fullText += `<div style="text-align:center; font-weight:bold; margin-bottom:20px;">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>`;
            surah.ayahs.forEach(ayah => {
                let text = ayah.text;
                if (id != 1 && id != 9 && ayah.numberInSurah === 1) text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ', '');
                fullText += `${text} <span style="color:#2c7a7b;">(${ayah.numberInSurah})</span> `;
            });
            quranTextElement.innerHTML = fullText;
        }
    } catch (e) { quranTextElement.innerHTML = 'خطأ في تحميل النص'; }
}

// 3. دالة تشغيل الصوت مع فحص التوفر
function playSurah(serverUrl) {
    const paddedId = String(surahId).padStart(3, '0');
    const audioUrl = `${serverUrl}${paddedId}.mp3`;
    audioPlayer.src = audioUrl;

    // فحص إذا كان الملف موجوداً (خاصة لإسلام صبحي)
    audioPlayer.onerror = function() {
        if (reciterSelect.options[reciterSelect.selectedIndex].text === "إسلام صبحي") {
            alert("عذراً، هذه السورة غير متوفرة حالياً بصوت القارئ إسلام صبحي. جرب قارئاً آخر.");
        }
    };
}

reciterSelect.addEventListener('change', (e) => {
    playSurah(e.target.value);
    audioPlayer.play();
});

if (surahId) {
    loadSurahText(surahId);
    playSurah(reciters[0].server);
} else {
    window.location.href = 'index.html';
}
 
