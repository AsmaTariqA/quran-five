import { Github, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-7xl z-50 rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/30 shadow-xl">
      <div className="flex items-center justify-between h-16 px-6 sm:px-8 lg:px-12">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold text-[rgb(0,106,113)] cursor-pointer">QuranFive</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#vision" className="text-[rgb(0,106,113)] hover:text-white font-boldtransition-colors duration-300">Vision</a>
          <a href="#how-to-use" className="text-[rgb(0,106,113)] hover:text-white font-boldtransition-colors duration-300">How to Use</a>
          <a href="#five-doors" className="text-[rgb(0,106,113)] hover:text-white font-boldtransition-colors duration-300">5 Doors</a>
          <a href="https://github.com/AsmaTariqA" target="_blank" rel="noopener noreferrer" className="flex items-center text-[rgb(0,106,113)] hover:text-white font-boldtransition-colors duration-300">
            <Github size={18} className="mr-1" /> GitHub
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden p-2 rounded-lg text-[rgb(0,106,113)] hover:bg-white/20 transition-all duration-300"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-500 overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"}`}>
        <div className="flex flex-col px-6 pt-4 pb-6 space-y-4 bg-white/10 backdrop-blur-2xl border-t border-white/30 rounded-b-2xl shadow-inner">
          <a href="#vision" onClick={() => setIsOpen(false)} className="text-[rgb(0,106,113)] hover:text-white font-boldtransition-colors duration-300">Vision</a>
          <a href="#how-to-use" onClick={() => setIsOpen(false)} className="text-[rgb(0,106,113)] hover:text-white font-boldtransition-colors duration-300">How to Use</a>
          <a href="#five-doors" onClick={() => setIsOpen(false)} className="text-[rgb(0,106,113)] hover:text-white font-boldtransition-colors duration-300">5 Doors</a>
          <a href="https://github.com/AsmaTariqA" target="_blank" rel="noopener noreferrer" className="flex items-center text-[rgb(0,106,113)] hover:text-white font-boldtransition-colors duration-300">
            <Github size={18} className="mr-1" /> GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
