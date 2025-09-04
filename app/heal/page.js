"use client";
import { useState } from "react";
import { spiritualHealingCures } from "../data/cure"; 
import { ArrowRight } from "lucide-react";

export default function CurePage() {
  const [index, setIndex] = useState(0);
  const current = spiritualHealingCures[index];

  const nextVerse = () => {
    setIndex((prev) => (prev + 1) % spiritualHealingCures.length);
  };

  if (!current) return <p className="text-center p-6">No verses found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(242,239,231)] via-[rgb(154,203,208)] to-[rgb(72,166,167)] py-20 px-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl p-10 space-y-8 shadow-xl">
        
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[rgb(0,106,113)] to-[rgb(72,166,167)] bg-clip-text text-transparent text-center">
          Daily Healing Verse
        </h1>

        {/* Verse Card */}
        <div className="bg-white/25 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4">
          <p className="italic text-xl md:text-2xl text-[rgb(0,106,113)]">"{current.verse}"</p>
          <p className="text-sm md:text-base text-[rgb(72,166,167)] font-semibold">{current.reference}</p>
        </div>

        {/* Reflection Card */}
        <div className="bg-white/25 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-2">
          <h2 className="text-lg md:text-xl font-bold text-[rgb(0,106,113)] mb-2">Reflection</h2>
          <p className="text-[rgb(72,166,167)]">{current.reflection}</p>
        </div>

        {/* Action Card */}
        <div className="bg-white/25 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-2">
          <h2 className="text-lg md:text-xl font-bold text-[rgb(0,106,113)] mb-2">Action</h2>
          <p className="text-[rgb(72,166,167)]">{current.action}</p>
        </div>

        {/* Navigation Button */}
        <div className="flex justify-end">
          <button
            onClick={nextVerse}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-br from-[rgb(0,106,113)] to-[rgb(72,166,167)] text-white font-bold rounded-2xl hover:scale-105 hover:shadow-xl transition-all"
          >
            <span>Next Verse</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Progress */}
        <p className="text-center text-[rgb(72,166,167)] text-sm">
          Verse {index + 1} of {spiritualHealingCures.length}
        </p>
      </div>
    </div>
  );
}
