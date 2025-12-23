const reciters = [
    { name: "إسلام صبحي", server: "https://server14.mp3quran.net/islam/" },
    { name: "مشاري العفاسي", server: "https://server8.mp3quran.net/afs/" },
    { name: "ماهر المعيقلي", server: "https://server12.mp3quran.net/maher/" },
    { name: "عبدالرحمن السديس", server: "https://server11.mp3quran.net/sds/" },
    { name: "عبدالباسط عبدالصمد", server: "https://server7.mp3quran.net/basit/" },
    { name: "ياسر الدوسري", server: "https://server11.mp3quran.net/yasser/" }
];

// الحصول على العناصر من الصفحة
const reciterSelect = document.getElementById('reciterSelect');
const audioPlayer = document.getElementById('audioPlayer');
const surahTitle = document.getElementById('surahTitle');

// الحصول على رقم السورة من الرابط
const urlParams = new URLSearchParams(window.location.search);
const surahId = urlParams.get('id');

// التأكد من وجود العناصر قبل البدء لتجنب التعليق
if (reciterSelect && audioPlayer) {
    // تعبئة قائمة القراء
    reciters.forEach((reciter, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = reciter.name;
        reciterSelect.appendChild(option);
    });

    // وظيفة تشغيل السورة
    function playSurah() {
        if (!surahId) return;
        
        const selectedReciter = reciters[reciterSelect.value];
        // تحويل الرقم لصيغة 001
        const formattedId = surahId.padStart(3, '0');
        const audioUrl = `${selectedReciter.server}${formattedId}.mp3`;
        
        audioPlayer.src = audioUrl;
        audioPlayer.load(); // تحميل الملف الصوتي الجديد
        audioPlayer.play().catch(e => console.log("الرجاء الضغط على تشغيل"));
    }

    // تغيير القارئ
    reciterSelect.addEventListener('change', playSurah);

    // التشغيل عند فتح الصفحة
    if (surahId) {
        playSurah();
    }
}
 
