/* ==========================================
   Mushaf Sanad
   api.js
   Quran.com API
========================================== */

const API = {

    BASE: "https://api.quran.com/api/v4",

    async getPage(pageNumber){

        try{

            const response = await fetch(
                `${this.BASE}/quran/verses/uthmani?page_number=${pageNumber}`
            );

            if(!response.ok){
                throw new Error("Network Error");
            }

            const data = await response.json();

            return data.verses;

        }catch(error){

            console.error(error);

            return [];

        }

    },

    async getChapter(chapterId){

        try{

            const response = await fetch(
                `${this.BASE}/chapters/${chapterId}`
            );

            const data = await response.json();

            return data.chapter;

        }catch(error){

            console.error(error);

            return null;

        }

    },

    async getTafsir(verseKey){

        try{

            const response = await fetch(

                `${this.BASE}/tafsirs/169/by_ayah/${verseKey}`

            );

            const data = await response.json();

            return data.tafsir.text;

        }catch(error){

            return "";

        }

    }

};


/* ==========================================
   تحويل الأرقام
========================================== */

function toArabicNumber(number){

    return String(number).replace(/[0-9]/g,function(d){

        return "٠١٢٣٤٥٦٧٨٩"[d];

    });

}


/* ==========================================
   حفظ آخر صفحة
========================================== */

function saveLastPage(page){

    localStorage.setItem(

        "lastPage",

        page

    );

}


/* ==========================================
   قراءة آخر صفحة
========================================== */

function getLastPage(){

    const page = localStorage.getItem(

        "lastPage"

    );

    if(page){

        return parseInt(page);

    }

    return 1;

}


/* ==========================================
   حفظ العلامة المرجعية
========================================== */

function saveBookmark(page,verseKey){

    localStorage.setItem(

        "bookmark",

        JSON.stringify({

            page,

            verseKey

        })

    );

}


/* ==========================================
   قراءة العلامة المرجعية
========================================== */

function getBookmark(){

    const bookmark = localStorage.getItem(

        "bookmark"

    );

    if(bookmark){

        return JSON.parse(bookmark);

    }

    return null;

}
/* ==========================================
   تحميل بيانات الصفحة كاملة
========================================== */

async function loadPage(pageNumber){

    saveLastPage(pageNumber);

    currentPage = pageNumber;

    const pageInfo = document.getElementById("page-number");

    if(pageInfo){

        pageInfo.textContent = "الصفحة " + toArabicNumber(pageNumber);

    }

    const verses = await API.getPage(pageNumber);

    renderPage(verses);

}


/* ==========================================
   التخزين المؤقت للصفحات
========================================== */

const pageCache = {};

async function getCachedPage(pageNumber){

    if(pageCache[pageNumber]){

        return pageCache[pageNumber];

    }

    const verses = await API.getPage(pageNumber);

    pageCache[pageNumber] = verses;

    return verses;

}


/* ==========================================
   تحميل الصفحة مع الكاش
========================================== */

async function loadCachedPage(pageNumber){

    saveLastPage(pageNumber);

    currentPage = pageNumber;

    const pageInfo = document.getElementById("page-number");

    if(pageInfo){

        pageInfo.textContent =
            "الصفحة " + toArabicNumber(pageNumber);

    }

    const verses = await getCachedPage(pageNumber);

    renderPage(verses);

}


/* ==========================================
   الصفحة التالية
========================================== */

async function nextPage(){

    if(currentPage>=604){

        return;

    }

    await loadCachedPage(currentPage+1);

}


/* ==========================================
   الصفحة السابقة
========================================== */

async function previousPage(){

    if(currentPage<=1){

        return;

    }

    await loadCachedPage(currentPage-1);

}


/* ==========================================
   التحميل المسبق للصفحات
========================================== */

async function preloadPages(){

    if(currentPage<604){

        getCachedPage(currentPage+1);

    }

    if(currentPage>1){

        getCachedPage(currentPage-1);

    }

}


/* ==========================================
   تحميل الصفحة مع التحميل المسبق
========================================== */

async function openPage(pageNumber){

    await loadCachedPage(pageNumber);

    preloadPages();

}


/* ==========================================
   الانتقال لآخر صفحة
========================================== */

function resumeReading(){

    const page=getLastPage();

    openPage(page);

}
/* ==========================================
   معلومات بداية ونهاية السور
========================================== */

let currentPage = 1;
let currentVerses = [];

function renderPage(verses){

    currentVerses = verses;

    const container = document.getElementById("quran-page");

    if(!container) return;

    container.innerHTML = "";

    let currentChapter = 0;

    verses.forEach((verse,index)=>{

        /* بداية سورة جديدة */

        if(verse.chapter_id !== currentChapter){

            currentChapter = verse.chapter_id;

            const surahTitle=document.createElement("div");

            surahTitle.className="surah-header";

            surahTitle.innerHTML=`

                <div class="surah-decoration"></div>

                <h2>${verse.chapter_name_arabic}</h2>

                <div class="surah-decoration"></div>

            `;

            container.appendChild(surahTitle);

            /* البسملة */

            if(currentChapter!==1 && currentChapter!==9){

                const basmala=document.createElement("div");

                basmala.className="basmala";

                basmala.innerHTML=
                "﷽";

                container.appendChild(basmala);

            }

        }

        const span=document.createElement("span");

        span.className="ayah";

        span.dataset.key=verse.verse_key;

        span.innerHTML=`

            ${verse.text_uthmani}

            <span class="ayah-number">

            ﴿${toArabicNumber(verse.verse_number)}﴾

            </span>

        `;

        span.onclick=()=>{

            openTafsir(verse);

        };

        container.appendChild(span);

        container.append(" ");

    });

}


/* ==========================================
   فتح التفسير
========================================== */

async function openTafsir(verse){

    const body=document.getElementById("tafsir-body");

    const title=document.getElementById("tafsir-title");

    title.innerHTML=

        "الآية " +

        toArabicNumber(

            verse.verse_number

        );

    body.innerHTML="جار التحميل...";

    document.getElementById("overlay").style.display="block";

    document.getElementById("tafsir-sheet").style.bottom="0";

    const tafsir=

        await API.getTafsir(

            verse.verse_key

        );

    body.innerHTML=tafsir;

}


/* ==========================================
   إغلاق التفسير
========================================== */

function closeTafsir(){

    document.getElementById("tafsir-sheet").style.bottom="-100%";

    document.getElementById("overlay").style.display="none";

}


/* ==========================================
   الانتقال بالإيماءات
========================================== */

let startX=0;

document.addEventListener("touchstart",(e)=>{

    startX=e.touches[0].clientX;

});

document.addEventListener("touchend",(e)=>{

    let endX=e.changedTouches[0].clientX;

    let diff=startX-endX;

    if(Math.abs(diff)<60){

        return;

    }

    if(diff>0){

        nextPage();

    }else{

        previousPage();

    }

});


/* ==========================================
   أزرار الكيبورد
========================================== */

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowLeft"){

        nextPage();

    }

    if(e.key==="ArrowRight"){

        previousPage();

    }

});


/* ==========================================
   تشغيل التطبيق
========================================== */

window.addEventListener("load",()=>{

    resumeReading();

});
