# High/Low

A conversation prompts app designed to help you have better, deeper conversations. High/Low presents thought-provoking questions that range from light-hearted and fun to deeper and more reflective topics, perfect for breaking the ice or sparking meaningful dialogue.

## Features

- 🗣️ Curated conversation prompts across multiple categories
- 📱 Swipe-based interface for easy navigation
- 🎨 Beautiful gradient-based UI with smooth animations
- 🚀 Server-side rendering for fast initial loads
- ⚡️ Hot Module Replacement (HMR) for development
- 🔒 TypeScript for type safety
- � Custom CSS (no framework bloat)

## Tech Stack

- **React Router v7** - Full-stack framework with SSR
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Bun** - Fast package management and runtime
- **Custom CSS** - No Tailwind, just clean custom styles
- **Vite** - Fast build tooling

## Getting Started

### Installation

Install the dependencies:

```bash
bun install
```

### Development

Start the development server with HMR:

```bash
bun run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
bun run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `bun run build`

```
├── package.json
├── bun.lockb
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Project Structure

```
app/
├── components/     # Reusable React components
├── data/          # Static data (prompts)
├── hooks/         # Custom React hooks
├── models/        # TypeScript type definitions
├── prompts/       # Individual prompt markdown files
└── routes/        # React Router routes
```

---

Made with 😂 by [rewdy](https://www.rewdy.lol) (and Claude Sonnet 4.5!)
