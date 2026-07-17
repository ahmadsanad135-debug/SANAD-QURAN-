/* ==========================================
   Mushaf Sanad
   Quran Pages Database
========================================== */


const MUSHAF_PAGES = {

    totalPages: 604,


    // الصفحة الأولى
    1: {

        juz: 1,

        hizb: 1,

        surahs: [
            "الفاتحة",
            "البقرة"
        ]

    },


    // الصفحة الثانية
    2: {

        juz: 1,

        hizb: 1,

        surahs:[
            "البقرة"
        ]

    },


    // الصفحة الثالثة
    3: {

        juz:1,

        hizb:1,

        surahs:[
            "البقرة"
        ]

    }


};


/*
الحصول على معلومات الصفحة
*/

function getPageInfo(page){

    return MUSHAF_PAGES[page] || {

        juz:0,

        hizb:0,

        surahs:[]

    };

}
