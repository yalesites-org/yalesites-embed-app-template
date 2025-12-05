import { useEffect, useRef, useState } from 'react';
import externalConfig, { isUsingPlaceholder } from '../config/externalConfig';

// Use absolute URL from homepage in production, relative URL in development
const baseUrl = import.meta.env.VITE_APP_HOMEPAGE
  ? `${import.meta.env.VITE_APP_HOMEPAGE}/`
  : import.meta.env.BASE_URL;
const htmlUrl = `${baseUrl}external/${externalConfig.entryHtml}`;

type EmbedStatus = 'loading' | 'ready' | 'error';

const LegacyEmbed = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<EmbedStatus>('loading');

  useEffect(() => {
    if (isUsingPlaceholder) {
      setStatus('ready');
      return;
    }

    let cancelled = false;

    const fetchAndInjectHTML = async () => {
      try {
        const response = await fetch(htmlUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch HTML: ${response.status}`);
        }

        const htmlText = await response.text();

        if (cancelled) return;

        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        if (!containerRef.current) return;

        // Extract and inject styles
        const styles = doc.querySelectorAll('style');
        styles.forEach(style => {
          const newStyle = document.createElement('style');
          newStyle.textContent = style.textContent;
          containerRef.current?.appendChild(newStyle);
        });

        // Extract and inject body content
        const bodyContent = doc.body.innerHTML;
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = bodyContent;
        containerRef.current?.appendChild(contentDiv);

        // Extract and execute scripts
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
          } else {
            newScript.textContent = script.textContent;
          }
          // Copy other attributes
          Array.from(script.attributes).forEach(attr => {
            if (attr.name !== 'src') {
              newScript.setAttribute(attr.name, attr.value);
            }
          });
          containerRef.current?.appendChild(newScript);
        });

        setStatus('ready');
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading external HTML:', error);
          setStatus('error');
        }
      }
    };

    fetchAndInjectHTML();

    return () => {
      cancelled = true;
    };
  }, []);

  const showStatus = isUsingPlaceholder || status !== 'ready';

  return (
    <section className="embed-panel" aria-label={externalConfig.iframeTitle}>
      {showStatus && (
        <div className="embed-callout" role="status" aria-live="polite">
          {isUsingPlaceholder ? (
            <p>
              Replace the placeholder HTML by running <code>npm run integrate</code> and selecting a legacy asset.
            </p>
          ) : status === 'loading' ? (
            <p>Loading embedded content…</p>
          ) : (
            <p>
              Unable to load the embedded content. Confirm the file referenced in <code>external.config.json</code> exists.
            </p>
          )}
        </div>
      )}

      <div ref={containerRef} className="embed-content-wrapper" />
    </section>
  );
};

export default LegacyEmbed;
