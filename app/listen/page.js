"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Search, BookOpen, Clock, Settings } from "lucide-react";

export default function Listen() {
  const [surahs, setSurahs] = useState([]);
  const [surah, setSurah] = useState(null);
  const [surahName, setSurahName] = useState("");
  const [ayahs, setAyahs] = useState([]);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ayahInput, setAyahInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  
  const audioRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => {
        setSurahs(data.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!surah) return;
    setIsLoading(true);
    fetch(`https://api.alquran.cloud/v1/surah/${surah}/ar.alafasy`)
      .then((res) => res.json())
      .then((data) => {
        setSurahName(data.data.englishName);
        setAyahs(data.data.ayahs);
        setCurrentAyah(1);
        setIsPlaying(false);
        setAyahInput("");
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [surah]);

  useEffect(() => {
    if (!ayahs.length) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(ayahs[currentAyah - 1].audio);
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (autoPlay && currentAyah < ayahs.length) {
        setTimeout(() => setCurrentAyah(prev => prev + 1), 500);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentAyah, ayahs, autoPlay]);

  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleAyahInput = (e) => {
    const val = Number(e.target.value);
    setAyahInput(e.target.value);
    if (val >= 1 && val <= ayahs.length) setCurrentAyah(val);
  };
  const selectAyah = (ayahNumber) => {
    setCurrentAyah(ayahNumber);
    setIsPlaying(false);
    setAyahInput("");
  };
  const goToPrevious = () => currentAyah > 1 && setCurrentAyah(prev => prev - 1);
  const goToNext = () => currentAyah < ayahs.length && setCurrentAyah(prev => prev + 1);
  const formatTime = (time) => `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, "0")}`;
  const filteredSurahs = surahs.filter(s =>
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(242,239,231)] via-[rgb(154,203,208)] to-[rgb(72,166,167)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-[rgb(0,106,113)] mb-2">Listen to the Quran</h1>
          <p className="text-lg text-[rgb(72,166,167)] max-w-2xl mx-auto">
            Experience the beautiful recitation of the Holy Quran
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Surah List */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-4 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[rgb(0,106,113)]">Surahs</h2>
                <span className="bg-[rgb(72,166,167)] text-white px-2 py-1 rounded-full text-xs font-semibold">{surahs.length}</span>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(0,106,113)]" size={18} />
                <input
                  type="text"
                  placeholder="Search surahs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[rgb(0,106,113)] rounded-xl focus:ring-2 focus:ring-[rgb(72,166,167)] focus:border-transparent bg-white/60 backdrop-blur-sm transition-all"
                />
              </div>

              {/* Surah List */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-2">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-[rgb(72,166,167)]/30 rounded-xl h-16"></div>
                  ))
                ) : (
                  filteredSurahs.map((s) => (
                    <button
                      key={s.number}
                      onClick={() => setSurah(s.number)}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                        surah === s.number ? "bg-[rgb(0,106,113)] text-white shadow-lg transform scale-[1.02]" : "bg-white/60 hover:bg-[rgb(72,166,167)]/20 text-[rgb(0,106,113)] hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-bold px-2 py-1 rounded-full ${surah === s.number ? "bg-white/20" : "bg-[rgb(72,166,167)] text-white"}`}>
                              {s.number}
                            </span>
                            <span className="font-bold truncate">{s.englishName}</span>
                          </div>
                          <p className={`text-sm mt-1 truncate ${surah === s.number ? "text-white/80" : "text-[rgb(0,106,113)]"}`}>
                            {s.englishNameTranslation}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {!surah ? (
              <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                <BookOpen className="mx-auto text-[rgb(0,106,113)] mb-4" size={64} />
                <h3 className="text-2xl font-bold text-[rgb(0,106,113)] mb-2">Select a Surah</h3>
                <p className="text-[rgb(72,166,167)]">Choose a surah from the list to start listening</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Surah Header */}
                <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 text-center">
                  <h2 className="text-3xl font-bold text-[rgb(0,106,113)] mb-2">{surahName}</h2>
                  <div className="flex items-center justify-center space-x-4 text-[rgb(72,166,167)]">
                    <span className="flex items-center space-x-1"><Clock size={16} /><span>{ayahs.length} verses</span></span>
                  </div>
                </div>

                {/* Current Ayah */}
                {ayahs.length > 0 && (
                  <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
                    <div className="text-center mb-8">
                      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 lg:p-8 mb-6">
                        <p className="text-2xl lg:text-3xl leading-relaxed text-[rgb(0,106,113)] font-arabic" dir="rtl">{ayahs[currentAyah - 1].text}</p>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-[rgb(72,166,167)] font-semibold">
                        <span>Verse {currentAyah} of {ayahs.length}</span>
                      </div>
                    </div>

                    {/* Audio Controls */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="w-full bg-[rgb(72,166,167)]/30 rounded-full h-2">
                          <div className="bg-[rgb(0,106,113)] h-2 rounded-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-sm text-[rgb(0,106,113)]">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-4">
                        <button onClick={goToPrevious} disabled={currentAyah === 1} className="p-3 rounded-full bg-white/60 hover:bg-[rgb(72,166,167)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[rgb(0,106,113)]"><SkipBack size={20} /></button>
                        <button onClick={togglePlay} className="p-4 rounded-full bg-[rgb(0,106,113)] hover:bg-[rgb(0,86,93)] text-white shadow-lg transform hover:scale-105 transition-all duration-200">{isPlaying ? <Pause size={28} /> : <Play size={28} />}</button>
                        <button onClick={goToNext} disabled={currentAyah === ayahs.length} className="p-3 rounded-full bg-white/60 hover:bg-[rgb(72,166,167)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[rgb(0,106,113)]"><SkipForward size={20} /></button>
                      </div>

                      <div className="flex items-center justify-center">
                        <label className="flex items-center space-x-2 text-[rgb(0,106,113)] cursor-pointer">
                          <input type="checkbox" checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} className="rounded border-[rgb(0,106,113)] text-[rgb(72,166,167)] focus:ring-[rgb(72,166,167)]" />
                          <span className="text-sm font-medium">Auto-play next verse</span>
                        </label>
                      </div>

                      {/* Ayah Navigation */}
                      <div className="bg-[rgb(242,239,231)]/40 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                          <label className="text-sm font-medium text-[rgb(0,106,113)]">Go to verse:</label>
                          <div className="flex items-center space-x-3">
                            <input type="number" min="1" max={ayahs.length} value={ayahInput || currentAyah} onChange={handleAyahInput} placeholder={`1-${ayahs.length}`} className="w-20 px-3 py-2 border border-[rgb(0,106,113)] rounded-lg focus:ring-2 focus:ring-[rgb(72,166,167)] focus:border-transparent text-center bg-white"/>
                            <input type="range" min="1" max={ayahs.length} value={currentAyah} onChange={(e) => selectAyah(Number(e.target.value))} className="flex-1 max-w-xs h-2 bg-[rgb(72,166,167)]/30 rounded-lg appearance-none cursor-pointer slider"/>
                          </div>
                        </div>

                        <div className="max-h-40 overflow-y-auto custom-scrollbar">
                          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                            {ayahs.map((_, index) => (
                              <button key={index + 1} onClick={() => selectAyah(index + 1)} className={`p-2 text-sm rounded-lg transition-all duration-200 ${currentAyah === index + 1 ? "bg-[rgb(0,106,113)] text-white shadow-md transform scale-105" : "bg-white/60 text-[rgb(0,106,113)] hover:bg-[rgb(72,166,167)]/20"}`}>{index + 1}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .font-arabic { font-family: 'Amiri', 'Times New Roman', serif; }
        .slider::-webkit-slider-thumb { appearance: none; height: 20px; width: 20px; border-radius: 50%; background: #0891b2; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .slider::-moz-range-thumb { height: 20px; width: 20px; border-radius: 50%; background: #0891b2; cursor: pointer; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14, 116, 144, 0.4); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(14, 116, 144, 0.6); }
        @media (max-width: 640px) { .font-arabic { font-size: 1.5rem; line-height: 1.6; } }
      `}</style>
    </div>
  );
}
