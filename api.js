/* ==========================================
   Mushaf Sanad
   api.js
   Quran Pages Engine
========================================== */


const QURAN_API = "https://api.quran.com/api/v4";


let currentVerses = [];



/* ==========================================
   جلب آيات صفحة من المصحف
========================================== */

async function getPage(pageNumber){

    try{

        const response = await fetch(
            `${QURAN_API}/quran/verses/uthmani?page_number=${pageNumber}`
        );


        const data = await response.json();


        return data.verses || [];


    }catch(error){

        console.error(
            "Quran page error:",
            error
        );

        return [];

    }

}




/* ==========================================
   معلومات الصفحة
========================================== */

function getMushafPageInfo(page){

    const info = MUSHAF_PAGES[page];


    if(!info){

        return {

            juz:1,

            hizb:1,

            surahs:[]

        };

    }


    return info;

}




/* ==========================================
   تحميل الصفحة كاملة
========================================== */

async function loadPage(page){

    const verses = await getPage(page);


    currentVerses = verses;


    updatePageInfo(page);


    renderQuranPage(verses);

}




/* ==========================================
   تحديث معلومات الهيدر
========================================== */

function updatePageInfo(page){


const info =
getMushafData(page);



const surah =
document.getElementById(
"surah-name"
);



const juz =
document.getElementById(
"juz-info"
);



const hizb =
document.getElementById(
"hizb-info"
);



if(surah){

surah.textContent =
info.surah;

}



if(juz){

juz.textContent =
"الجزء "
+
toArabicNumber(info.juz);

}



if(hizb){

hizb.textContent =
"الحزب "
+
info.hizb;

}


}


    const info = getMushafPageInfo(page);


    const juz =
        document.getElementById("juz-info");


    const hizb =
        document.getElementById("hizb-info");



    if(juz){

        juz.textContent =
        "الجزء " + toArabicNumber(info.juz);

    }



    if(hizb){

        hizb.textContent =
        "الحزب " + toArabicNumber(info.hizb);

    }

}





/* ==========================================
   رسم الآيات
========================================== */


function renderQuranPage(verses){


    const box =
    document.getElementById(
        "quran-page-text"
    );


    if(!box) return;



    box.innerHTML="";



    let lastChapter = null;



    verses.forEach(verse=>{


        // بداية سورة جديدة

        if(
            verse.chapter_id !== lastChapter
        ){

            lastChapter =
            verse.chapter_id;



            createSurahTitle(
                verse.chapter_id
            );


        }




        const span =
        document.createElement(
            "span"
        );



        span.className =
        "ayah";



        span.innerHTML =
        `
        ${verse.text_uthmani}
        <span class="ayah-number">
        ﴿${toArabicNumber(
            verse.verse_number
        )}﴾
        </span>
        `;



        span.onclick=()=>{

            openTafsir(verse);

        };



        box.appendChild(span);


        box.appendChild(
            document.createTextNode(" ")
        );


    });


}







/* ==========================================
   عنوان السورة
========================================== */


function createSurahTitle(id){


    const box =
    document.getElementById(
        "quran-page-text"
    );


    const title =
    document.createElement("div");


    title.id =
    "surah-title-box";



    title.innerHTML =
    `

    <div class="ornament"></div>

    <h2 id="surah-title">

    سورة ${toArabicNumber(id)}

    </h2>

    <div class="ornament"></div>

    `;



    box.appendChild(title);


}






/* ==========================================
   تحويل الأرقام
========================================== */


function toArabicNumber(number){

    return String(number)
    .replace(
        /[0-9]/g,
        d=>"٠١٢٣٤٥٦٧٨٩"[d]
    );

}




/* ==========================================
   آخر قراءة
========================================== */


function saveLastPage(page){

    localStorage.setItem(
        "lastPage",
        page
    );

}



function getLastPage(){

    return parseInt(
        localStorage.getItem(
            "lastPage"
        )
    ) || 1;

} 
