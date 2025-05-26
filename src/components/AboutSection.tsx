import { Music, Headphones, Zap } from "lucide-react";
import { getHeadingTextColorClass, getBodyTextColorClass, getGenreTitleTextColorClass, getHighlightTextColorClass } from "@/utils/textColors"; //

type AboutSectionProps = {
  activeGenre?: string | null; //
};

// Define comprehensive genre data
const genreData: Record<
  string,
  { name: string; text: string; headingColorClass?: string; bodyColorClass?: string; highlightColorClass?: string }
> = {
  "lofi": { //
    name: "Lofi Hues",
    text: "Relax your mind with chilled beats and nostalgic melodies. Lo-fi is the perfect backdrop for study, work, or unwinding after a long day, creating a cozy and focused atmosphere.",
  },
  "hip-hop": { //
    name: "Hip Hop Arena",
    text: "From classic boom-bap to modern trap, explore the diverse world of hip hop. It's all about lyrical prowess, infectious rhythms, and authentic storytelling.",
  },
  "electronic": { //
    name: "Electronic Dimensions",
    text: "Dive into the vast universe of electronic music. Discover evolving soundscapes, futuristic synths, and beats that make you move, from ambient textures to dancefloor anthems.",
  },
  "rap": { //
    name: "Rap Central",
    text: "Experience the power of rhythm and poetry. Rap is a raw expression of thoughts, stories, and emotions, delivered with skill and passion.",
  },
  "rnb": { //
    name: "R&B Soul Station",
    text: "Smooth grooves, soulful vocals, and heartfelt lyrics define R&B. It's music that connects with your emotions and sets the mood for romance or introspection.",
  },
  "indie": { //
    name: "Indie Vibes",
    text: "Discover unique sounds from independent artists forging their own paths. Indie is about authenticity, creativity, and a fresh perspective on music.",
  },
  "ambient": { //
    name: "Ambient Escape",
    text: "Immerse yourself in atmospheric soundscapes that create space for thought and relaxation. Ambient music is a journey for the mind, perfect for focus or meditation.",
  },
  "jazz": { //
    name: "Jazz Lounge",
    text: "Experience the art of improvisation, sophisticated harmonies, and timeless cool. Jazz is a conversation between instruments, rich in history and innovation.",
  },
  "rock": { //
    name: "Rock Arena",
    text: "From classic riffs to modern anthems, rock music delivers energy, passion, and attitude. It's the sound of rebellion and raw emotion.",
  },
  "experimental": { //
    name: "Experimental Lab",
    text: "Pushing the boundaries of sound, experimental music challenges conventions and explores new sonic territories. Expect the unexpected.",
  },
  // Add more genres as needed
};

const defaultText = `Every track on OG Radio is for those who live and breathe music: ADHD focus, restless curiosity, and a need for fresh energy. Each song is a product of endless curiosity, hyperactive creativity, and the need to make something different. This isn’t “just” music—it’s fuel for the digital age, a stream for content creators, and a soundtrack for anyone who refuses to stand still.`; //

const AboutSection = ({ activeGenre }: AboutSectionProps) => {
  const genreBlock =
    activeGenre && genreData[activeGenre] ? genreData[activeGenre] : null; //

  // Determine text colors based on activeGenre
  const headingTextColor = getHeadingTextColorClass(activeGenre); //
  const bodyTextColor = getBodyTextColorClass(activeGenre); //
  const genreTitleTextColor = getGenreTitleTextColorClass(activeGenre); //
  const highlightTextColor = getHighlightTextColorClass(activeGenre); //

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent"></div>
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ${headingTextColor}`}>
            The Sound Journey
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {/* GENRE TITLE - This is the new/updated part */}
            {genreBlock && (
              <h3 className={`text-4xl font-black mb-3 tracking-wide uppercase drop-shadow-lg ${genreTitleTextColor}`}>
                {genreBlock.name}
              </h3>
            )}
            {/* GENRE OR DEFAULT STORY */}
            <p className={`text-lg leading-relaxed ${genreBlock ? bodyTextColor : 'text-white'}`}>
              {genreBlock ? genreBlock.text : defaultText}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className={`flex items-center ${highlightTextColor}`}>
                <Music className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Genre-Bending</span>
              </div>
              <div className={`flex items-center ${highlightTextColor}`}>
                <Headphones className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Immersive Audio</span>
              </div>
              <div className={`flex items-center ${highlightTextColor}`}>
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Obsessive Attention</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl border border-gray-700 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center opacity-80">
                  <Music className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  400+ Tracks
                </h3>
                <p className="text-gray-400">Years of Creative Evolution</p>
              </div>
            </div>
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