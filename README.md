# High/Low

A tool to help you start meaningful conversations through thoughtful prompts.

High/Low is built with [Astro](https://astro.build) and features a collection of conversation starters designed to spark deeper connections and interesting discussions. Whether you're looking to break the ice, reconnect with friends, or explore new perspectives, these prompts can help guide meaningful conversations.

## ✨ Features

- Curated collection of conversation prompts
- Random prompt generator for spontaneous discussions
- Clean, accessible interface
- Fast, static-site performance with Astro

## 🤝 Contributing

This is an open source project! We welcome contributions, especially new prompts. If you have conversation starters you'd love to share:

1. Fork this repository
2. Add your prompt as a new `.md` file in `src/content/prompts/`
3. Follow the existing format and naming convention
4. Submit a pull request

Your prompts should be thoughtful, inclusive, and designed to encourage meaningful dialogue.

## 🚀 Project Structure

Inside of this Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   ├── components/        # Astro components
│   ├── content/
│   │   └── prompts/       # Conversation prompt markdown files
│   ├── pages/
│   │   ├── prompt/        # Dynamic prompt pages
│   │   └── index.astro    # Homepage
│   └── style/             # Global styles
└── package.json
```

Prompts are stored as markdown files in `src/content/prompts/`. Each prompt is exposed as a route and can be accessed individually or through the random prompt generator.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`                 | Starts local dev server at `localhost:4321`      |
| `bun build`               | Build your production site to `./dist/`          |
| `bun preview`             | Preview your build locally, before deploying     |
| `bun astro ...`           | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help`     | Get help using the Astro CLI                     |

## Shout out

Thank you to Sonnet 4 for helping me to write this so much faster than I would have otherwise. 🦾
