"use client"
import { useRouter } from "next/navigation"; 
import { ChevronRight, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function DailyCard({ title, description, icon: Icon, route }) {
   const router = useRouter();
  
  const handleClick = () => {
    if (route) {
      router.push(route); // Navigate to the specific page
    }
  };
  return (
    <div onClick={handleClick} className="group bg-white/25 backdrop-blur-lg border border-white/20 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:bg-white/35 hover:scale-105 hover:shadow-xl hover:shadow-[rgb(0,106,113)]/20">
      {/* Icon Container */}
      <div className="w-16 h-16 bg-gradient-to-br from-[rgb(72,166,167)]/20 to-[rgb(0,106,113)]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon size={32} className="text-[rgb(0,106,113)] group-hover:text-[rgb(72,166,167)] transition-colors duration-300" />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-[rgb(0,106,113)] mb-4 group-hover:text-[rgb(72,166,167)] transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[rgb(72,166,167)] leading-relaxed mb-6 group-hover:text-[rgb(0,106,113)] transition-colors duration-300">
        {description}
      </p>

      {/* Action Indicator */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-sm font-semibold text-[rgb(72,166,167)] uppercase tracking-wider">
          Start Practice
        </span>
        <div className="w-2 h-2 bg-[rgb(72,166,167)] rounded-full group-hover:bg-[rgb(0,106,113)] group-hover:scale-125 transition-all duration-300"></div>
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}