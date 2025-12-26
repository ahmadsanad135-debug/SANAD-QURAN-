// قائمة القراء - يمكنك إضافة أي قارئ جديد هنا بنفس الصيغة
const reciters = [
    { name: "مشاري العفاسي", server: "https://server8.mp3quran.net/afs/" },
    { name: "ماهر المعيقلي", server: "https://server12.mp3quran.net/maher/" },
    { name: "إسلام صبحي", server: "https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/" },
    { name: "عبدالرحمن السديس", server: "https://server11.mp3quran.net/sds/" },
    { name: "سعود الشريم", server: "https://server7.mp3quran.net/shur/" },
    { name: "عبدالباسط عبدالصمد (مجود)", server: "https://server7.mp3quran.net/basit/" },
    { name: "محمود خليل الحصري", server: "https://server13.mp3quran.net/husr/" },
    { name: "محمد صديق المنشاوي", server: "https://server10.mp3quran.net/minsh/" },
    { name: "ياسر الدوسري", server: "https://server11.mp3quran.net/yasser/" },
    { name: "أحمد العجمي", server: "https://server10.mp3quran.net/ajm/" },
    { name: "فارس عباد", server: "https://server8.mp3quran.net/frs_a/" }
];

const urlParams = new URLSearchParams(window.location.search);
const surahId = urlParams.get('surah');
const reciterSelect = document.getElementById('reciter-select');
const quranTextElement = document.getElementById('quran-text');
const audioPlayer = document.getElementById('audio-player');

// ملء قائمة الاختيار بالقراء
reciters.forEach(r => {
    let opt = document.createElement('option');
    opt.value = r.server;
    opt.textContent = r.name;
    reciterSelect.appendChild(opt);
});

async function loadSurah() {
    try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}`);
        const data = await res.json();
        const surah = data.data;
        
        document.getElementById('surah-name').textContent = surah.name;
        document.getElementById('header-title').textContent = surah.name;
        
        // حفظ آخر سورة (الاسم والرقم) للاستكمال لاحقاً
        localStorage.setItem('lastReadId', surahId);
        localStorage.setItem('lastReadName', surah.name);

        let content = '';
        // إضافة البسملة لجميع السور عدا الفاتحة والتوبة
        if (surahId != 1 && surahId != 9) {
            content += '<div style="text-align:center; font-family:Amiri; font-size:2rem; margin-bottom:20px;">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>';
        }
        
        surah.ayahs.forEach(ayah => {
            let text = ayah.text;
            // إزالة البسملة المدمجة في الآية الأولى إذا لم تكن الفاتحة أو التوبة
            if (surahId != 1 && surahId != 9 && ayah.numberInSurah === 1) {
                text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ', '');
            }
            content += `${text} <span class="ayah-num" onclick="getTafsir(${surahId}, ${ayah.numberInSurah})">${ayah.numberInSurah}</span> `;
        });
        
        quranTextElement.innerHTML = content;
        playAudio(reciterSelect.value);
    } catch (e) { 
        quranTextElement.innerHTML = "خطأ في تحميل نص السورة. تأكد من اتصالك بالإنترنت."; 
    }
}

async function getTafsir(s, a) {
    const box = document.getElementById('tafsir-box');
    const txt = document.getElementById('tafsir-text');
    box.style.display = 'block';
    txt.textContent = "جاري جلب التفسير الميسر...";
    try {
        const res = await fetch(`https://api.alquran.cloud/v1/ayah/${s}:${a}/ar.jalalayn`);
        const data = await res.json();
        txt.textContent = data.data.text;
    } catch (e) { 
        txt.textContent = "عذراً، فشل تحميل التفسير."; 
    }
}

function playAudio(server) {
    // تنسيق رقم السورة ليكون من 3 خانات (مثلاً 001)
    const fileId = String(surahId).padStart(3, '0');
    audioPlayer.src = `${server}${fileId}.mp3`;
}

reciterSelect.onchange = (e) => {
    playAudio(e.target.value);
    audioPlayer.play();
};

if(surahId) {
    loadSurah();
} else {
    window.location.href = 'index.html';
}
