/* ==========================================
   Mushaf Sanad
   reciters.js
   Quran Reciters Database
========================================== */

const RECITERS = [

    {
        id: "afs",
        name: "مشاري راشد العفاسي",
        server: "https://server8.mp3quran.net/afs/"
    },

    {
        id: "sudais",
        name: "عبد الرحمن السديس",
        server: "https://server11.mp3quran.net/sds/"
    },

    {
        id: "shuraim",
        name: "سعود الشريم",
        server: "https://server7.mp3quran.net/shur/"
    },

    {
        id: "maher",
        name: "ماهر المعيقلي",
        server: "https://server12.mp3quran.net/maher/"
    },

    {
        id: "yasser",
        name: "ياسر الدوسري",
        server: "https://server11.mp3quran.net/yasser/"
    },

    {
        id: "ghamdi",
        name: "سعد الغامدي",
        server: "https://server7.mp3quran.net/s_gmd/"
    },

    {
        id: "ajmi",
        name: "أحمد العجمي",
        server: "https://server10.mp3quran.net/ajm/"
    },

    {
        id: "fares",
        name: "فارس عباد",
        server: "https://server8.mp3quran.net/frs_a/"
    },

    {
        id: "khalil",
        name: "خالد الجليل",
        server: "https://server10.mp3quran.net/jleel/"
    },

    {
        id: "qatami",
        name: "ناصر القطامي",
        server: "https://server6.mp3quran.net/qtm/"
    },

    {
        id: "islam",
        name: "إسلام صبحي",
        server: "https://server14.mp3quran.net/islam/"
    },

    {
        id: "minshawi",
        name: "محمد صديق المنشاوي (مجود)",
        server: "https://server10.mp3quran.net/minsh/"
    },

    {
        id: "hussary",
        name: "محمود خليل الحصري (مجود)",
        server: "https://server13.mp3quran.net/husr/"
    },

    {
        id: "abdulbasit",
        name: "عبدالباسط عبدالصمد (مجود)",
        server: "https://server7.mp3quran.net/basit/"
    },

    {
        id: "hazza",
        name: "هزاع البلوشي",
        server: "https://server11.mp3quran.net/hazza/"
    },

    {
        id: "nafais",
        name: "أحمد النفيس",
        server: "https://server16.mp3quran.net/nufais/"
    },

    {
        id: "basfar",
        name: "عبدالله بصفر",
        server: "https://server13.mp3quran.net/basfar/"
    },

    {
        id: "zahrani",
        name: "عبدالعزيز الزهراني",
        server: "https://server12.mp3quran.net/zahrani/"
    },

    {
        id: "bokhater",
        name: "صلاح بو خاطر",
        server: "https://server11.mp3quran.net/bu_khtr/"
    },

    {
        id: "kalbani",
        name: "عادل الكلباني",
        server: "https://server8.mp3quran.net/klbani/"
    }

];


// جلب القارئ المحفوظ
function getSavedReciter(){

    return localStorage.getItem("reciter")
    || RECITERS[0].id;

}


// حفظ القارئ
function saveReciter(id){

    localStorage.setItem(
        "reciter",
        id
    );

      }
