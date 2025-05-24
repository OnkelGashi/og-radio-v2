const fs = require("fs");
const path = require("path");

// Utility: Create dir recursively
function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Utility: Create file (with optional content)
function touch(file, content = "") {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content);
  }
}

const structure = {
  "public": ["placeholder.svg", "robots.txt"],
  "src": [
    "App.css", "App.tsx", "index.css", "main.tsx",
    { "components": [
      { "ui": [
        "accordion.tsx", "alert-dialog.tsx", "alert.tsx", "aspect-ratio.tsx",
        "avatar.tsx", "badge.tsx", "breadcrumb.tsx", "button.tsx", "calendar.tsx",
        "card.tsx", "carousel.tsx", "chart.tsx", "checkbox.tsx", "collapsible.tsx",
        "command.tsx", "context-menu.tsx", "dialog.tsx", "drawer.tsx",
        "dropdown-menu.tsx", "form.tsx", "hover-card.tsx", "input-otp.tsx",
        "input.tsx", "label.tsx", "menubar.tsx", "navigation-menu.tsx",
        "pagination.tsx", "popover.tsx", "progress.tsx", "radio-group.tsx",
        "resizable.tsx", "scroll-area.tsx", "select.tsx", "separator.tsx",
        "sheet.tsx", "sidebar.tsx", "skeleton.tsx", "slider.tsx", "sonner.tsx",
        "switch.tsx", "table.tsx", "tabs.tsx", "textarea.tsx", "toast.tsx",
        "toaster.tsx", "toggle-group.tsx", "toggle.tsx", "tooltip.tsx", "use-toast.ts"
      ]},
      "AboutSection.tsx",
      "GenreStations.tsx",
      "Hero.tsx",
      "NowPlaying.tsx",
      "OnkelGashiPicks.tsx",
      "PlaylistShowcase.tsx",
      "SocialFooter.tsx",
      "StreamSchedule.tsx"
    ]},
    { "hooks": [
      "use-mobile.tsx", "use-toast.ts"
    ]},
    { "lib": [
      "utils.ts"
    ]},
    { "pages": [
      "Index.tsx", "NotFound.tsx"
    ]}
  ],
  ".gitignore": "",
  "components.json": "",
  "eslint.config.js": "",
  "index.html": "",
  "package.json": "",
  "postcss.config.js": "",
  "README.md": "",
  "tailwind.config.ts": "",
  "tsconfig.app.json": "",
  "tsconfig.json": "",
  "tsconfig.node.json": "",
  "vite.config.ts": ""
};

function build(root, obj) {
  Object.entries(obj).forEach(([key, val]) => {
    const fullPath = path.join(root, key);
    if (Array.isArray(val)) {
      mkdir(fullPath);
      val.forEach((entry) => {
        if (typeof entry === "string") {
          // .tsx files get a minimal export by default
          let content = "";
          if (entry.endsWith(".tsx")) {
            const comp = path.basename(entry, ".tsx");
            content = `export default function ${comp}() { return <div>${comp}</div>; }\n`;
          }
          if (entry.endsWith(".ts")) {
            content = `// ${entry}\n`;
          }
          touch(path.join(fullPath, entry), content);
        } else if (typeof entry === "object") {
          build(fullPath, entry);
        }
      });
    } else {
      // root files
      touch(fullPath, val);
    }
  });
}

build(process.cwd(), structure);

console.log("✅ OG Radio folder structure created!");
