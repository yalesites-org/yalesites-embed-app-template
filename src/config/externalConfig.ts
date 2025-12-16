import rawConfig from '../../external.config.json';

export interface ExternalConfig {
  entryHtml: string;
  iframeTitle: string;
  initialHeight: number;
  useIframe: boolean;
  allowList: string[];
  cspDirectives?: Record<string, string>;
}

const DEFAULT_HEIGHT = 600;
const DEFAULT_SANDBOX = ['allow-scripts', 'allow-same-origin'];

function normalizeEntryHtml(value: unknown): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return 'placeholder.html';
}

function normalizeIframeTitle(value: unknown): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return 'Embedded Experience';
}

function normalizeHeight(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_HEIGHT;
}

function normalizeSandbox(value: unknown): string[] {
  if (Array.isArray(value)) {
    const tokens = value
      .map(token => (typeof token === 'string' ? token.trim() : ''))
      .filter(token => token.length > 0);
    if (tokens.length > 0) {
      return tokens;
    }
  }
  return DEFAULT_SANDBOX;
}

function normalizeUseIframe(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  return true; // Default to iframe mode for security
}

function normalizeCSPDirectives(value: unknown): Record<string, string> | undefined {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, string>;
  }
  return undefined;
}

const externalConfig: ExternalConfig = {
  entryHtml: normalizeEntryHtml((rawConfig as { entryHtml?: unknown }).entryHtml),
  iframeTitle: normalizeIframeTitle((rawConfig as { iframeTitle?: unknown }).iframeTitle),
  initialHeight: normalizeHeight((rawConfig as { initialHeight?: unknown }).initialHeight),
  useIframe: normalizeUseIframe((rawConfig as { useIframe?: unknown }).useIframe),
  allowList: normalizeSandbox((rawConfig as { allowList?: unknown }).allowList),
  cspDirectives: normalizeCSPDirectives((rawConfig as { cspDirectives?: unknown }).cspDirectives),
};

export const isUsingPlaceholder = externalConfig.entryHtml === 'placeholder.html';

export default externalConfig;
