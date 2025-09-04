"use client"
import Navbar from "../app/components/Navbar";
import Footer from "../app/components/Footer";
import DailyCard from "../app/components/DailyCard";
import StreakTracker from "../app/components/StreakTracker";
import { useState, useEffect } from "react";

import { 
  Headphones, 
  Heart, 
  Scale, 
  BookOpen, 
  Flower2,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Calendar,
  RotateCcw,
  Sparkles,
  Book
} from "lucide-react";

export default function Home() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedStreak = localStorage.getItem("streak") || 0;
    setStreak(Number(savedStreak));
  }, []);

  const doors = [
    { 
      title: "Listen", 
      description: "Begin your day with divine recitation and mindful listening", 
      icon: Headphones, 
      route: "/listen"
    },
    { 
      title: "Act", 
      description: "Transform inspiration into meaningful daily actions", 
      icon: Heart, 
      route: "/act"
    },
    { 
      title: "Judge", 
      description: "Make decisions guided by divine wisdom", 
      icon: Scale, 
      route: "/judge"
    },
    { 
      title: "Reflect", 
      description: "Deepen understanding through contemplation", 
      icon: BookOpen, 
      route: "/reflect"
    },
    { 
      title: "Heal", 
      description: "Find peace and comfort in divine guidance", 
      icon: Flower2, 
      route: "/heal"
    },

  ];

  const howToSteps = [
    {
      number: "1",
      title: "Pick a Door",
      description: "Choose one of the doors based on what you feel like doing today.",
      icon: CheckCircle
    },
    {
      number: "2", 
      title: "Follow the Task",
      description: "Complete the suggested action, reflection, or recitation.",
      icon: Heart
    },
    {
      number: "3",
      title: "Track Your Progress", 
      description: "Check your streak and see your personal growth over time.",
      icon: TrendingUp
    },
    {
      number: "4",
      title: "Reflect & Repeat",
      description: "End your day by reflecting and prepare for tomorrow's practice.",
      icon: RotateCcw
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(242,239,231)] via-[rgb(154,203,208)] to-[rgb(72,166,167)]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles size={32} className="text-[rgb(0,106,113)] mr-3" />
            <h1 className="text-6xl font-black bg-gradient-to-r from-[rgb(0,106,113)] to-[rgb(72,166,167)] bg-clip-text text-transparent">
              QuranFive
            </h1>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[rgb(0,106,113)] mb-6 leading-tight">
            Your Daily Spiritual Practice
          </h2>
          
          <p className="text-xl text-[rgb(72,166,167)] mb-12 max-w-3xl mx-auto leading-relaxed">
            Strengthen your connection through meaningful practices. Build consistency, find inner peace, and grow spiritually.
          </p>

          <div className="bg-white/25 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-16 max-w-4xl mx-auto">
            <StreakTracker streak={streak} />
          </div>
        </div>
      </section>

      {/* Vision Section */}
<section id="vision" className="py-20 px-6 bg-white/25 backdrop-blur-lg border border-white/20 rounded-3xl max-w-6xl mx-auto mb-16">
  <div className="text-center space-y-6">
    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[rgb(0,106,113)] to-[rgb(72,166,167)] bg-clip-text text-transparent mb-4">
      Our Vision
    </h2>
    
    <p className="text-xl text-[rgb(72,166,167)] max-w-3xl mx-auto leading-relaxed">
      QuranFive was created to help you stay connected to the Qur&apos;an and seek its guidance daily. 
      As Allah says: 
    </p>

    <p className="italic text-lg md:text-xl text-[rgb(0,106,113)] max-w-3xl mx-auto">
      “And the Messenger (will) say: O My Lord, indeed my people took this Qur&apos;aan as something worthy of being abandoned.” [25:30]
    </p>

    <p className="text-[rgb(72,166,167)] max-w-3xl mx-auto leading-relaxed">
      Ibn Qayyim emphasized that abandoning the Qur&apos;an for other means is a spiritual loss. 
      This is the inspiration behind QuranFive: to make daily engagement with the Qur&apos;an simple, meaningful, and transformative.
    </p>
  </div>
</section>


      {/* Five Doors Section */}
      <section id="five-doors" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[rgb(0,106,113)] to-[rgb(72,166,167)] bg-clip-text text-transparent mb-6">
              Five Doors to Growth
            </h2>
            <p className="text-xl text-[rgb(72,166,167)] max-w-2xl mx-auto">
              Each door represents a path to spiritual development and inner peace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doors.map((door, index) => (
              <div key={door.title} className={`${door.title === "Cure" ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}`}>
                <DailyCard {...door} />
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* How To Use Section */}
      <section id="how-to-use" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[rgb(0,106,113)] to-[rgb(72,166,167)] bg-clip-text text-transparent mb-6">
              How To Use
            </h2>
            <p className="text-xl text-[rgb(72,166,167)] max-w-2xl mx-auto">
              Simple steps to transform your daily routine into a meaningful spiritual journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howToSteps.map((step) => (
              <div 
                key={step.number}
                className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:bg-white/40 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[rgb(72,166,167)] to-[rgb(0,106,113)] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                  {step.number}
                </div>

                <step.icon size={32} className="text-[rgb(0,106,113)] mb-4 mx-auto" />

                <h3 className="text-xl font-bold text-[rgb(0,106,113)] mb-4">
                  {step.title}
                </h3>

                <p className="text-[rgb(72,166,167)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
