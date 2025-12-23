const reciters = [
    { name: "إسلام صبحي", server: "https://server14.mp3quran.net/islam/" },
    { name: "مشاري العفاسي", server: "https://server8.mp3quran.net/afs/" },
    { name: "ماهر المعيقلي", server: "https://server12.mp3quran.net/maher/" },
    { name: "أحمد العجمي", server: "https://server10.mp3quran.net/ajm/" },
    { name: "سعد الغامدي", server: "https://server7.mp3quran.net/s_gmd/" },
    { name: "عبدالرحمن السديس", server: "https://server11.mp3quran.net/sds/" },
    { name: "فارس عباد", server: "https://server8.mp3quran.net/frs_a/" },
    { name: "ياسر الدوسري", server: "https://server11.mp3quran.net/yasser/" },
    { name: "ناصر القطامي", server: "https://server6.mp3quran.net/qtm/" },
    { name: "هزاع البلوشي", server: "https://server11.mp3quran.net/haza/" }
];

document.addEventListener('DOMContentLoaded', () => {
    const reciterSelect = document.getElementById('reciterSelect');
    const audioPlayer = document.getElementById('audioPlayer');
    const loadingMessage = document.getElementById('loadingMessage'); 
    
    const urlParams = new URLSearchParams(window.location.search);
    const surahId = urlParams.get('id');

    if (reciterSelect && surahId) {
        // 1. إخفاء رسالة التحميل فوراً لمنع التعليق
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }

        // 2. تعبئة القائمة بالأسماء
        reciters.forEach((reciter, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = reciter.name;
            reciterSelect.appendChild(option);
        });

        // 3. وظيفة التشغيل
        const playAudio = () => {
            const selectedReciter = reciters[reciterSelect.value];
            const formattedId = surahId.padStart(3, '0');
            audioPlayer.src = `${selectedReciter.server}${formattedId}.mp3`;
            audioPlayer.load();
            audioPlayer.play().catch(() => console.log("تحتاج لضغط تشغيل"));
        };

        reciterSelect.addEventListener('change', playAudio);
        playAudio();
    }
});
 
