/* ==========================================
   Mushaf Sanad
   app.js
   Main Controller
========================================== */


/* ===============================
   تشغيل التطبيق
================================ */

document.addEventListener(
"DOMContentLoaded",
()=>{


    setupTheme();


    setupButtons();


});




/* ===============================
   الأزرار
================================ */

function setupButtons(){


    const next =
    document.querySelector(
        ".next-page"
    );


    const previous =
    document.querySelector(
        ".previous-page"
    );



    if(next){

        next.onclick =
        ()=>Reader.next();

    }



    if(previous){

        previous.onclick =
        ()=>Reader.previous();

    }



    const themeButton =
    document.getElementById(
        "themeButton"
    );


    if(themeButton){

        themeButton.onclick =
        toggleTheme;

    }


}




/* ===============================
   الوضع الليلي
================================ */

function setupTheme(){


    const theme =
    getTheme();



    document.documentElement
    .setAttribute(
        "data-theme",
        theme
    );



    updateThemeIcon(
        theme
    );

}




function toggleTheme(){


    const current =
    document.documentElement
    .getAttribute(
        "data-theme"
    );



    const newTheme =
    current === "dark"
    ?
    "light"
    :
    "dark";



    document.documentElement
    .setAttribute(
        "data-theme",
        newTheme
    );



    saveTheme(
        newTheme
    );



    updateThemeIcon(
        newTheme
    );


}




function updateThemeIcon(theme){


    const button =
    document.getElementById(
        "themeButton"
    );


    if(!button)return;



    button.innerHTML =
    theme==="dark"
    ?
    '<i class="fas fa-sun"></i>'
    :
    '<i class="fas fa-moon"></i>';

}




/* ===============================
   تغيير حجم الخط
================================ */

let fontSize =
Storage.get(
    "font_size",
    28
);



function changeFont(value){


    fontSize += value;



    if(fontSize < 20){

        fontSize=20;

    }



    if(fontSize > 45){

        fontSize=45;

    }



    document.documentElement
    .style
    .setProperty(
        "--quran-size",
        fontSize+"px"
    );



    Storage.set(
        "font_size",
        fontSize
    );


}




/* ===============================
   الذهاب لصفحة
================================ */

function jumpToPage(){


    const page =
    prompt(
    "أدخل رقم الصفحة من 1 إلى 604"
    );



    const number =
    parseInt(page);



    if(
        !isNaN(number) &&
        number>=1 &&
        number<=604
    ){

        Reader.openPage(
            number
        );

    }

       }
