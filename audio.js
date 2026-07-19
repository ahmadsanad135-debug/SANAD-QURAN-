/* ==========================================
   Mushaf Sanad
   audio.js
   Quran Audio Controller
========================================== */


const QuranAudio = {

   updatePlayerInfo(){


    const surah =
    getSurahInfo(
        this.currentSurah
    );


    const title =
    document.getElementById(
        "playing-status"
    );


    if(title && surah){

        title.textContent =
        "سورة "
        + surah.name
        +
        " - الآية "
        +
        toArabicNumber(
            this.currentAyah
        );

    }


   }
   player: null,

    currentSurah: 1,

    currentAyah: 1,

    reciterId: null,

    isPlaying: false,

togglePlay(){

    if(!this.player)
    return;


    if(this.player.paused){

        this.player.play();

        this.updatePlayButton(true);

    }
    else{

        this.player.pause();

        this.updatePlayButton(false);

    }

},



updatePlayButton(state){

    const button =
    document.getElementById(
        "playButton"
    );


    if(!button)
    return;


    button.innerHTML =
    state

    ?

    '<i class="fas fa-pause"></i>'

    :

    '<i class="fas fa-play"></i>';

},

    /* ===============================
       تشغيل النظام
    ================================ */

    init(){

        this.player =
        document.getElementById(
            "audio-player"
        );


        if(!this.player){
            console.log("Audio player not found");
            return;
        }


        this.reciterId =
        localStorage.getItem("reciter")
        || RECITERS[0].id;


        this.createReciterList();


        this.setupEvents();


    },



    /* ===============================
       إنشاء قائمة القراء
    ================================ */

    createReciterList(){

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


            localStorage.setItem(
                "reciter",
                this.reciterId
            );


        };


    },



    /* ===============================
       الحصول على رابط الصوت
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

       this.updatePlayerInfo();

        this.player.src =
        url;


        this.player.play();



        this.highlightAyah(
            surah,
            ayah
        );


        this.savePosition();


    },



    /* ===============================
       الآية التالية
    ================================ */

    nextAyah(){


    const surahInfo =
    getSurahInfo(
        this.currentSurah
    );


    if(!surahInfo)
    return;



    // إذا لم نصل لنهاية السورة
    if(
        this.currentAyah <
        surahInfo.ayahs
    ){

        this.currentAyah++;


        this.playAyah(
            this.currentSurah,
            this.currentAyah
        );


    }

    // نهاية السورة
    else{


        if(
            this.currentSurah < 114
        ){

            this.currentSurah++;

            this.currentAyah = 1;


            this.playAyah(
                this.currentSurah,
                1
            );


        }

        else{

            this.player.pause();

            console.log(
                "انتهى القرآن"
            );

        }

    }


},



    /* ===============================
       الآية السابقة
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



        const ayahElement =
        document.querySelector(
        `.ayah[data-surah="${surah}"][data-ayah="${ayah}"]`
        );



        if(ayahElement){


            ayahElement.classList.add(
                "playing"
            );


            ayahElement.scrollIntoView({

                behavior:"smooth",

                block:"center"

            });


        }


    },



    /* ===============================
       حفظ مكان التوقف
    ================================ */

    savePosition(){


        localStorage.setItem(
            "audioPosition",
            JSON.stringify({

                surah:this.currentSurah,

                ayah:this.currentAyah

            })
        );


    },



    /* ===============================
       تحميل آخر مكان
    ================================ */

    loadPosition(){


        const data =
        JSON.parse(
            localStorage.getItem(
                "audioPosition"
            )
        );


        if(data){

            this.currentSurah =
            data.surah;


            this.currentAyah =
            data.ayah;

        }


    },



    /* ===============================
       أحداث الصوت
    ================================ */

    setupEvents(){


    this.player.onplay = ()=>{

        this.isPlaying = true;

        this.updatePlayButton(true);

    };



    this.player.onpause = ()=>{

        this.isPlaying = false;

        this.updatePlayButton(false);

    };



    this.player.onended = ()=>{

        this.nextAyah();

    };



    this.player.ontimeupdate = ()=>{


        const progress =
        document.getElementById(
            "audio-progress"
        );


        if(progress && this.player.duration){

            progress.value =
            (
            this.player.currentTime /
            this.player.duration
            ) * 100;

        }

    };


    }


document.addEventListener(
"DOMContentLoaded",
()=>{

    QuranAudio.init();

}); 
