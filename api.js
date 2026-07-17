/* ==========================================
   Mushaf Sanad
   api.js
   Quran Pages API
========================================== */


const QURAN_API =
"https://api.quran.com/api/v4";



/* الصفحة الحالية */

let currentVerses = [];



/* ===============================
   جلب صفحة من المصحف
================================ */


async function getPage(pageNumber){


    try{


        const response = await fetch(

        `${QURAN_API}/quran/verses/uthmani?`+
        `page_number=${pageNumber}`

        );



        const data =
        await response.json();



        return data.verses;



    }catch(error){


        console.error(
            "Page loading error",
            error
        );


        return [];


    }


}



/* ===============================
   تحميل الصفحة وعرضها
================================ */


async function loadPage(pageNumber){


    const verses =
    await getPage(pageNumber);



    currentVerses=verses;



    renderQuranPage(
        verses
    );


}



/* ===============================
   رسم الصفحة
================================ */


function renderQuranPage(verses){


    const box =
    document.getElementById(
        "quran-page-text"
    );


    if(!box)return;



    box.innerHTML="";



    let lastSurah=0;



    verses.forEach(
        verse=>{


        /*
        إذا بدأت سورة جديدة
        */


        if(
        verse.chapter_id !== lastSurah
        ){


            lastSurah=
            verse.chapter_id;



            createSurahTitle(
                verse
            );


        }



        const span =
        document.createElement(
            "span"
        );



        span.className="ayah";



        span.innerHTML=

        verse.text_uthmani +

        `

        <span class="ayah-number">

        ﴿${toArabicNumber(
            verse.verse_number
        )}﴾

        </span>

        `;



        span.onclick=()=>{

            openTafsir(
                verse
            );

        };



        box.appendChild(span);


        box.appendChild(
            document.createTextNode(" ")
        );



    });


}



/* ===============================
   عنوان السورة
================================ */


function createSurahTitle(verse){


    const title =
    document.createElement(
        "div"
    );


    title.id=
    "surah-title-box";



    title.innerHTML=

    `

    <div class="ornament"></div>


    <h2>

    ${verse.chapter_name}

    </h2>


    <div class="ornament"></div>


    `;



    const box =
    document.getElementById(
        "quran-page-text"
    );


    box.appendChild(
        title
    );



}



/* ===============================
   التفسير
================================ */


async function openTafsir(verse){


    const overlay =
    document.getElementById(
        "overlay"
    );


    const sheet =
    document.getElementById(
        "tafsir-sheet"
    );


    const title =
    document.getElementById(
        "tafsir-title"
    );


    const body =
    document.getElementById(
        "tafsir-body"
    );



    title.innerHTML=

    "الآية "+
    toArabicNumber(
        verse.verse_number
    );



    body.innerHTML=
    "جاري تحميل التفسير...";



    overlay.style.display="block";

    sheet.style.bottom="0";



    try{


        const response =
        await fetch(

        `${QURAN_API}/tafsirs/169/by_ayah/${verse.verse_key}`

        );



        const data =
        await response.json();



        body.innerHTML=
        data.tafsir.text;



    }catch{


        body.innerHTML=
        "تعذر تحميل التفسير";


    }


}



/* ===============================
   إغلاق التفسير
================================ */


function closeTafsir(){


    const sheet =
    document.getElementById(
        "tafsir-sheet"
    );


    const overlay =
    document.getElementById(
        "overlay"
    );



    sheet.style.bottom="-100%";


    overlay.style.display="none";


}



/* ===============================
   تحويل الأرقام
================================ */


function toArabicNumber(number){


    return String(number)
    .replace(/[0-9]/g,

    d=>"٠١٢٣٤٥٦٧٨٩"[d]

    );


}



/* ===============================
   حفظ آخر قراءة
================================ */


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
