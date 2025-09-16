import { useState } from 'react';
import './App.css';

function App(): JSX.Element {
  const [message, setMessage] = useState<string>('Hello World!');
  const [count, setCount] = useState<number>(0);

  const handleButtonClick = () => {
    setCount(count + 1);
    setMessage(`Button clicked ${count + 1} time${count + 1 === 1 ? '' : 's'}!`);
  };

  return (
    <div className='container'>
      {/* Main Content */}
      <main className='main-content' aria-labelledby="main-heading">
        <h1 id="main-heading">{'{{APP_TITLE}}'}</h1>
        
        <div className='message-display' role="status" aria-live="polite">
          <p className='message'>{message}</p>
        </div>

        <div className='interaction-section'>
          <button 
            type="button"
            className='action-button'
            onClick={handleButtonClick}
            aria-describedby="button-description"
          >
            Click Me!
          </button>
          <p id="button-description" className='sr-only'>
            Clicking this button will increment the counter and update the message above
          </p>
        </div>

        <div className='info-section'>
          <h2>Template Features</h2>
          <ul>
            <li>✅ React + TypeScript + Vite</li>
            <li>✅ GitHub Pages deployment ready</li>
            <li>✅ WCAG 2.1 AA accessible</li>
            <li>✅ Proper mount point configuration</li>
            <li>✅ YaleSites embed integration</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;