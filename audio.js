/* ==========================================
   Mushaf Sanad
   audio.js
   Quran Audio Engine
========================================== */


const QuranAudio = {

    player: null,

    currentAyah: 0,

    currentSurah: 1,

    reciter: null,


    init(){

        this.player =
        document.getElementById(
            "audio-player"
        );


        this.reciter =
        getSavedReciter();


        this.loadReciters();


        this.events();

    },



    /* ===============================
       قائمة القراء
    ================================ */

    loadReciters(){

        const select =
        document.getElementById(
            "reciter-select"
        );


        if(!select) return;


        select.innerHTML = "";


        RECITERS.forEach(reciter=>{


            const option =
            document.createElement(
                "option"
            );


            option.value =
            reciter.id;


            option.textContent =
            reciter.name;


            if(
                reciter.id === this.reciter
            ){

                option.selected = true;

            }


            select.appendChild(
                option
            );


        });


        select.onchange = ()=>{


            this.reciter =
            select.value;


            saveReciter(
                this.reciter
            );


        };


    },



    /* ===============================
       تشغيل سورة
    ================================ */


    playSurah(surah){


        this.currentSurah =
        surah;


        this.currentAyah = 1;


        this.playAyah(
            surah,
            1
        );


    },




    /* ===============================
       تشغيل آية
    ================================ */

    playAyah(surah,ayah){


        const reciter =
        RECITERS.find(
            r=>r.id===this.reciter
        );


        if(!reciter)return;



        const number =
        String(surah).padStart(3,"0")
        +
        String(ayah).padStart(3,"0");



        const url =
        reciter.server
        +
        number
        +
        ".mp3";



        this.player.src =
        url;


        this.player.play();



    },





    /* ===============================
       أحداث المشغل
    ================================ */

    events(){


        if(!this.player)return;



        this.player.onended =
        ()=>{


            this.currentAyah++;


            this.playAyah(
                this.currentSurah,
                this.currentAyah
            );


        };


    }



};





document.addEventListener(
"DOMContentLoaded",
()=>{

    QuranAudio.init();

});
