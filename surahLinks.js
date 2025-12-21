const surahLinks = {
  afasy: [],
  maher: [], 
};

for (let i = 1; i <= 114; i++) {
  surahLinks.afasy.push(
    `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${i}.mp3`
  );

  surahLinks.maher.push(
    `https://cdn.islamic.network/quran/audio-surah/128/ar.mahermuaiqly/${i}.mp3`
  );
}
