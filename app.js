/* ==========================================
   Mushaf Sanad
   app.js
========================================== */


let currentPage = 1;
let isAnimating = false;


/* ===============================
   تشغيل التطبيق
================================ */


document.addEventListener("DOMContentLoaded",()=>{

    currentPage = getLastPage();

    openPage(currentPage);

    setupSwipe();

    setupButtons();

});



/* ===============================
   فتح صفحة
================================ */


async function openPage(page){


    if(page < 1 || page > 604) return;


    if(isAnimating) return;


    isAnimating=true;


    const container=document.getElementById("quran-page-text");


    if(container){

        container.style.opacity="0";

    }



    setTimeout(async()=>{


        await loadPage(page);


        currentPage=page;


        saveLastPage(page);



        const number=document.getElementById(
            "page-number"
        );


        if(number){

            number.textContent=
            "الصفحة "+toArabicNumber(page);

        }



        if(container){

            container.style.opacity="1";

        }


        isAnimating=false;



    },200);



}



/* ===============================
   الصفحة التالية
================================ */


function nextPage(){


    if(currentPage<604){

        openPage(currentPage+1);

    }

}



/* ===============================
   الصفحة السابقة
================================ */


function previousPage(){


    if(currentPage>1){

        openPage(currentPage-1);

    }

}



/* ===============================
   السحب الأفقي
================================ */


function setupSwipe(){


    let startX=0;


    const reader=document.getElementById(
        "reader"
    );


    if(!reader)return;



    reader.addEventListener(
        "touchstart",
        e=>{

            startX=e.touches[0].clientX;

        }
    );



    reader.addEventListener(
        "touchend",
        e=>{


            let endX=e.changedTouches[0].clientX;


            let distance=startX-endX;



            if(Math.abs(distance)<70)
                return;



            /*
             السحب لليسار = الصفحة التالية
            */

            if(distance>0){

                nextPage();

            }


            /*
             السحب لليمين = الصفحة السابقة
            */

            else{

                previousPage();

            }



        }
    );


}



/* ===============================
   الأزرار
================================ */


function setupButtons(){


    const nextBtn=
    document.getElementById(
        "next-page"
    );


    const prevBtn=
    document.getElementById(
        "prev-page"
    );


    if(nextBtn){

        nextBtn.onclick=nextPage;

    }


    if(prevBtn){

        prevBtn.onclick=previousPage;

    }



    const theme=
    document.getElementById(
        "themeButton"
    );


    if(theme){

        theme.onclick=toggleTheme;

    }


}



/* ===============================
   الوضع الليلي
================================ */


function toggleTheme(){


    const html=
    document.documentElement;


    let theme=
    html.getAttribute(
        "data-theme"
    );



    if(theme==="dark"){


        html.setAttribute(
            "data-theme",
            "light"
        );


        localStorage.setItem(
            "theme",
            "light"
        );


    }else{


        html.setAttribute(
            "data-theme",
            "dark"
        );


        localStorage.setItem(
            "theme",
            "dark"
        );


    }

}




/* ===============================
   تغيير حجم الخط
================================ */


let fontSize=
parseInt(
localStorage.getItem("fontSize")
)||28;



function changeFont(value){


    fontSize+=value;


    if(fontSize<20)
        fontSize=20;


    if(fontSize>45)
        fontSize=45;



    document.documentElement.style
    .setProperty(
        "--quran-size",
        fontSize+"px"
    );



    localStorage.setItem(
        "fontSize",
        fontSize
    );


}



/* ===============================
   حفظ الصفحة
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



/* ===============================
   تحويل الأرقام
================================ */


function toArabicNumber(number){


    return String(number)
    .replace(/[0-9]/g,

    d=>"٠١٢٣٤٥٦٧٨٩"[d]

    );


}
