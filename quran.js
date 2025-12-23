const reciters = [
    { name: "إسلام صبحي", server: "https://server14.mp3quran.net/islam/" },
    { name: "مشاري العفاسي", server: "https://server8.mp3quran.net/afs/" },
    { name: "ماهر المعيقلي", server: "https://server12.mp3quran.net/maher/" },
    { name: "عبدالرحمن السديس", server: "https://server11.mp3quran.net/sds/" },
    { name: "عبدالباسط عبدالصمد", server: "https://server7.mp3quran.net/basit/" },
    { name: "ياسر الدوسري", server: "https://server11.mp3quran.net/yasser/" }
];

const urlParams = new URLSearchParams(window.location.search);
const surahId = urlParams.get('id');

const reciterSelect = document.getElementById('reciterSelect');
const audioPlayer = document.getElementById('audioPlayer');
const surahTitle = document.getElementById('surahTitle');

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
    // تحويل رقم السورة إلى صيغة 3 أرقام (مثلاً 1 يصبح 001)
    const formattedId = surahId.padStart(3, '0');
    const audioUrl = `${selectedReciter.server}${formattedId}.mp3`;
    
    audioPlayer.src = audioUrl;
    audioPlayer.play();
}

// تغيير القارئ عند الاختيار من القائمة
reciterSelect.addEventListener('change', playSurah);

// تشغيل السورة تلقائياً عند تحميل الصفحة
if (surahId) {
    playSurah();
}
 
