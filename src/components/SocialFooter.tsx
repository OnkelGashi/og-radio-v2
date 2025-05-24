import { Youtube, Music, Users, MessageCircle, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const SocialFooter = () => {
  const socialLinks = [
    {
      name: "YouTube",
      icon: Youtube,
      url: "#",
      color: "hover:text-red-400"
    },
    {
      name: "TikTok",
      icon: Music,
      url: "#",
      color: "hover:text-pink-400"
    },
    {
      name: "Twitch",
      icon: Users,
      url: "#",
      color: "hover:text-purple-400"
    },
    {
      name: "Discord",
      icon: MessageCircle,
      url: "#",
      color: "hover:text-indigo-400"
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "#",
      color: "hover:text-pink-400"
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "#",
      color: "hover:text-blue-400"
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

  return (
    <footer className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
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
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                variant="outline"
                size="lg"
                asChild
                className={`border-gray-700 text-gray-400 ${social.color} hover:bg-gray-800 transition-all duration-300 group`}
              >
                <a href={social.url} target="_blank" rel="noopener noreferrer">
                  <social.icon className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                  {social.name}
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Social Feed Preview */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Recent Activity</h3>
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
              <h3 className="text-xl font-bold text-white mb-2">OnkelGashi Music Radio</h3>
              <p className="text-gray-400 text-sm">Where underground meets the future</p>
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
};

export default SocialFooter;
