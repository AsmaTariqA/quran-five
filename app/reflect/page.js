"use client"
import { useState, useEffect } from "react";
import { Sparkles, RotateCcw, BookOpen } from "lucide-react";

// Reflection prompts (lenses)
export const prompts = {
  language: [
    "Which word in this verse stands out most to you? Why?",
    "What deeper meanings could this word have?",
    "Is there a reason Allah used *this* word instead of another?"
  ],
  quranic_worlds: [
    "What's the order of ideas in this verse, and why might it matter?",
    "Does the sentence structure change the tone or emphasis?",
    "Is there repetition or symmetry that catches your attention?"
  ],
  personal_experience: [
    "What situation might this verse be responding to?",
    "Why do you think Allah revealed this message at that time?",
    "Does this connect to a historical event or broader theme?"
  ],
  connection: [
    "Who is Allah speaking to in this verse?",
    "What message is being sent to that audience?",
    "How would this verse feel if it were addressing *you* personally?"
  ],
  general_lesson: [
    "How is this verse relevant to something you're going through?",
    "What emotions or thoughts does this verse trigger today?",
    "What change can you make in your life after reading this?"
  ]
};

// Lens descriptions for tooltips
const lensDescriptions = {
  language: "Focus on specific words and linguistic choices",
  quranic_worlds: "Examine structure, patterns, and rhetorical devices",
  personal_experience: "Connect to historical context and personal relevance",
  connection: "Consider the audience and message recipient",
  general_lesson: "Extract practical wisdom for daily life"
};

