/* ==========================================
   Mushaf Sanad v2.0
   app.js
   Page Reader Engine
========================================== */


let currentPage = 1;

let isAnimating = false;



document.addEventListener(
"DOMContentLoaded",
()=>{


    currentPage =
    getLastPage();



    openPage(currentPage);



    setupButtons();


    setupSwipe();


});





/* ==========================================
   فتح صفحة
========================================== */


async function openPage(page){


    if(
        page < 1 ||
        page > 604 ||
        isAnimating
    )
    return;



    isAnimating = true;



    const container =
    document.getElementById(
        "quran-page-text"
    );



    if(container){

        container.style.opacity="0";

    }



    setTimeout(
    async()=>{


        await loadPage(page);



        currentPage =
        page;



        saveLastPage(page);



        updatePageNumber(page);



        preloadPages(page);



        if(container){

            container.style.opacity="1";

        }



        isAnimating=false;



    },250);



}





/* ==========================================
   رقم الصفحة
========================================== */


function updatePageNumber(page){


    const top =
    document.getElementById(
        "page-number"
    );


    const bottom =
    document.getElementById(
        "footer-page-number"
    );



    if(top){

        top.textContent =
        "الصفحة "
        +
        toArabicNumber(page);

    }



    if(bottom){

        bottom.textContent =
        toArabicNumber(page);

    }


}





/* ==========================================
   التالي والسابق
========================================== */


function nextPage(){


    if(currentPage < 604){

        openPage(
            currentPage+1
        );

    }

}



function previousPage(){


    if(currentPage > 1){

        openPage(
            currentPage-1
        );

    }

}





/* ==========================================
   السحب مثل تطبيقات المصحف
========================================== */


function setupSwipe(){


const reader =
document.getElementById(
"reader"
);



if(!reader)
return;



let startX=0;



reader.addEventListener(
"touchstart",
e=>{

    startX =
    e.touches[0].clientX;

});





reader.addEventListener(
"touchend",
e=>{


    let endX =
    e.changedTouches[0].clientX;



    let distance =
    startX-endX;



    if(
    Math.abs(distance)<80
    )
    return;




    // السحب لليسار

    if(distance>0){

        nextPage();

    }


    // السحب لليمين

    else{

        previousPage();

    }



});


}





/* ==========================================
   تحميل مسبق للصفحات
========================================== */


function preloadPages(page){


    const pages=[

        page+1,

        page-1

    ];



    pages.forEach(p=>{


        if(
        p>=1 &&
        p<=604
        ){

            getPage(p);

        }


    });


}





/* ==========================================
   الأزرار
========================================== */


function setupButtons(){


const theme =
document.getElementById(
"themeButton"
);



if(theme){


theme.onclick=()=>{


let mode =
document.documentElement
.getAttribute(
"data-theme"
);



if(mode==="dark"){


document.documentElement
.setAttribute(
"data-theme",
"light"
);


localStorage
.setItem(
"theme",
"light"
);



theme.innerHTML=
'<i class="fas fa-moon"></i>';



}

else{


document.documentElement
.setAttribute(
"data-theme",
"dark"
);



localStorage
.setItem(
"theme",
"dark"
);



theme.innerHTML=
'<i class="fas fa-sun"></i>';



}



};



}





let savedTheme =
localStorage.getItem(
"theme"
);



if(savedTheme){

document.documentElement
.setAttribute(
"data-theme",
savedTheme
);

}



}





/* ==========================================
   الذهاب لصفحة
========================================== */


function jumpToPage(){


let page =
prompt(
"رقم الصفحة من 1 إلى 604"
);



page=parseInt(page);



if(
page>=1 &&
page<=604
){

openPage(page);

}

}
