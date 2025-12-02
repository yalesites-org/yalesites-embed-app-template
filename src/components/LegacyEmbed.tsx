import { useEffect, useRef, useState } from 'react';
import externalConfig, { isUsingPlaceholder } from '../config/externalConfig';

const MIN_HEIGHT = 320;

const sandboxValue = externalConfig.sandboxAllowList.join(' ');
const iframeSrc = `${import.meta.env.BASE_URL}external/${externalConfig.entryHtml}`;

type EmbedStatus = 'loading' | 'ready' | 'error';

const LegacyEmbed = (): JSX.Element => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [status, setStatus] = useState<EmbedStatus>('loading');
  const [iframeHeight, setIframeHeight] = useState<number>(
    Math.max(externalConfig.initialHeight, MIN_HEIGHT),
  );

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    let observer: ResizeObserver | null = null;
    let cancelled = false;

    const updateHeight = () => {
      if (!iframeRef.current) return;
      try {
        const contentDoc = iframeRef.current.contentDocument;
        if (!contentDoc) return;

        const bodyHeight = contentDoc.body?.scrollHeight ?? 0;
        const docHeight = contentDoc.documentElement?.scrollHeight ?? 0;
        const computedHeight = Math.max(bodyHeight, docHeight, MIN_HEIGHT);
        setIframeHeight(previous => (Math.abs(previous - computedHeight) > 1 ? computedHeight : previous));
      } catch (error) {
        console.warn('Unable to read iframe height:', error);
      }
    };

    const handleLoad = () => {
      if (cancelled) return;
      setStatus('ready');
      updateHeight();
      try {
        const contentDoc = iframe.contentDocument;
        const target = contentDoc?.body ?? contentDoc?.documentElement;
        if (!target || typeof ResizeObserver === 'undefined') return;
        observer = new ResizeObserver(() => updateHeight());
        observer.observe(target);
      } catch (error) {
        console.warn('ResizeObserver setup failed:', error);
      }
    };

    const handleError = () => {
      if (cancelled) return;
      setStatus('error');
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      cancelled = true;
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
      if (observer) {
        observer.disconnect();
      }
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

      <div className="embed-frame-wrapper">
        <iframe
          ref={iframeRef}
          title={externalConfig.iframeTitle}
          src={iframeSrc}
          sandbox={sandboxValue}
          style={{ width: '100%', border: 0, height: `${iframeHeight}px` }}
        />
      </div>
    </section>
  );
};

export default LegacyEmbed;
