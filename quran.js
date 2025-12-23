// قائمة القراء المحدثة
const reciters = [
    { name: "إسلام صبحي", server: "https://server14.mp3quran.net/islam/" },
    { name: "مشاري العفاسي", server: "https://server8.mp3quran.net/afs/" },
    { name: "ماهر المعيقلي", server: "https://server12.mp3quran.net/maher/" },
    { name: "أحمد العجمي", server: "https://server10.mp3quran.net/ajm/" },
    { name: "سعد الغامدي", server: "https://server7.mp3quran.net/s_gmd/" },
    { name: "سعود الشريم", server: "https://server7.mp3quran.net/shur/" },
    { name: "عبدالرحمن السديس", server: "https://server11.mp3quran.net/sds/" },
    { name: "فارس عباد", server: "https://server8.mp3quran.net/frs_a/" },
    { name: "ياسر الدوسري", server: "https://server11.mp3quran.net/yasser/" },
    { name: "ناصر القطامي", server: "https://server6.mp3quran.net/qtm/" },
    { name: "هزاع البلوشي", server: "https://server11.mp3quran.net/haza/" },
    { name: "عبدالباسط عبدالصمد (مرتل)", server: "https://server7.mp3quran.net/basit_mtl/" },
    { name: "محمد صديق المنشاوي", server: "https://server10.mp3quran.net/minsh/" },
    { name: "محمود خليل الحصري", server: "https://server13.mp3quran.net/husr/" },
    { name: "إدريس أبكر", server: "https://server6.mp3quran.net/abkr/" }
];

// التأكد من تحميل الصفحة بالكامل قبل تشغيل الكود
document.addEventListener('DOMContentLoaded', () => {
    const reciterSelect = document.getElementById('reciterSelect');
    const audioPlayer = document.getElementById('audioPlayer');
    const loadingMessage = document.getElementById('loadingMessage'); // عنصر "جاري التحميل"
    
    const urlParams = new URLSearchParams(window.location.search);
    const surahId = urlParams.get('id');

    // إذا وجدنا القائمة المنسدلة ورقم السورة
    if (reciterSelect && surahId) {
        
        // إخفاء رسالة "جاري تحميل الآيات" لأننا في صفحة الاستماع
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }

        // تعبئة القائمة بأسماء الشيوخ
        reciters.forEach((reciter, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = reciter.name;
            reciterSelect.appendChild(option);
        });

        // وظيفة تشغيل الصوت
        const playAudio = () => {
            const selectedReciter = reciters[reciterSelect.value];
            const formattedId = surahId.padStart(3, '0');
            const audioUrl = `${selectedReciter.server}${formattedId}.mp3`;
            
            audioPlayer.src = audioUrl;
            audioPlayer.load();
            audioPlayer.play().catch(e => console.log("في انتظار ضغط المستخدم للتشغيل"));
        };

        // عند تغيير القارئ من القائمة
        reciterSelect.addEventListener('change', playAudio);

        // تشغيل السورة فور دخول الصفحة بصوت أول قارئ (إسلام صبحي)
        playAudio();
    }
});
