import { TrendingUp, Calendar, Target, Award } from "lucide-react";
import { useState, useEffect } from "react";

export default function StreakTracker({ streak }) {
  const getStreakMessage = () => {
    if (streak === 0) return "Start your spiritual journey today";
    if (streak === 1) return "Great start! Keep building your habit";
    if (streak < 7) return "Building momentum, stay consistent";
    if (streak < 30) return "Excellent progress! You're developing discipline";
    return "Amazing dedication! You're truly holding fast";
  };


  return (
    <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg mb-6 text-center hover:bg-white/35 transition-all duration-300">
      <div className="flex items-center justify-center gap-3 mb-3">
         <p className="text-xl font-bold text-[rgb(0,106,113)]">
          Current Streak: {streak} day{streak !== 1 ? "s" : ""}
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-[rgb(72,166,167)]/20 to-[rgb(0,106,113)]/20 rounded-xl p-3 mt-4">
        <p className="text-[rgb(72,166,167)] font-medium">
          {getStreakMessage()}
        </p>
      </div>

      {/* Progress Dots */}
      {streak > 0 && (
        <div className="flex justify-center space-x-2 mt-4">
          {[...Array(Math.min(streak, 7))].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-br from-[rgb(72,166,167)] to-[rgb(0,106,113)] rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
          {streak > 7 && (
            <span className="text-[rgb(0,106,113)] font-bold text-sm ml-2">
              +{streak - 7}
            </span>
          )}
        </div>
      )}
    </div>
  );
}