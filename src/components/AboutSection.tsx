import { Music, Headphones, Zap } from "lucide-react";
import {
  getHeadingTextColorClass,
  getBodyTextColorClass,
  getGenreTitleTextColorClass,
  getHighlightTextColorClass
} from "@/utils/textColors";

type AboutSectionProps = {
  activeGenre?: string | null;
};

const genreData: Record<
  string,
  { name: string; text: string }
> = {
  "hip-hop": {
    name: "HIP HOP",
    text: `Always chasing that restless edge, OG Radio’s Hip-Hop station blends sharp lyricism with boundary-pushing beats. Fueled by hyperfocus and a taste for the unexpected, every track hits with attitude and late-night intensity. For restless minds and deep thinkers—welcome to the energy zone.`,
  },
  "electronic": {
    name: "ELECTRONIC / EDM",
    text: `These frequencies aren’t just for the dancefloor—they’re for insomniacs, daydreamers, and the future-seekers. Genre lines blur, synths sparkle, and every drop is engineered for maximum dopamine. ADHD-level attention to detail, always tuned for both the head and the heart.`,
  },
  "lofi": {
    name: "LO-FI",
    text: `For anyone who lives in their own head, here’s your sonic comfort zone. Fuzzy textures, sleepy grooves, and nostalgia-washed melodies designed for overthinkers and late-night grinders. Zone in, chill out, and let your mind wander.`,
  },
  "indie": {
    name: "INDIE",
    text: `The DIY spirit runs deep—these are anthems for outsiders, deep divers, and anyone who refuses to fit a template. High imagination, emotional depth, and unexpected turns. Hyperfocus in sound form, always evolving, never settling.`,
  },
  "ambient": {
    name: "AMBIENT",
    text: `Here, time slows down. Lush layers, glowing atmospheres, and melodies that float through your subconscious. Perfect for meditation, focus, or creative deep work. Every note crafted for hyper-present minds who want to lose track of time.`,
  },
  "trap": {
    name: "TRAP",
    text: `Built for adrenaline—fast, sharp, hypnotic. Bass-heavy, high-contrast, and made for the hyperactive mind. If you thrive in chaos and need a soundtrack for ambition, this station is your natural habitat.`,
  },
  "rnb": {
    name: "R&B",
    text: `Smooth, soulful, and intimate—this is the heart of OG Radio. Melodies to spark your feels and rhythms to keep you grooving. For sensitive spirits, romantics, and those who find poetry in every detail.`,
  },
  "rap": {
    name: "RAP",
    text: `No filter, no filler—just bars and pure story. Rap on OG Radio is smart, fast, and always original. If you love clever wordplay, emotional realness, and a restless creative spirit, this is your arena.`,
  },
  "jazz": {
    name: "JAZZ",
    text: `Sophisticated, free-flowing, and never predictable. Improvisation and detail for the high-IQ music explorer. If you want to get lost in harmonies and spontaneity, jazz here is where the journey never repeats.`,
  },
  "rock": {
    name: "ROCK",
    text: `Grit, heart, and a little bit of chaos. Rock on OG Radio brings the energy of live shows, rebellion, and catharsis. For the misfits, the passionate, and the eternally restless.`,
  },
  "experimental": {
    name: "EXPERIMENTAL",
    text: `Welcome to the sonic lab. Expect surprises, genre collisions, and ideas no algorithm can predict. For the true explorers and the never-bored, this is where boundaries don’t exist.`,
  },
};

const defaultText = `Every track on OG Radio is for those who live and breathe music: ADHD focus, restless curiosity, and a need for fresh energy. Each song is a product of endless curiosity, hyperactive creativity, and the need to make something different. This isn’t “just” music—it’s fuel for the digital age, a stream for content creators, and a soundtrack for anyone who refuses to stand still.`;

const AboutSection = ({ activeGenre }: AboutSectionProps) => {
  const genreBlock =
    activeGenre && genreData[activeGenre] ? genreData[activeGenre] : null;

  // --- Dynamic color classes
  const headingClass = getHeadingTextColorClass(activeGenre || null);
  const bodyClass = getBodyTextColorClass(activeGenre || null);
  const genreTitleClass = getGenreTitleTextColorClass(activeGenre || null);
  const highlightClass = getHighlightTextColorClass(activeGenre || null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Section Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent"></div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 ${headingClass}`}>
            The Sound Journey
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Story Content */}
          <div className="space-y-6">
            {/* GENRE TITLE */}
            {genreBlock && (
              <h3 className={`text-4xl font-black mb-3 tracking-wide uppercase drop-shadow-lg ${genreTitleClass}`}>
                {genreBlock.name}
              </h3>
            )}
            {/* GENRE OR DEFAULT STORY */}
            <p className={`text-lg leading-relaxed ${bodyClass}`}>
              {genreBlock ? genreBlock.text : defaultText}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className={`flex items-center ${highlightClass}`}>
                <Music className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Genre-Bending</span>
              </div>
              <div className={`flex items-center ${highlightClass}`}>
                <Headphones className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Immersive Audio</span>
              </div>
              <div className={`flex items-center ${highlightClass}`}>
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Obsessive Attention</span>
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
                <h3 className="text-2xl font-bold text-white mb-2">
                  400+ Tracks
                </h3>
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
