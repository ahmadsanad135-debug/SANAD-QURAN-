/* ==========================================
   Mushaf Sanad
   Chapters Data
========================================== */

let chapters = [];


async function loadChapters(){

    try{

        const response = await fetch(
            "https://api.quran.com/api/v4/chapters?language=ar"
        );


        const data = await response.json();


        chapters = data.chapters;


    }catch(error){

        console.error(
            "Chapters loading error",
            error
        );

    }

}



function getChapterName(id){

    const chapter = chapters.find(
        item => item.id === id
    );


    if(chapter){

        return chapter.name_arabic;

    }


    return "سورة";

}
