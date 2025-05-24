import { Music, Headphones, Zap } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Section Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent"></div>
      
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            The Sound Journey
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Story Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              What started in a bedroom studio with nothing but passion and a beat-up laptop has evolved into something extraordinary. OnkelGashi began crafting beats not to follow trends, but to break them—fusing the raw energy of Hip-Hop with the ethereal landscapes of EDM, the intimacy of Indie Pop with the intensity of Trap.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Each track tells a story. Late nights turned into early mornings, experimentation became obsession, and traditional boundaries dissolved into something entirely new. Using innovative production techniques and an uncompromising vision, this catalog represents years of sonic exploration.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              This isn't just music—it's a soundtrack for digital natives, content creators, and anyone who craves something fresh. Every beat is designed to move both body and soul, creating immersive experiences that resonate long after the song ends.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center text-cyan-400">
                <Music className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Genre-Bending</span>
              </div>
              <div className="flex items-center text-purple-400">
                <Headphones className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Immersive Audio</span>
              </div>
              <div className="flex items-center text-blue-400">
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Next-Gen Production</span>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl border border-gray-700 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center opacity-80">
                  <Music className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">400+ Tracks</h3>
                <p className="text-gray-400">Years of Creative Evolution</p>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/30 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-500/30 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 -right-6 w-4 h-4 bg-cyan-500/30 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
