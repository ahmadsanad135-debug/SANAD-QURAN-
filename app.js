/* ==========================================
   Mushaf Sanad
   app.js
========================================== */

let currentPage = 1;
let isLoading = false;

const pageElement = document.getElementById("quran-page");

/*==============================
تحميل صفحة
==============================*/

async function goToPage(page){

    if(isLoading) return;

    if(page < 1 || page > 604) return;

    isLoading = true;

    pageElement.classList.add("page-fade");

    setTimeout(async()=>{

        currentPage = page;

        await openPage(page);

        pageElement.classList.remove("page-fade");

        isLoading = false;

    },200);

}

/*==============================
التالي
==============================*/

function next(){

    goToPage(currentPage + 1);

}

/*==============================
السابق
==============================*/

function previous(){

    goToPage(currentPage - 1);

}

/*==============================
السحب الأفقي
==============================*/

let touchStart = 0;

pageElement.addEventListener("touchstart",e=>{

    touchStart = e.touches[0].clientX;

});

pageElement.addEventListener("touchend",e=>{

    let touchEnd = e.changedTouches[0].clientX;

    let distance = touchStart - touchEnd;

    if(Math.abs(distance) < 60) return;

    if(distance > 0){

        next();

    }else{

        previous();

    }

});

/*==============================
لوحة المفاتيح
==============================*/

document.addEventListener("keydown",e=>{

    if(e.key==="ArrowLeft"){

        next();

    }

    if(e.key==="ArrowRight"){

        previous();

    }

});

/*==============================
أزرار التنقل
==============================*/

const nextBtn=document.getElementById("next-page");
const prevBtn=document.getElementById("prev-page");

if(nextBtn){

    nextBtn.onclick=next;

}

if(prevBtn){

    prevBtn.onclick=previous;

}

/*==============================
آخر صفحة
==============================*/

window.addEventListener("load",()=>{

    currentPage=getLastPage();

    goToPage(currentPage);

});

/*==============================
الانتقال إلى صفحة معينة
==============================*/

function jumpToPage(){

    let number=prompt("رقم الصفحة");

    if(!number) return;

    number=parseInt(number);

    if(number>=1 && number<=604){

        goToPage(number);

    }

}

/*==============================
تغيير الوضع الليلي
==============================*/

function toggleTheme(){

    const root=document.documentElement;

    const current=root.getAttribute("data-theme");

    if(current==="dark"){

        root.setAttribute("data-theme","light");

        localStorage.setItem("theme","light");

    }else{

        root.setAttribute("data-theme","dark");

        localStorage.setItem("theme","dark");

    }

}

const savedTheme=localStorage.getItem("theme");

if(savedTheme){

    document.documentElement.setAttribute("data-theme",savedTheme);

    }
