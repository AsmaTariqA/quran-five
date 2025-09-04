import { Sparkles} from "lucide-react";
export default function Footer(){
    return (
     <footer className=" bg-[rgb(72,166,167)] py-4 px-6">
  <div className="max-w-6xl mx-auto text-center space-y-6">
    
    {/* Logo / Title */}
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <Sparkles size={24} className="text-cyan-700 mr-2 animate-pulse" />
        <span className="text-cyan-800 font-extrabold text-2xl">QuranFive</span>
      </div>
      <p className="text-teal-700 font-medium max-w-md">
        &apos;And whoever relies upon Allah - then He is sufficient for him.&apos;
      </p>
    </div>

    

    {/* Copyright */}
    <p className="text-teal-700 text-md  font-bold">
      © 2025 QuranFive. Built with ❤️ for spiritual growth by Asma Tariq.
    </p>
  </div>
</footer>
    )
}