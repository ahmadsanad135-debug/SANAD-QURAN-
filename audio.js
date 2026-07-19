/* ==========================================
   Mushaf Sanad
   audio.js
   Quran Audio Controller
========================================== */


const QuranAudio = {


    player: null,

    currentSurah: 1,

    currentAyah: 1,

    reciterId: null,

    isPlaying: false,



    /* ===============================
       تشغيل النظام
    ================================ */

    init(){


        this.player =
        document.getElementById(
            "audio-player"
        );


        console.log(
            "Audio System Loaded"
        );


        if(!this.player){

            console.log(
                "Audio player not found"
            );

            return;

        }



        this.reciterId =
        getSavedReciter();



        this.createReciterList();



        this.setupEvents();


    },



    /* ===============================
       قائمة القراء
    ================================ */

    createReciterList(){


        const select =
        document.getElementById(
            "reciter-select"
        );


        if(!select)
        return;



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
                reciter.id === this.reciterId
            ){

                option.selected = true;

            }



            select.appendChild(
                option
            );


        });



        select.onchange = ()=>{


            this.reciterId =
            select.value;



            saveReciter(
                this.reciterId
            );


        };


    },



    /* ===============================
       رابط الصوت
    ================================ */

    getAudioUrl(
        surah,
        ayah
    ){


        const reciter =
        RECITERS.find(
            r =>
            r.id === this.reciterId
        );



        if(!reciter)
        return null;



        const file =

        String(surah)
        .padStart(3,"0")

        +

        String(ayah)
        .padStart(3,"0");



        return (

            reciter.server

            +

            file

            +

            ".mp3"

        );


    },



    /* ===============================
       تشغيل آية
    ================================ */

    playAyah(
        surah,
        ayah
    ){


        const url =
        this.getAudioUrl(
            surah,
            ayah
        );



        if(!url)
        return;



        this.currentSurah =
        surah;



        this.currentAyah =
        ayah;



        this.player.src =
        url;



        this.player.play();



        this.highlightAyah(
            surah,
            ayah
        );



        this.updatePlayerInfo();



        this.savePosition();


    },



    /* ===============================
       تشغيل / إيقاف
    ================================ */

    togglePlay(){


        if(!this.player)
        return;



        if(
            this.player.paused
        ){

            this.player.play();

        }

        else{

            this.player.pause();

        }


    },



    /* ===============================
       زر التشغيل
    ================================ */

    updatePlayButton(
        playing
    ){


        const button =
        document.getElementById(
            "playButton"
        );


        if(!button)
        return;



        button.innerHTML =

        playing

        ?

        '<i class="fas fa-pause"></i>'

        :

        '<i class="fas fa-play"></i>';



    },



    /* ===============================
       التالي
    ================================ */

    nextAyah(){


        this.currentAyah++;



        this.playAyah(

            this.currentSurah,

            this.currentAyah

        );


    },



    /* ===============================
       السابق
    ================================ */

    previousAyah(){


        if(
            this.currentAyah > 1
        ){


            this.currentAyah--;



            this.playAyah(

                this.currentSurah,

                this.currentAyah

            );


        }


    },



    /* ===============================
       تظليل الآية
    ================================ */

    highlightAyah(
        surah,
        ayah
    ){


        document
        .querySelectorAll(".ayah")
        .forEach(
            item=>{

                item.classList.remove(
                    "playing"
                );

            }
        );



        const element =

        document.querySelector(

        `.ayah[data-surah="${surah}"][data-ayah="${ayah}"]`

        );



        if(element){


            element.classList.add(
                "playing"
            );


        }


    },



    /* ===============================
       معلومات المشغل
    ================================ */

    updatePlayerInfo(){


        const reciter =
        RECITERS.find(
            r =>
            r.id === this.reciterId
        );



        const name =
        document.getElementById(
            "playing-reciter"
        );


        const status =
        document.getElementById(
            "playing-status"
        );



        if(name && reciter){

            name.textContent =
            reciter.name;

        }



        if(status){

            status.textContent =

            "السورة "
            +
            this.currentSurah
            +
            " - الآية "
            +
            this.currentAyah;

        }


    },



    /* ===============================
       حفظ المكان
    ================================ */

    savePosition(){


        localStorage.setItem(

            "audioPosition",

            JSON.stringify({

                surah:
                this.currentSurah,


                ayah:
                this.currentAyah

            })

        );


    },



    /* ===============================
       أحداث الصوت
    ================================ */

    setupEvents(){


        this.player.onplay =
        ()=>{


            this.isPlaying = true;


            this.updatePlayButton(
                true
            );


        };



        this.player.onpause =
        ()=>{


            this.isPlaying = false;


            this.updatePlayButton(
                false
            );


        };



        this.player.onended =
        ()=>{


            this.nextAyah();


        };


    }


};



document.addEventListener(
"DOMContentLoaded",
()=>{


    QuranAudio.init();


});
