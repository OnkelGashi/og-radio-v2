# OnkelGashi Radio

OnkelGashi Radio is a modern, web-based radio station application that streams a curated selection of genre-bending tracks. Built with React, TypeScript, Vite, and Tailwind CSS, it offers a visually engaging and interactive audio experience.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [Setup & Local Development](#setup--local-development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Custom Domain](#custom-domain)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

OnkelGashi Radio delivers a unique digital soundscape, streaming 400+ tracks across genres like electronic, rap, R&B, indie, and ambient. The app features a dynamic hero section, genre-based theming, and a welcoming audio experience for new visitors.

---

## Features

- **Live Streaming:** 24/7 curated music stream.
- **Genre Selection:** Explore multiple genres with themed visuals.
- **Animated UI:** Gradient backgrounds, animated stars, and waveforms.
- **Welcome Audio:** Plays an intro sound on entry.
- **Responsive Design:** Optimized for desktop and mobile.
- **Accessible UI:** Keyboard and screen reader friendly.

---

## Folder Structure

```
├── public/                  # Static assets (audio, images, etc.)
│   ├── audio/
│   ├── placeholder.svg
│   └── robots.txt
├── OGRadioFiles/            # Song details and related data
│   └── SONGDETAILS/
├── src/                     # Source code
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── assets/
│   ├── components/          # React components (Hero, AboutSection, etc.)
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── stores/
│   └── utils/
├── index.html               # Main HTML entry point
├── package.json             # Project metadata and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
├── tsconfig*.json           # TypeScript configuration
└── README.md                # Project documentation
```

---

## Technologies Used

- **React**: UI library for building interactive interfaces.
- **TypeScript**: Static typing for safer code.
- **Vite**: Fast development server and build tool.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: Reusable UI components.
- **Lucide Icons**: Icon set for React.

---

## Setup & Local Development

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_REPOSITORY_URL>
    cd <YOUR_PROJECT_NAME>
    ```
2. **Install dependencies:**
    ```sh
    npm install
    ```
3. **Start the development server:**
    ```sh
    npm run dev
    ```
    The app will be available at [http://localhost:8080](http://localhost:8080) (see `vite.config.ts`).

---

## Building for Production

To create an optimized build:

```sh
npm run build
```

The output will be in the `dist` folder.

---

## Deployment

Deploy the contents of `dist` to your preferred static hosting provider:

- Vercel
- Netlify
- GitHub Pages
- AWS Amplify, Firebase Hosting, Azure Static Web Apps, etc.

---

## Custom Domain

Most hosting platforms allow you to connect a custom domain. Refer to your provider's documentation for details.

---

## Contributing

Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

---

## License

[MIT](LICENSE) (or specify your license here)

---