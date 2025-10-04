import { Link } from "react-router";
import { prompts } from "~/data/prompts";
import "./home.css";

export function meta() {
  return [
    { title: "High/Low - Better Conversations" },
    {
      name: "description",
      content:
        "High/low is a tool to help you have better, more meaningful conversations.",
    },
  ];
}

/**
 * Landing page for the High/Low conversation prompts app
 */
export default function Home() {
  // Get a random prompt ID to link to
  const randomPromptId = prompts[Math.floor(Math.random() * prompts.length)].id;

  return (
    <div className="home">
      <div className="home__content">
        <h1 className="home__title">
          <span className="home__title-high">high</span>
          <span className="home__title-slash">/</span>
          <span className="home__title-low">low</span>
        </h1>

        <p className="home__subtitle">
          Welcome! High/low is a tool to help you have <b>better</b>, more
          meaningful conversations.
        </p>

        <div>
          <Link to={`/prompt/${randomPromptId}`} className="home__cta">
            Let's talk
          </Link>
        </div>
      </div>

      <footer className="home__footer">
        Made with 😂 by <a href="https://www.rewdy.lol">rewdy</a>.
      </footer>
    </div>
  );
}
