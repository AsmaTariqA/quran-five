"use client";
import { useState, useEffect } from "react";
import { CheckCircle, RotateCcw, Calendar, Target, TrendingUp, Clock, Award } from "lucide-react";
import actionsData from "../data/action.json";

export default function Act() {
  const [done, setDone] = useState(false);
  const [task, setTask] = useState({ ayah: "", action: "" });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastIndex, setLastIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load data
    const savedIndex = Number(localStorage.getItem("act_lastIndex"));
    const todayIndex = savedIndex >= 0 ? savedIndex : new Date().getDate() % actionsData.length;

    setTask(actionsData[todayIndex]);
    setLastIndex(todayIndex);

    const todayKey = `act_done_${new Date().toDateString()}`;
    const savedDone = localStorage.getItem(todayKey);
    if (savedDone === "true") setDone(true);

    setStreak(Number(localStorage.getItem("streak") || 0));
    setBestStreak(Number(localStorage.getItem("bestStreak") || 0));
    setTotalCompleted(Number(localStorage.getItem("totalCompleted") || 0));

    setLoading(false);
  }, []);

  const handleDone = () => {
    const todayKey = `act_done_${new Date().toDateString()}`;

    if (!done) {
      // Mark as done
      setDone(true);
      localStorage.setItem(todayKey, "true");

      const newStreak = streak + 1;
      const newTotal = totalCompleted + 1;
      const newBest = Math.max(bestStreak, newStreak);

      setStreak(newStreak);
      setTotalCompleted(newTotal);
      setBestStreak(newBest);

      localStorage.setItem("streak", newStreak.toString());
      localStorage.setItem("totalCompleted", newTotal.toString());
      localStorage.setItem("bestStreak", newBest.toString());

      // Show next ayah for tomorrow
      const nextIndex = (lastIndex + 1) % actionsData.length;
      setTask(actionsData[nextIndex]);
      setLastIndex(nextIndex);
      localStorage.setItem("act_lastIndex", nextIndex.toString());
    } else {
      // Undo completion
      setDone(false);
      localStorage.removeItem(todayKey);

      const newStreak = Math.max(streak - 1, 0);
      const newTotal = Math.max(totalCompleted - 1, 0);
      setStreak(newStreak);
      setTotalCompleted(newTotal);
      localStorage.setItem("streak", newStreak.toString());
      localStorage.setItem("totalCompleted", newTotal.toString());

      // Revert to previous ayah
      const prevIndex = (lastIndex - 1 + actionsData.length) % actionsData.length;
      setTask(actionsData[prevIndex]);
      setLastIndex(prevIndex);
      localStorage.setItem("act_lastIndex", prevIndex.toString());
    }
  };

  const getStreakLevel = () => {
    if (streak >= 30) return "Master";
    if (streak >= 14) return "Advanced";
    if (streak >= 7) return "Intermediate";
    if (streak >= 3) return "Beginner";
    return "Starting";
  };

  const getStreakProgress = () => {
    const targets = [3, 7, 14, 30];
    const currentTarget = targets.find(target => streak < target) || 100;
    return Math.min((streak / currentTarget) * 100, 100);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, rgb(242, 239, 231) 0%, rgb(154, 203, 208) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(0, 106, 113, 0.3)',
            borderTopColor: 'rgb(0, 106, 113)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, rgb(242, 239, 231) 0%, rgb(154, 203, 208) 100%)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '40px'
    }}>
      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .floating { animation: float 3s ease-in-out infinite; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: 'rgb(0, 106, 113)',
            marginBottom: '10px',
            letterSpacing: '-0.02em'
          }}>Daily Practice</h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgb(72, 166, 167)',
            fontWeight: '400'
          }}>Strengthen your spiritual journey through consistent action</p>
        </header>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[ 
            { icon: <TrendingUp size={24} color="rgb(0,106,113)"/>, value: streak, label: 'Current Streak' },
            { icon: <Award size={24} color="rgb(0,106,113)"/>, value: bestStreak, label: 'Best Streak' },
            { icon: <Target size={24} color="rgb(0,106,113)"/>, value: totalCompleted, label: 'Total Completed' },
            { icon: <Calendar size={24} color="rgb(0,106,113)"/>, value: getStreakLevel(), label: 'Current Level' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.18)',
              textAlign: 'center'
            }}>
              {stat.icon}
              <h3 style={{ color: 'rgb(0,106,113)', fontSize: '2rem', fontWeight: '700', margin: '8px 0 0 0' }}>{stat.value}</h3>
              <p style={{ color: 'rgb(72,166,167)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'rgb(0, 106, 113)', fontWeight: '600' }}>Progress to Next Level</span>
            <span style={{ color: 'rgb(72, 166, 167)', fontSize: '0.875rem' }}>{Math.round(getStreakProgress())}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,106,113,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: 'rgb(72,166,167)', width: `${getStreakProgress()}%`, borderRadius: '4px', transition: 'width 0.5s ease-in-out' }}></div>
          </div>
        </div>

        {/* Task Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.35)',
          backdropFilter: 'blur(15px)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0,106,113,0.1)'
        }} className="floating">
          {/* Date */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <Clock size={20} color="rgb(72,166,167)" style={{ marginRight: '8px' }} />
            <span style={{ color: 'rgb(72,166,167)', fontSize: '0.875rem', fontWeight: '500' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {/* Ayah */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ color: 'rgb(0,106,113)', fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px' }}>Today's Reflection</h3>
            <p style={{ color: 'rgb(72,166,167)', fontSize: '1.125rem', lineHeight: '1.7', fontStyle: 'italic', margin: 0 }}>
              "{task?.ayah || 'Loading todays reflection...'}"
            </p>
          </div>

          {/* Action */}
          <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: 'rgb(0,106,113)', fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px' }}>
  Today's Action
</h3>

            <p style={{ color: 'rgb(0,106,113)', fontSize: '1.25rem', lineHeight: '1.6', fontWeight: '500', margin: 0 }}>
              {task?.action || 'Loading todays action...'}
            </p>
          </div>

          {/* Action Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleDone}
              style={{
                background: done
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'linear-gradient(135deg, rgb(72,166,167), rgb(0,106,113))',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 32px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                margin: '0 auto',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0, 106, 113, 0.3)',
                minWidth: '200px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,106,113,0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,106,113,0.3)';
              }}
            >
              {done ? (
                <>
                  <RotateCcw size={20} />
                  Undo Completion
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Mark Complete
                </>
              )}
            </button>
          </div>
        </div>

        {/* Motivational Footer */}
        <div style={{
          textAlign: 'center',
          color: 'rgb(72,166,167)',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          <p style={{ margin: 0 }}>
            "And whoever relies upon Allah - then He is sufficient for him."
          </p>
        </div>
      </div>
    </div>
  );
}
