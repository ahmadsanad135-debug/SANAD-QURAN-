const reciters = [
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
const surahId = urlParams.get('id');

const reciterSelect = document.getElementById('reciterSelect');
const audioPlayer = document.getElementById('audioPlayer');

// تعبئة قائمة القراء
reciters.forEach((reciter, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = reciter.name;
    reciterSelect.appendChild(option);
});

// وظيفة تشغيل السورة
function playSurah() {
    const selectedReciter = reciters[reciterSelect.value];
    const formattedId = surahId.padStart(3, '0');
    const audioUrl = `${selectedReciter.server}${formattedId}.mp3`;
    
    audioPlayer.src = audioUrl;
    audioPlayer.play();
}

// تغيير القارئ عند الاختيار
reciterSelect.addEventListener('change', playSurah);

// التشغيل التلقائي
if (surahId) {
    playSurah();
}
