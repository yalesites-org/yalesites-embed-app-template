import './App.css';
import LegacyEmbed from './components/LegacyEmbed';
import externalConfig from './config/externalConfig';

function App(): JSX.Element {
  return (
    <div className="container">
      <main className="main-content" aria-labelledby="main-heading">
        <h1 id="main-heading">{externalConfig.iframeTitle}</h1>
        <p className="main-description">
          This wrapper surfaces legacy HTML and JavaScript so the experience can ship through YaleSites embeds without conversion.
        </p>
        <LegacyEmbed />
      </main>
    </div>
  );
}

export default App;
