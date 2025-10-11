# HighLow

A conversation prompts app that helps you have better and deeper conversations. Get thought-provoking questions that range from lighthearted and fun to deeper and more reflective topics.

Perfect for dates, family dinners, road trips, team building, or any time you want to go beyond small talk.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for blazing fast development
- **Bun** for package management
- Custom CSS (no frameworks)
- Deployed on AWS Amplify

## Development

### Prerequisites

- [Bun](https://bun.sh) installed

### Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview
```

The app will be available at `http://localhost:5173`

### Project Structure

```
src/
├── components/     # React components
├── data/          # Prompt data
├── hooks/         # Custom React hooks
├── models/        # TypeScript types
└── routes/        # Route components
```

## Deployment

The app is deployed to AWS Amplify with automatic deployments on every push to `main`.

See [`tf/README.md`](./tf/README.md) for Terraform deployment documentation.

## Contributing

This is a personal project, but feel free to fork it and make it your own!

---

Made with 😂 by [rewdy](https://rewdy.lol)
