/* ==========================================
   Mushaf Sanad
   reader.js
   Quran Reader Engine
========================================== */


/* ===============================
   إعدادات القارئ
================================ */

const Reader = {

    currentPage: 1,
    totalPages: 604,
    loading: false,



    /* ===============================
       تشغيل القارئ
    ================================ */

    init(){

        const saved =
            getReadingPosition();

        if(saved && saved.page){

            this.currentPage =
                saved.page;

        }


        this.openPage(
            this.currentPage
        );

    },



    /* ===============================
       فتح صفحة
    ================================ */

    async openPage(page){


        if(
            page < 1 ||
            page > this.totalPages
        ){
            return;
        }


        if(this.loading){
            return;
        }


        this.loading = true;



        const container =
            document.getElementById(
                "quran-page-text"
            );


        if(container){

            container.style.opacity = "0";

        }



        try{


            const verses =
                await getPage(page);



            currentVerses =
                verses;



            renderQuranPage(
                verses
            );



            this.currentPage =
                page;



            saveReadingPosition({

                page:page,
                ayah:null

            });



            this.updateHeader();



            await delay(200);



            if(container){

                container.style.opacity="1";

            }



        }catch(error){

            console.error(
                "Reader error",
                error
            );

        }



        this.loading=false;

    },




    /* ===============================
       الصفحة التالية
    ================================ */

    next(){

        if(
            this.currentPage <
            this.totalPages
        ){

            this.openPage(
                this.currentPage + 1
            );

        }

    },




    /* ===============================
       الصفحة السابقة
    ================================ */

    previous(){


        if(
            this.currentPage > 1
        ){

            this.openPage(
                this.currentPage - 1
            );

        }

    },




    /* ===============================
       تحديث المعلومات
    ================================ */

    updateHeader(){


        const page =
            document.getElementById(
                "page-number"
            );


        const footer =
            document.getElementById(
                "footer-page-number"
            );



        if(page){

            page.textContent =
            "الصفحة " +
            toArabicNumber(
                this.currentPage
            );

        }



        if(footer){

            footer.textContent =
            toArabicNumber(
                this.currentPage
            );

        }


    },




    /* ===============================
       تغيير الصفحة بالسحب
    ================================ */

    swipe(){


        const reader =
            document.getElementById(
                "reader"
            );


        if(!reader)return;



        let startX=0;



        reader.addEventListener(
            "touchstart",
            e=>{

                startX =
                e.touches[0].clientX;

            }
        );



        reader.addEventListener(
            "touchend",
            e=>{


                let endX =
                e.changedTouches[0]
                .clientX;



                let distance =
                startX-endX;



                if(
                    Math.abs(distance)<80
                ){
                    return;
                }



                if(distance>0){

                    this.next();

                }else{

                    this.previous();

                }


            }
        );


    }


};





/* ===============================
   تشغيل بعد تحميل الصفحة
================================ */

document.addEventListener(
"DOMContentLoaded",
()=>{

    Reader.init();

    Reader.swipe();

});
