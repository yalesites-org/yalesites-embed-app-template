import { useEffect, useRef, useState } from 'react';
import externalConfig, { isUsingPlaceholder } from '../config/externalConfig';

// Use absolute URL from homepage in production, relative URL in development
const baseUrl = import.meta.env.VITE_APP_HOMEPAGE
  ? `${import.meta.env.VITE_APP_HOMEPAGE}/`
  : import.meta.env.BASE_URL;
const htmlUrl = `${baseUrl}external/${externalConfig.entryHtml}`;

// Safe script attributes that can be copied without XSS risk
// Excludes event handlers (onerror, onload, etc.) that could execute arbitrary code
const SAFE_SCRIPT_ATTRS = ['type', 'async', 'defer', 'crossorigin', 'nomodule', 'referrerpolicy'];

type EmbedStatus = 'loading' | 'ready' | 'error';

const LegacyEmbed = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [status, setStatus] = useState<EmbedStatus>('loading');
  const iframeHeight = externalConfig.initialHeight || 600;

  useEffect(() => {
    if (isUsingPlaceholder) {
      setStatus('ready');
      return;
    }

    // If using iframe mode, let the iframe load event handle status
    if (externalConfig.useIframe) {
      return;
    }

    // Direct injection mode - inject CSP and load HTML
    let cancelled = false;

    const injectCSP = () => {
      if (!externalConfig.cspDirectives) return;

      const cspContent = Object.entries(externalConfig.cspDirectives)
        .map(([directive, value]) => `${directive} ${value}`)
        .join('; ');

      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = cspContent;
      document.head.appendChild(meta);
    };

    const fetchAndInjectHTML = async () => {
      try {
        // Inject CSP before loading any external content
        injectCSP();

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
        // WARNING: CSS injection assumes trusted content only (use iframe mode for untrusted content)
        // Malicious CSS could use @import or background-image URLs for data exfiltration
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
        // WARNING: Direct script injection assumes trusted content only (use iframe mode for untrusted content)
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
          } else {
            // Injecting script content directly - only safe for trusted HTML sources
            newScript.textContent = script.textContent;
          }
          // Copy only safe attributes (not onerror, onload, etc.)
          Array.from(script.attributes).forEach(attr => {
            if (SAFE_SCRIPT_ATTRS.includes(attr.name.toLowerCase())) {
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

  const handleIframeLoad = () => {
    setStatus('ready');
  };

  const handleIframeError = () => {
    setStatus('error');
  };

  const showStatus = isUsingPlaceholder || status !== 'ready';

  // Build sandbox attribute from allowList
  const sandboxValue = externalConfig.allowList ? externalConfig.allowList.join(' ') : undefined;

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

      {externalConfig.useIframe && !isUsingPlaceholder ? (
        <iframe
          ref={iframeRef}
          src={htmlUrl}
          title={externalConfig.iframeTitle}
          sandbox={sandboxValue}
          style={{
            width: '100%',
            height: `${iframeHeight}px`,
            border: 'none',
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      ) : (
        <div ref={containerRef} className="embed-content-wrapper" />
      )}
    </section>
  );
};

export default LegacyEmbed;
