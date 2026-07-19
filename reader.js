/* ==========================================
   Mushaf Sanad
   reader.js
   Quran Page Reader Engine
========================================== */


const Reader = {


    currentPage:
    parseInt(
        localStorage.getItem("lastPage")
    ) || 1,



    loading:false,



    /* ===============================
       تشغيل القارئ
    ================================ */

    async init(){


        await this.openPage(
            this.currentPage
        );


    },





    /* ===============================
       فتح صفحة
    ================================ */

    async openPage(page){


        if(
            page < 1 ||
            page > 604 ||
            this.loading
        ){

            return;

        }



        this.loading=true;



        const box =
        document.getElementById(
            "quran-page-text"
        );



        if(box){

            box.style.opacity="0.3";

        }





        const verses =
        await getPage(page);




        if(
            verses.length
        ){


            renderQuranPage(
                verses
            );



            this.currentPage =
            page;



            localStorage.setItem(
                "lastPage",
                page
            );



            this.updateHeader(
                page,
                verses
            );



            preloadPage(
                page+1
            );


        }




        if(box){

            box.style.opacity="1";

        }



        this.loading=false;


    },






    /* ===============================
       الصفحة التالية
    ================================ */

    next(){


        this.openPage(
            this.currentPage + 1
        );


    },





    /* ===============================
       الصفحة السابقة
    ================================ */

    previous(){


        this.openPage(
            this.currentPage - 1
        );


    },






    /* ===============================
       تحديث البيانات
    ================================ */

    updateHeader(page,verses){


        const pageNumber =
        document.getElementById(
            "page-number"
        );



        const footer =
        document.getElementById(
            "footer-page-number"
        );



        const surah =
        document.getElementById(
            "surah-name"
        );




        if(pageNumber){

            pageNumber.textContent =
            "الصفحة " +
            toArabicNumber(page);

        }



        if(footer){

            footer.textContent =
            toArabicNumber(page);

        }



        if(surah){

            surah.textContent =
            getSurahName(
                verses[0].chapter_id
            );

        }


    }


};


/* ===============================
   Swipe Page Navigation
================================ */

let touchStartX = 0;
let touchEndX = 0;


function setupReaderSwipe(){


    const reader =
    document.getElementById("reader");


    if(!reader) return;



    reader.addEventListener(
        "touchstart",
        (e)=>{


            touchStartX =
            e.changedTouches[0].screenX;


        },
        {passive:true}
    );



    reader.addEventListener(
        "touchend",
        (e)=>{


            touchEndX =
            e.changedTouches[0].screenX;



            const distance =
            touchStartX - touchEndX;



            if(Math.abs(distance)<80)
            return;



            // السحب لليسار = الصفحة التالية
            if(distance > 0){

                Reader.next();

            }


            // السحب لليمين = الصفحة السابقة
            else{

                Reader.previous();

            }


        },
        {passive:true}
    );

       }

/* ===============================
   تشغيل تلقائي
================================ */


document.addEventListener(
"DOMContentLoaded",
()=>{


    Reader.init();


}); 