function QuranReflect() {
  const [reference, setReference] = useState("");
  const [verse, setVerse] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeLens, setActiveLens] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [reflection, setReflection] = useState("");
  const [savedReflections, setSavedReflections] = useState([]);
  const [activeTab, setActiveTab] = useState("reflect");
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load saved reflections from localStorage on component mount
  useEffect(() => {
    const storedReflections = localStorage.getItem('quranReflections');
    if (storedReflections) {
      setSavedReflections(JSON.parse(storedReflections));
    }
    
    // Load fonts
    document.fonts.load('1em "Poppins"').then(() => {
      setFontLoaded(true);
    });
  }, []);

  // Save reflections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quranReflections', JSON.stringify(savedReflections));
  }, [savedReflections]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedRef = reference.trim();

    if (!trimmedRef || !/^\d+:\d+$/.test(trimmedRef)) {
      setError("Please enter a valid verse reference (e.g. 2:255)");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const [arabicRes, engRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/ayah/${trimmedRef}/ar.uthmani`),
        fetch(`https://api.alquran.cloud/v1/ayah/${trimmedRef}/en.sahih`)
      ]);

      const arabicData = await arabicRes.json();
      const engData = await engRes.json();

      if (arabicData.code === 200 && engData.code === 200) {
        setVerse({
          arabic: arabicData.data.text,
          translation: engData.data.text,
          ref: trimmedRef
        });
        setActiveLens("");
        setCurrentPrompt("");
        setReflection("");
      } else {
        setError("Verse not found. Try another reference.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching verse. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLensChange = (lensKey) => {
    setActiveLens(lensKey);
    const options = prompts[lensKey];
    if (options) {
      const randomPrompt = options[Math.floor(Math.random() * options.length)];
      setCurrentPrompt(randomPrompt);
    }
  };

  const saveReflection = () => {
    if (!reflection.trim() || !verse || !activeLens || !currentPrompt) return;
    
    const newReflection = {
      id: Date.now(),
      verseRef: verse.ref,
      verseText: verse.translation,
      lens: activeLens,
      prompt: currentPrompt,
      reflection: reflection,
      date: new Date().toISOString()
    };
    
    setSavedReflections([newReflection, ...savedReflections]);
    setReflection("");
    setActiveLens("");
    setCurrentPrompt("");
  };

  const deleteReflection = (id) => {
    setSavedReflections(savedReflections.filter(ref => ref.id !== id));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(242,239,231)] via-[rgb(154,203,208)] to-[rgb(72,166,167)] p-4 md:p-6" style={{ fontFamily: fontLoaded ? 'Poppins, sans-serif' : 'system-ui, sans-serif' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        
        .arabic-font {
          font-family: 'Amiri', serif;
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-[rgb(72,166,167)] to-[rgb(0,106,113)] text-white p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Sparkles size={28} className="text-white mr-2" />
            <h1 className="text-3xl font-bold">Qur&apos;an Reflection Journey</h1>
          </div>
          <p className="opacity-95">Deepen your understanding through guided reflection</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[rgb(154,203,208)] bg-white/70 backdrop-blur-sm">
          <button
            className={`flex-1 py-4 font-medium ${activeTab === "reflect" ? "text-[rgb(0,106,113)] bg-[rgb(154,203,208)]/30 backdrop-blur-sm" : "text-[rgb(72,166,167)] hover:bg-white/70"}`}
            onClick={() => setActiveTab("reflect")}
          >
            Reflect
          </button>
          <button
            className={`flex-1 py-4 font-medium ${activeTab === "saved" ? "text-[rgb(0,106,113)] bg-[rgb(154,203,208)]/30 backdrop-blur-sm" : "text-[rgb(72,166,167)] hover:bg-white/70"}`}
            onClick={() => setActiveTab("saved")}
          >
            My Reflections ({savedReflections.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === "reflect" ? (
            <>
              {/* Search Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[rgb(0,106,113)] mb-4">Find a Verse</h2>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Enter verse reference (e.g. 2:255)"
                      className="w-full p-4 rounded-xl border border-[rgb(154,203,208)] bg-white/90 text-[rgb(0,106,113)] placeholder-[rgb(72,166,167)] focus:outline-none focus:ring-2 focus:ring-[rgb(72,166,167)] focus:border-transparent pr-12"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-[rgb(72,166,167)]">
                      e.g. 2:255
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-4 rounded-xl bg-[rgb(72,166,167)] hover:bg-[rgb(0,106,113)] text-white font-semibold shadow-md disabled:opacity-70 flex items-center justify-center gap-2 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        Search Verse
                      </>
                    )}
                  </button>
                </form>
                {error && <div className="text-amber-700 mt-2 text-sm bg-amber-100/80 p-2 rounded-lg border border-amber-200">{error}</div>}
              </div>

              {/* Verse Display */}
              {verse && (
                <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 mb-8 border border-[rgb(154,203,208)]">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-[rgb(0,106,113)]">Verse {verse.ref}</h2>
                    <button 
                      onClick={() => {
                        setVerse(null);
                        setReference("");
                        setActiveLens("");
                        setCurrentPrompt("");
                        setReflection("");
                      }}
                      className="text-[rgb(72,166,167)] hover:text-[rgb(0,106,113)] text-sm flex items-center gap-1 bg-white/70 p-2 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Change verse
                    </button>
                  </div>
                  <div className="bg-white/90 backdrop-blur-md p-5 rounded-lg mb-4 border border-[rgb(154,203,208)]">
                    <p className="text-3xl leading-loose text-right mb-4 arabic-font text-[rgb(0,106,113)]" dir="rtl">
                      {verse.arabic}
                    </p>
                    <div className="border-t border-[rgb(154,203,208)] pt-4">
                      <p className="text-[rgb(0,106,113)]">{verse.translation}</p>
                    </div>
                  </div>

                  {/* Reflection Lenses */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[rgb(0,106,113)] mb-4 flex items-center gap-2">
                      Reflection Lenses
                      <span className="text-sm font-normal text-[rgb(72,166,167)]">(Choose one to begin)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(prompts).map(([lensKey, prompts]) => (
                        <div 
                          key={lensKey}
                          className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                            activeLens === lensKey 
                              ? "border-[rgb(72,166,167)] bg-[rgb(154,203,208)]/40 shadow-md" 
                              : "border-[rgb(154,203,208)] bg-white/70 hover:border-[rgb(72,166,167)]"
                          }`}
                          onClick={() => handleLensChange(lensKey)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-[rgb(0,106,113)] capitalize">
                              {lensKey.replace("_", " ")}
                            </h4>
                            <div className="text-xs bg-[rgb(154,203,208)]/50 text-[rgb(0,106,113)] px-2 py-1 rounded-full">
                              {prompts.length} prompts
                            </div>
                          </div>
                          <p className="text-sm text-[rgb(72,166,167)]">
                            {lensDescriptions[lensKey]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Prompt */}
                  {currentPrompt && (
                    <div className="bg-white/90 backdrop-blur-md rounded-xl p-5 border border-[rgb(154,203,208)] mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 bg-[rgb(72,166,167)] rounded-full"></div>
                        <h4 className="font-medium text-[rgb(0,106,113)] capitalize">{activeLens.replace("_", " ")} Reflection</h4>
                      </div>
                      <p className="text-lg text-[rgb(0,106,113)] mb-4 bg-[rgb(154,203,208)]/30 p-4 rounded-lg">{currentPrompt}</p>
                      <textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="Write your thoughts here..."
                        className="w-full p-4 rounded-xl border border-[rgb(154,203,208)] bg-white text-[rgb(0,106,113)] placeholder-[rgb(72,166,167)] focus:outline-none focus:ring-2 focus:ring-[rgb(72,166,167)] focus:border-transparent"
                        rows="5"
                      />
                      <div className="flex justify-between items-center mt-4">
                        <button
                          onClick={() => {
                            const options = prompts[activeLens];
                            const randomPrompt = options[Math.floor(Math.random() * options.length)];
                            setCurrentPrompt(randomPrompt);
                          }}
                          className="text-sm text-[rgb(72,166,167)] hover:text-[rgb(0,106,113)] flex items-center gap-1 bg-white/70 p-2 rounded-lg transition-colors"
                        >
                          <RotateCcw size={16} />
                          Different prompt
                        </button>
                        <button
                          onClick={saveReflection}
                          disabled={!reflection.trim()}
                          className="px-5 py-2 rounded-xl bg-[rgb(72,166,167)] hover:bg-[rgb(0,106,113)] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                        >
                          <BookOpen size={18} />
                          Save Reflection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Saved Reflections Tab */
            <div>
              <h2 className="text-xl font-semibold text-[rgb(0,106,113)] mb-6">My Reflections</h2>
              {savedReflections.length === 0 ? (
                <div className="text-center py-12 bg-[rgb(154,203,208)]/30 rounded-xl border border-[rgb(154,203,208)]">
                  <BookOpen size={48} className="mx-auto text-[rgb(72,166,167)] mb-4" />
                  <p className="text-[rgb(0,106,113)]">No reflections yet. Start reflecting on verses to see them here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {savedReflections.map((reflection) => (
                    <div key={reflection.id} className="bg-white/80 backdrop-blur-md border border-[rgb(154,203,208)] rounded-xl p-5 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-[rgb(0,106,113)]">Verse {reflection.verseRef}</h3>
                          <p className="text-sm text-[rgb(72,166,167)] capitalize">{reflection.lens.replace("_", " ")} • {formatDate(reflection.date)}</p>
                        </div>
                        <button 
                          onClick={() => deleteReflection(reflection.id)}
                          className="text-[rgb(72,166,167)] hover:text-amber-600 transition-colors bg-white/70 p-1 rounded-lg"
                          aria-label="Delete reflection"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="mb-4">
                        <p className="text-[rgb(0,106,113)] italic">{reflection.verseText}</p>
                      </div>
                      <div className="bg-[rgb(154,203,208)]/30 p-4 rounded-lg mb-4">
                        <p className="text-[rgb(0,106,113)] font-medium">{reflection.prompt}</p>
                      </div>
                      <div className="p-3 bg-white/90 rounded-lg">
                        <p className="text-[rgb(0,106,113)]">{reflection.reflection}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[rgb(154,203,208)]/30 p-4 text-center text-sm text-[rgb(0,106,113)] border-t border-[rgb(154,203,208)]">
          <p>Reflection framework inspired by Ibn al-Qayyim&apos;s teachings</p>
        </div>
      </div>
    </div>
  );
}

export default QuranReflect;