/* ==========================================
   Mushaf Sanad
   api.js
   Quran Data API
========================================== */


const QURAN_API =
"https://api.quran.com/api/v4";


let currentVerses = [];



/* ===============================
   جلب آيات صفحة
================================ */

async function getPage(pageNumber){

    try{


        const response =
        await fetch(
        `${QURAN_API}/quran/verses/uthmani?page_number=${pageNumber}`
        );


        const data =
        await response.json();


        return data.verses || [];


    }catch(error){


        console.error(
            "Page loading error",
            error
        );


        return [];

    }

}




/* ===============================
   تحميل صفحة
================================ */

async function loadPage(pageNumber){


    const verses =
    await getPage(pageNumber);


    currentVerses =
    verses;



    renderQuranPage(
        verses
    );


    return verses;

}





/* ===============================
   رسم صفحة القرآن
================================ */

function renderQuranPage(verses){


    const box =
    document.getElementById(
        "quran-page-text"
    );


    if(!box)return;



    box.innerHTML="";



    let lastSurah=0;



    verses.forEach(verse=>{


        if(
            verse.chapter_id !== lastSurah
        ){


            lastSurah =
            verse.chapter_id;



            createSurahTitle(
                verse.chapter_id
            );



            if(
                verse.chapter_id !== 1 &&
                verse.chapter_id !== 9
            ){

                const basmala =
                document.createElement(
                    "div"
                );


                basmala.id =
                "basmala";


                basmala.textContent =
                "﷽";


                box.appendChild(
                    basmala
                );

            }


        }




        const span =
        document.createElement(
            "span"
        );


        span.className =
        "ayah";



        span.innerHTML =
        `${verse.text_uthmani}
        <span class="ayah-number">
        ﴿${toArabicNumber(verse.verse_number)}﴾
        </span>`;




        span.onclick =
        ()=>{

            openTafsir(
                verse
            );

        };



        box.appendChild(
            span
        );


        box.appendChild(
            document.createTextNode(" ")
        );



    });


}




/* ===============================
   عنوان السورة
================================ */

function createSurahTitle(id){


    const box =
    document.getElementById(
        "quran-page-text"
    );


    const title =
    document.createElement(
        "div"
    );


    title.id =
    "surah-title-box";



    title.innerHTML =
    `
    <div class="ornament"></div>

    <h2 id="surah-title">
    سورة ${getSurahName(id)}
    </h2>

    <div class="ornament"></div>
    `;



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



    if(!sheet)return;



    title.textContent =
    "الآية " +
    toArabicNumber(
        verse.verse_number
    );



    body.textContent =
    "جاري تحميل التفسير...";



    overlay.style.display =
    "block";



    sheet.style.bottom =
    "0";



    try{


        const response =
        await fetch(
        `${QURAN_API}/tafsirs/169/by_ayah/${verse.verse_key}`
        );


        const data =
        await response.json();



        body.innerHTML =
        data.tafsir.text;



    }catch(error){


        body.textContent =
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



    if(sheet){

        sheet.style.bottom =
        "-100%";

    }



    if(overlay){

        overlay.style.display =
        "none";

    }

}
/* ===============================
   معلومات الصفحة
================================ */

async function getPageInfo(page){

    try{

        const response =
        await fetch(
        `${QURAN_API}/quran/verses/uthmani?page_number=${page}`
        );


        const data =
        await response.json();


        const verses =
        data.verses || [];



        if(!verses.length){

            return null;

        }



        return {

            page:page,

            surah:
            verses[0].chapter_id,


            firstAyah:
            verses[0].verse_number,


            lastAyah:
            verses[verses.length-1].verse_number,


            verses:verses

        };



    }catch(e){

        console.error(e);

        return null;

    }

}



/* ===============================
   تحميل الصفحة القادمة مسبقا
================================ */

async function preloadPage(page){

    if(
        page < 1 ||
        page > 604
    ){

        return;

    }


    try{

        await getPage(page);

    }catch(e){}


}
