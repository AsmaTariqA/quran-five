"use client";
import { useState, useEffect } from "react";
import { Search, BookOpen, Copy, ExternalLink, ArrowUp, Filter, X } from "lucide-react";



export default function Judge() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState("");


  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/search/${query}/all/en`
      );
      const data = await res.json();
      if (data.data && data.data.matches) {
        setResults(data.data.matches);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  const filteredResults = selectedSurah 
    ? results.filter(r => r.surah.englishName.toLowerCase().includes(selectedSurah.toLowerCase()))
    : results;

  const uniqueSurahs = [...new Set(results.map(r => r.surah.englishName))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      {/* Custom CSS for fonts and animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .heading-font {
          font-family: 'Playfair Display', serif;
        }
        
        .glassmorphism {
          background: rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .glassmorphism-dark {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .pulse-search {
          animation: pulseSearch 2s infinite;
        }
        
        @keyframes pulseSearch {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(14, 116, 144, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(14, 116, 144, 0);
          }
        }
      `}</style>

    
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="glassmorphism rounded-3xl p-8 sm:p-12 mb-12 text-center fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl mb-6 shadow-lg">
            <BookOpen size={40} className="text-white" />
          </div>
          
          <h1 className="heading-font text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent mb-4">
            Qur&apos;an Judgment
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-4">
              Ibn al-Qayyim رحمه الله said one form of abandoning the Qur&apos;an is{" "}
              <span className="font-semibold text-teal-700">not judging by it</span>.
            </p>
            <p className="text-slate-500 text-base sm:text-lg">
              Use this tool to search topics and find rulings directly from the Holy Qur&apos;an.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="glassmorphism rounded-2xl p-6 sm:p-8 mb-8 fade-in">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter topic e.g. marriage, patience, justice..."
                className="w-full p-4 pr-12 rounded-xl border-2 border-teal-200 text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-teal-200 focus:border-teal-500 bg-white/70 backdrop-blur-sm transition-all duration-300 text-base sm:text-lg"
              />
              <Search 
                size={20} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-teal-400"
              />
            </div>
            
            <div className="flex gap-3">
              {results.length > 0 && (
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="px-4 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition-all duration-300 border border-slate-200 flex items-center gap-2"
                >
                  <Filter size={18} />
                  <span className="hidden sm:inline">Filter</span>
                </button>
              )}
              
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className={`px-6 sm:px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                  !searched && query.trim() ? 'pulse-search' : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span className="hidden sm:inline">Search</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {filterOpen && results.length > 0 && (
            <div className="mt-6 p-4 bg-white/50 rounded-xl border border-white/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-700">Filter by Surah</h3>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X size={18} className="text-slate-500" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSurah("")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedSurah === "" 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-white/70 text-slate-600 hover:bg-white'
                  }`}
                >
                  All ({results.length})
                </button>
                {uniqueSurahs.map((surah) => {
                  const count = results.filter(r => r.surah.englishName === surah).length;
                  return (
                    <button
                      key={surah}
                      onClick={() => setSelectedSurah(surah)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        selectedSurah === surah 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-white/70 text-slate-600 hover:bg-white'
                      }`}
                    >
                      {surah} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {!loading && searched && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg font-medium mb-2">
              No results found for {query}
            </p>
            <p className="text-slate-400 text-sm">
              Try different keywords or check your spelling
            </p>
          </div>
        )}

        {/* Results List */}
        <div className="space-y-6">
          {filteredResults.map((result, idx) => (
            <div
              key={idx}
              className="glassmorphism rounded-2xl p-6 sm:p-8 hover-lift fade-in border border-white/30"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 text-sm font-semibold rounded-full">
                      Surah {result.surah.englishName} • Ayah {result.numberInSurah}
                    </span>
                  </div>
                  
                  <blockquote className="text-slate-700 text-lg sm:text-xl leading-relaxed mb-4 font-medium border-l-4 border-teal-300 pl-4 italic">
                    "{result.text}"
                  </blockquote>
                  
                  <div className="text-slate-500 text-sm">
                    <p className="mb-1">
                      <span className="font-medium">Surah:</span> {result.surah.englishName} ({result.surah.englishNameTranslation})
                    </p>
                    <p>
                      <span className="font-medium">Reference:</span> {result.surah.englishName} {result.numberInSurah}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
                <button
                  onClick={() => copyToClipboard(result.text, idx)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/50 hover:bg-white/70 text-slate-600 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  <Copy size={16} />
                  {copiedIndex === idx ? 'Copied!' : 'Copy Ayah'}
                </button>
                
                <button
                  onClick={() => copyToClipboard(`"${result.text}" - ${result.surah.englishName} ${result.numberInSurah}`, idx + 1000)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/50 hover:bg-white/70 text-slate-600 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  <ExternalLink size={16} />
                  {copiedIndex === idx + 1000 ? 'Copied!' : 'Copy with Reference'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Results Count */}
        {filteredResults.length > 0 && (
          <div className="text-center mt-8 py-4">
            <p className="text-slate-500 text-sm">
              Showing {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
              {selectedSurah && ` from Surah ${selectedSurah}`}
            </p>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}