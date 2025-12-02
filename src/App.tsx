import './App.css';
import LegacyEmbed from './components/LegacyEmbed';
import externalConfig from './config/externalConfig';

function App(): JSX.Element {
  return (
    <div className="container">
      <main className="main-content" aria-label={externalConfig.iframeTitle}>
        <LegacyEmbed />
      </main>
    </div>
  );
}

export default App;
