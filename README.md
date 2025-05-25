# OnkelGashi Radio

Welcome to the OnkelGashi Radio project! This is a web-based radio station application designed to deliver a unique audio experience.

## Project Setup & Local Development

To get this project up and running on your local machine, follow these steps.

**Prerequisites:**

* Node.js (LTS version recommended)
* npm (comes with Node.js) or yarn

You can use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm#installing-and-updating) to manage Node.js versions.

**Installation & Running Locally:**

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_REPOSITORY_URL>
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd <YOUR_PROJECT_NAME> # e.g., cd OGRadio
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```
    (or `yarn install` if you prefer yarn)
4.  **Start the development server:**
    ```sh
    npm run dev
    ```
    This will start the Vite development server, typically available at `http://localhost:8080` (as per your `vite.config.ts`). The site will auto-reload when you make changes to the code.

## Editing the Code

You can edit this project using several methods:

* **Your Preferred IDE (Recommended):**
    * Open the cloned project folder in your favorite code editor (like VS Code, WebStorm, etc.).
    * Make your changes, and the development server (if running via `npm run dev`) will reflect them instantly.
    * Commit and push your changes to your Git repository.

* **Edit a file directly in GitHub:**
    * Navigate to the desired file(s) in your GitHub repository.
    * Click the "Edit" button (pencil icon).
    * Make your changes and commit them directly to the repository.

* **Use GitHub Codespaces:**
    * From your repository's main page on GitHub, click the "Code" button.
    * Select the "Codespaces" tab and create a new codespace.
    * This provides a full development environment in your browser where you can edit, run, and commit your changes.

## Technologies Used

This project is built with a modern web stack:

* **Vite:** Fast build tool and development server.
* **TypeScript:** For static typing and improved code quality.
* **React:** A JavaScript library for building user interfaces.
* **shadcn/ui:** A collection of re-usable UI components.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

## Building for Production

To create an optimized production build of the application:

```sh
npm run build
```

This command will generate static assets in the `dist` folder, which can then be deployed.

## Deployment

You can deploy this Vite-based React application to various hosting platforms. Some popular choices include:

* Vercel
* Netlify
* GitHub Pages (for static SPAs)
* AWS Amplify, Google Firebase Hosting, Azure Static Web Apps, etc.

Typically, you would connect your Git repository to one of these services. They can then automatically build and deploy your site whenever you push changes to your main branch.

## Connecting a Custom Domain

Most hosting platforms (like Vercel, Netlify, etc.) allow you to connect a custom domain to your deployed project. Please refer to the documentation of your chosen hosting provider for specific instructions on how to set this up.

---

Remember to replace `<YOUR_GIT_REPOSITORY_URL>` and `<YOUR_PROJECT_NAME>` with your actual project details.

Let me know if you'd like any adjustments to this README or if you're ready to dive into specific enhancements for OnkelGashi Radio!