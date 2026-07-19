/* ==========================================
   Mushaf Sanad
   utils.js
   أدوات عامة للتطبيق
========================================== */


/* ===============================
   تحويل الأرقام إلى عربية
================================ */

function toArabicNumber(number) {

    if (number === undefined || number === null) {
        return "";
    }

    return String(number).replace(/[0-9]/g, function (d) {
        return "٠١٢٣٤٥٦٧٨٩"[d];
    });

}


/* ===============================
   Local Storage
================================ */

const Storage = {

    set(key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    },


    get(key, defaultValue = null) {

        const value = localStorage.getItem(key);

        if (!value) {
            return defaultValue;
        }

        try {

            return JSON.parse(value);

        } catch {

            return value;

        }

    },


    remove(key) {

        localStorage.removeItem(key);

    }

};



/* ===============================
   عناصر الصفحة
================================ */

function $(selector) {

    return document.querySelector(selector);

}


function $$(selector) {

    return document.querySelectorAll(selector);

}



/* ===============================
   تأخير التنفيذ
================================ */

function delay(time) {

    return new Promise(resolve => {

        setTimeout(resolve, time);

    });

}



/* ===============================
   حركة ظهور
================================ */

async function fade(element, type = "in") {

    if (!element) return;


    if (type === "out") {

        element.style.opacity = "0";

        await delay(250);

    } else {

        element.style.opacity = "1";

    }

}



/* ===============================
   مشاركة
================================ */

async function shareText(text) {

    if (navigator.share) {

        try {

            await navigator.share({
                text: text
            });

        } catch(e){}

    } else {

        navigator.clipboard.writeText(text);

        alert("تم النسخ");

    }

}



/* ===============================
   نسخ النص
================================ */

function copyText(text) {

    navigator.clipboard.writeText(text);

}



/* ===============================
   فحص الاتصال
================================ */

function isOnline(){

    return navigator.onLine;

}



/* ===============================
   إنشاء عنصر
================================ */

function createElement(tag, className=""){

    const el =
        document.createElement(tag);


    if(className){

        el.className = className;

    }


    return el;

}



/* ===============================
   حفظ الصفحة الأخيرة
================================ */

function saveReadingPosition(data){

    Storage.set(
        "reading_position",
        data
    );

}



function getReadingPosition(){

    return Storage.get(
        "reading_position",
        {
            page:1,
            ayah:null
        }
    );

}



/* ===============================
   الوضع الليلي
================================ */

function saveTheme(theme){

    Storage.set(
        "theme",
        theme
    );

}


function getTheme(){

    return Storage.get(
        "theme",
        "light"
    );

}
