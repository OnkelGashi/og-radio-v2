import { Play, Radio, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Neon Glow Background */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent"></div>
      
      {/* Animated Waveform */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        <div className="flex items-end justify-center space-x-1 h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-cyan-400 to-blue-500 rounded-t animate-pulse"
              style={{
                width: '3px',
                height: `${Math.random() * 100 + 20}%`,
                animationDelay: `${i * 50}ms`,
                animationDuration: `${Math.random() * 1000 + 1500}ms`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Live Badge */}
        <div className="flex justify-center mb-6">
          <Badge className="bg-red-600/20 text-red-400 border-red-500/30 px-4 py-2 text-sm font-medium">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            LIVE NOW
          </Badge>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
          Onkel Gashi
        </h1>
        
        <div className="flex items-center justify-center mb-4">
          <Radio className="w-6 h-6 text-cyan-400 mr-3" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-300">
            Radio
          </h2>
        </div>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Where underground meets the future. 400+ tracks of genre-bending beats streaming 24/7.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
          >
            <Play className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
            Tune In Live
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 rounded-full text-lg transition-all duration-300"
          >
            <Zap className="w-5 h-5 mr-2" />
            Explore Catalog
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto text-center">
          <div>
            <div className="text-2xl font-bold text-cyan-400">400+</div>
            <div className="text-sm text-gray-500">Tracks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-sm text-gray-500">Live Stream</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">5+</div>
            <div className="text-sm text-gray-500">Genres</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
