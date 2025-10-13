import { Route, Switch } from "wouter";
import "./App.css";
import { SettingsProvider } from "./components/SettingsContext";
import { Home } from "./routes/Home";
import { RandomPromptRoute } from "./routes/RandomPrompt";
import { PromptRoute } from "./routes/ViewPrompt";

/**
 * Main app with basic routing using wouter
 */
export const App = () => {
  return (
    <div className="App">
      <SettingsProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/prompt/:id" component={PromptRoute} />
          <Route path="/prompt/random" component={RandomPromptRoute} />
        </Switch>
      </SettingsProvider>
    </div>
  );
};
