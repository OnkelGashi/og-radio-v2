import { Youtube, Twitch, MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- TikTok SVG ICON (since Lucide doesn't include it) ---
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M22.4 4v3.2c1.3 1.3 2.7 2 4.4 2.2V13c-2.6-.1-4.9-.8-6.7-2.4V21c0 4.2-3.4 7.6-7.6 7.6S5 25.2 5 21c0-4.2 3.4-7.6 7.6-7.6c.2 0 .4 0 .6.1v4.3c-.2-.1-.4-.1-.6-.1c-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3 3.3-1.5 3.3-3.3V2h4.4c.1.8.3 1.6.7 2.4z" />
  </svg>
);

const socialLinks = [
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://www.youtube.com/@OnkelGashiMusic",
    color: "hover:text-red-500"
  },
  {
    name: "TikTok",
    icon: TikTokIcon,
    url: "https://www.tiktok.com/@OnkelGashi",
    color: "hover:text-black dark:hover:text-white"
  },
  {
    name: "Twitch",
    icon: Twitch,
    url: "https://www.twitch.tv/OnkelGashi",
    color: "hover:text-purple-400"
  },
  {
    name: "Discord",
    icon: MessageCircle,
    url: "https://discord.gg/zsXM4w4B69",
    color: "hover:text-indigo-300"
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/OnkelGashi",
    color: "hover:text-pink-400"
  }
];

const recentActivity = [
  {
    platform: "Twitch",
    content: "🔥 New track premiere tonight at midnight! Who's ready for some deep frequencies?",
    time: "2h ago"
  },
  {
    platform: "TikTok",
    content: "Behind the scenes: Creating 'Digital Dreams' in 30 seconds ✨",
    time: "5h ago"
  },
  {
    platform: "YouTube",
    content: "Producer breakdown: How I made 'Underground Pulse' with just 3 plugins",
    time: "1d ago"
  }
];

const SocialFooter = () => (
  <footer className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-800 bg-[#0b0e17]/95">
    <div className="max-w-6xl mx-auto">
      {/* Listen Anywhere Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Listen Anywhere
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Join the community across all platforms. Connect, share, and discover new sounds together.
        </p>

        {/* Social Icons */}
        <div className="flex flex-wrap justify-center gap-5 mb-12">
          {socialLinks.map((social) => (
            <Button
              key={social.name}
              variant="outline"
              size="lg"
              asChild
              className={`border-gray-700 text-black ${social.color} hover:bg-gray-800 transition-all duration-300 group rounded-full px-6 py-3 font-semibold`}
            >
              <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                <social.icon className="w-7 h-7 mr-2 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">{social.name}</span>
              </a>
            </Button>
          ))}
        </div>
      </div>

      {/* Social Feed Preview */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-black mb-8 text-center">Recent Activity</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {recentActivity.map((activity, index) => (
            <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-cyan-400 font-medium text-sm">{activity.platform}</span>
                <span className="text-gray-500 text-xs">{activity.time}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{activity.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center border-t border-gray-800 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-xl font-bold text-white mb-2">OnkelGashi RADIO</h3>
            <p className="text-gray-400 text-sm">Where Love meets the future</p>
          </div>
          <div className="text-gray-500 text-sm">
            <p>&copy; 2024 OnkelGashi. All rights reserved.</p>
            <p className="mt-1">Streaming 24/7 • 400+ Original Tracks</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default SocialFooter;
