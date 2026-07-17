/* ==========================================
   Mushaf Sanad
   Mushaf Page Information
========================================== */


const MUSHAF_DATA = {

1:{
surah:"الفاتحة",
juz:1,
hizb:"الأول"
},

2:{
surah:"البقرة",
juz:1,
hizb:"الأول"
},

3:{
surah:"البقرة",
juz:1,
hizb:"الأول"
},

4:{
surah:"البقرة",
juz:1,
hizb:"الأول"
},

5:{
surah:"البقرة",
juz:1,
hizb:"الأول"
}

};



function getMushafData(page){

return MUSHAF_DATA[page] || {

surah:"",
juz:1,
hizb:""

};

}
