# YaleSites Embed App Template

## Project Overview

This is a template for building single-page React applications that get embedded into YaleSites via the `ys_embed` module. Applications built from this template are deployed to GitHub Pages and their JS/CSS are loaded directly into the host YaleSites Drupal page (not in an iframe). The module injects `<script>`, `<link>`, and a `<div id="repo-name">` container into the page, and the React app mounts to that container.

The target audience is developers (including AI-assisted "vibe coders") building small, focused tools and interactive experiences for Yale websites. Every application must look and feel like it belongs on a Yale website, meet accessibility requirements, and never store or expose sensitive information.

### Embed Context

Your application runs inside an existing YaleSites page that already has:
- A page `<header>` with Yale branding and navigation
- A `<main>` content area (your app lives somewhere within this)
- A page `<footer>`
- Global theme CSS custom properties
- Yale web fonts loaded by the host page

Your app receives a single `<div id="repo-name"></div>` container. Do not add page-level landmarks (`<header>`, `<footer>`, `<main>`, `<nav>`) that duplicate the host page structure. Use `<section>`, `<article>`, `<form>`, `<div>`, or other appropriate elements within your container. If your app has its own internal navigation, use `<nav aria-label="App Name navigation">` with a descriptive label to distinguish it from the site-level nav.

## Critical Build Requirements

These requirements are non-negotiable. The YaleSites embed system will not load your application if any are violated.

- **Mount point ID** in `src/main.tsx` must exactly match the repository name (kebab-case)
- **Build output** must produce exactly `assets/app.js` and `assets/app.css` in `dist/`
- **Base path** in `vite.config.ts` must be `'/repo-name/'` matching the repository name
- **Asset filenames** must be fixed (no content hashes) via `rollupOptions.output`
- Files must be in the `assets/` subdirectory; the embed system regex ignores root-level files
- Repository must be in the `yalesites-org` GitHub organization

The embed system template (from `GitHubApplet.php`) injects:
```html
<script type="module" crossorigin src="https://yalesites-org.github.io/{repo_name}/assets/app.js"></script>
<link rel="stylesheet" crossorigin href="https://yalesites-org.github.io/{repo_name}/assets/app.css">
<div id="{repo_name}"></div>
```

See the [GitHub Pages Development Guide](https://github.com/yalesites-org/yalesites-project/blob/develop/web/profiles/custom/yalesites_profile/modules/custom/ys_embed/GITHUB_PAGES_DEVELOPMENT_GUIDE.md) for full integration details.

## Yale Design System

All applications must follow Yale's visual identity. Use the design tokens from [`@yalesites-org/tokens`](https://github.com/yalesites-org/tokens) and patterns from [`component-library-twig`](https://github.com/yalesites-org/component-library-twig).

Since embed apps are standalone React builds (not Twig/SCSS within the component library), replicate the token values as CSS custom properties in your stylesheets. Do not invent your own color palette, typography, or spacing scale.

Because your app's CSS is loaded directly into the host page, scope all your styles to your app's container to avoid leaking styles into the surrounding YaleSites page.

### Style Scoping (Mandatory)

**Every CSS rule must be scoped to the app's `#repo-name` container.** Your app's CSS loads directly into the YaleSites page DOM. Any unscoped styles will modify the host page's header, footer, navigation, and other content. This is unacceptable.

Do not write bare element selectors (`h2 { ... }`, `a { ... }`, `button { ... }`). Do not write bare class selectors (`.card { ... }`). Do not write global resets or `* { ... }` selectors. Everything must be nested under your container ID.

```css
/* CORRECT - all styles scoped to container */
#my-app-name {
  font: 400 var(--font-size-body-default)/1.7 var(--font-body);
  color: var(--color-text);
}

#my-app-name h2 {
  font: 400 var(--font-size-h2)/1.1 var(--font-heading);
  color: var(--color-heading);
}

#my-app-name a {
  color: var(--color-link-base);
  text-decoration: underline;
}

#my-app-name .myapp-button {
  /* button styles */
}

/* WRONG - these will break the host page */
h2 { font-size: 2rem; }
a { color: blue; }
* { box-sizing: border-box; }
.card { padding: 1rem; }
```

In CSS files, use nesting or prefix every rule with `#repo-name`. In CSS Modules or styled-components, the scoping is automatic but still verify the build output does not emit unscoped rules.

### Color Palette

Use only these Yale colors. The primary theme is "Old Blues" (Global Theme One).

```css
/* Primary */
--color-blue-yale: #00356b;       /* Yale Blue - primary brand, primary actions */
--color-blue-medium: #286dc0;     /* Medium blue - link base color, secondary actions */
--color-blue-light: #63aaff;      /* Light blue - accents, hover states on dark backgrounds */

/* Neutrals */
--color-basic-white: #ffffff;
--color-basic-black: #000000;
--color-gray-100: #f7f7f7;       /* Light backgrounds */
--color-gray-200: #d9d9d9;       /* Borders, dividers */
--color-gray-300: #bababa;
--color-gray-500: #757575;       /* Muted text (check contrast first) */
--color-gray-700: #4a4a4a;       /* Body text */
--color-gray-800: #222222;       /* Headings, strong text */
--color-gray-900: #1b1b1b;

/* Extended palette (use sparingly for accents) */
--color-blue-royal: #375597;
--color-blue-slate: #475b5e;
--color-blue-oceanic: #346f6a;
--color-blue-pewter: #b6c9ca;
--color-blue-soft: #e7f1f7;
--color-yellow-yale-gold: #ffd55a;
--color-orange-coral: #ff6654;

/* Functional colors */
--color-link-base: #286dc0;      /* Default link color (blue medium) */
--color-link-hover: #4a4a4a;     /* Link hover (gray 700) */
--color-link-visited: #4c2c92;   /* Visited links */
--color-background: #ffffff;     /* Page background */
--color-text: #4a4a4a;           /* Body text (gray 700) */
--color-heading: #222222;        /* Heading text (gray 800) */
```

### Semantic Color Usage

| Element | Color | Hex |
|---------|-------|-----|
| Body text | gray-700 | `#4a4a4a` |
| Headings | gray-800 | `#222222` |
| Links | blue-medium | `#286dc0` |
| Link hover | gray-700 | `#4a4a4a` |
| Primary button bg | blue-yale | `#00356b` |
| Primary button text | white | `#ffffff` |
| Primary button hover bg | transparent with blue-yale border | |
| Page background | white | `#ffffff` |
| Section alt background | gray-100 | `#f7f7f7` |
| Borders/dividers | gray-200 | `#d9d9d9` |
| Focus outline | blue-medium | `#286dc0` |
| Error states | orange-coral | `#ff6654` |

### Typography

Yale uses two proprietary font families (YaleNew for headings, Mallory Compact for body). The host YaleSites page loads these fonts, so they are available to your embedded app. Define your font stacks with Yale fonts first and system fallbacks:

```css
/* For headings (YaleNew with serif fallback) */
--font-heading: YaleNew, Georgia, 'Times New Roman', serif;

/* For body text (Mallory Compact with sans-serif fallback) */
--font-body: 'Mallory Compact', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
```

#### Type Scale (fluid, using clamp)

Replicate Yale's fluid type scale. Sizes interpolate between 576px and 1400px viewport widths.

```css
/* Headings */
--font-size-h1: clamp(2.6875rem, calc(2.32vw + 1.8574rem), 3.875rem);    /* 43px - 62px */
--font-size-h2: clamp(2.25rem, calc(1.94vw + 1.551rem), 3.25rem);        /* 36px - 52px */
--font-size-h3: clamp(1.8125rem, calc(1.46vw + 1.2882rem), 2.5625rem);   /* 29px - 41px */
--font-size-h4: clamp(1.5rem, calc(0.73vw + 1.2379rem), 1.875rem);       /* 24px - 30px */
--font-size-h5: clamp(1.3125rem, calc(0.49vw + 1.1377rem), 1.5625rem);   /* 21px - 25px */
--font-size-h6: clamp(1rem, calc(0.36vw + 0.8689rem), 1.1875rem);        /* 16px - 19px */

/* Body */
--font-size-body-default: clamp(1.0625rem, calc(0.36vw + 0.9314rem), 1.25rem);  /* 17px - 20px */
--font-size-body-small: clamp(0.9375rem, calc(0.12vw + 0.8938rem), 1rem);       /* 15px - 16px */
--font-size-body-xs: clamp(0.8125rem, calc(0.12vw + 0.7688rem), 0.875rem);      /* 13px - 14px */
```

#### Heading Styles

All heading styles must be scoped to your container:

```css
#my-app-name h2 { font: 400 var(--font-size-h2)/1.1 var(--font-heading); color: var(--color-heading); }
#my-app-name h3 { font: 400 var(--font-size-h3)/1.14 var(--font-heading); color: var(--color-heading); }
#my-app-name h4 { font: 400 var(--font-size-h4)/1.14 var(--font-heading); color: var(--color-heading); }
#my-app-name h5 { font: 400 var(--font-size-h5)/1.14 var(--font-heading); color: var(--color-heading); }
#my-app-name h6 { font: 400 var(--font-size-h6)/1.05 var(--font-heading); color: var(--color-heading); text-transform: uppercase; }
```

#### Body Text

```css
#my-app-name {
  font: 400 var(--font-size-body-default)/1.7 var(--font-body);
  color: var(--color-text);
}
```

### Spacing Scale

Use this scale exclusively. Values are in rem (base 16px). Do not use arbitrary pixel values.

```css
--spacing-0: 0;
--spacing-1: 0.125rem;   /* 2px */
--spacing-2: 0.25rem;    /* 4px */
--spacing-3: 0.5rem;     /* 8px */
--spacing-4: 0.75rem;    /* 12px */
--spacing-5: 1rem;       /* 16px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-7: 2rem;       /* 32px */
--spacing-8: 2.5rem;     /* 40px */
--spacing-9: 3rem;       /* 48px */
--spacing-10: 4rem;      /* 64px */
--spacing-11: 5rem;      /* 80px */
--spacing-12: 6rem;      /* 96px */
--spacing-13: 10rem;     /* 160px */
```

### Breakpoints

```css
--break-s: 576px;
--break-m: 768px;
--break-l: 992px;     /* Mobile/desktop threshold */
--break-xl: 1200px;
--break-2xl: 1400px;
```

### Layout

Your app lives within the YaleSites page content area. The host page handles site-level gutters and max-width. Your app should be responsive within its container.

```css
/* Max content widths if needed for internal layout */
--width-content: 56rem;     /* Narrow content column */
```

### Interactive Elements

#### Buttons (CTA Pattern)

Follow the YaleSites CTA component pattern:

```css
#my-app-name .myapp-button-primary {
  border: 0.125rem solid var(--color-blue-yale);
  border-radius: 0;                          /* Yale uses square buttons by default */
  background-color: var(--color-blue-yale);
  color: var(--color-basic-white);
  font-weight: 500;                          /* Mallory Medium weight */
  padding: 0.5rem 1.5rem;
  text-decoration: none;
  text-align: center;
  min-height: 2.75rem;                       /* Minimum click target */
  cursor: pointer;
}

#my-app-name .myapp-button-primary:hover {
  background-color: transparent;
  color: var(--color-blue-yale);
}

#my-app-name .myapp-button-secondary {  /* Outline style */
  border: 0.125rem solid var(--color-blue-yale);
  background-color: transparent;
  color: var(--color-blue-yale);
  /* ... same padding/sizing as primary */
}

#my-app-name .myapp-button-secondary:hover {
  background-color: var(--color-blue-yale);
  color: var(--color-basic-white);
}
```

#### Links

```css
#my-app-name a {
  color: var(--color-link-base);  /* #286dc0 */
  text-decoration: underline;
  text-decoration-thickness: 0.125rem;
}

#my-app-name a:hover {
  color: var(--color-link-hover);  /* #4a4a4a */
}

#my-app-name a:visited {
  color: var(--color-link-visited);  /* #4c2c92 */
}
```

#### Focus Indicators

All interactive elements must have visible focus indicators:

```css
#my-app-name *:focus-visible {
  outline: 0.125rem solid var(--color-link-base);
  outline-offset: 0.125rem;
}

#my-app-name *:focus:not(:focus-visible) {
  outline: none;
}
```

#### Form Elements

- All inputs must have visible labels (not just placeholders)
- Use `aria-describedby` to link help text or error messages
- Minimum click/touch target: `2.75rem` (44px)
- Error states: use `--color-orange-coral` for error borders/text
- Group related fields with `<fieldset>` and `<legend>`

### Animation

Respect `prefers-reduced-motion`. All animations must be wrapped:

```css
@media (prefers-reduced-motion: no-preference) {
  #my-app-name .myapp-element {
    transition: property 200ms ease-in-out;
  }
}
```

Animation speeds: `200ms` (default), `500ms` (medium), `800ms` (slow).

### Border and Radius

```css
--border-thickness-hairline: 0.03125rem;  /* 0.5px */
--border-thickness-1: 0.0625rem;          /* 1px */
--border-thickness-2: 0.125rem;           /* 2px */
--border-thickness-4: 0.25rem;            /* 4px */

--radius-0: 0;
--radius-4: 0.25rem;
--radius-10: 0.625rem;
--radius-20: 1.25rem;
```

### Screen Reader Utilities

```css
#my-app-name .sr-only {
  position: absolute !important;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  height: 1px;
  width: 1px;
  word-wrap: normal;
}
```

## Accessibility Requirements (WCAG 2.1 A and AA)

Every application must meet WCAG 2.1 Level A and AA. This is not optional.

### Embed Context Considerations

Since your app is injected into an existing YaleSites page:
- The host page already has `<header>`, `<main>`, `<footer>` landmarks - do not duplicate them
- The host page has its own `<h1>` - your app's top-level heading should typically be `<h2>` or match the heading level appropriate for its position in the page hierarchy
- The host page has its own skip navigation - you do not need to add one
- Use `<section aria-label="...">` or `<section aria-labelledby="...">` to create labeled regions within your app if it has distinct content areas
- **Do not set focus on load.** Your app is one part of a larger page the user is browsing. Never call `.focus()` on mount, never use `autoFocus` attributes, and never scroll the page to your container. Let the user navigate to your app naturally

### Required Practices

- **Semantic HTML**: Use appropriate elements (`<section>`, `<article>`, `<form>`, `<table>`, `<ul>`, `<ol>`) within your container
- **Heading hierarchy**: Start at the appropriate level for your embed context (typically `<h2>`). Do not skip levels within your app
- **Alt text**: All `<img>` elements must have `alt` attributes (empty `alt=""` for decorative images)
- **Form labels**: Every form control must have an associated `<label>` element or `aria-label`
- **ARIA live regions**: Use `role="status"` with `aria-live="polite"` for dynamic content updates (search results, filtered lists, counters)
- **Keyboard navigation**: All functionality must be operable with keyboard alone (Tab, Enter, Escape, Arrow keys)
- **Focus management**: Visible focus indicators on all interactive elements; manage focus when content changes dynamically
- **Color contrast**: Minimum 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold)
- **Touch targets**: Minimum 2.75rem (44px) for all interactive elements
- **Error identification**: Form errors must be programmatically associated with their fields using `aria-describedby`
- **Tables**: Use `<th>` with `scope` attributes, `<caption>` for table purpose; use `aria-sort` for sortable columns

### Testing Checklist

Before deploying, verify:
- [ ] Tab through entire application; all interactive elements are reachable and in logical order
- [ ] Screen reader announces all content and state changes appropriately
- [ ] No information conveyed by color alone
- [ ] All text meets contrast requirements (4.5:1 normal, 3:1 large)
- [ ] Application works at 200% browser zoom
- [ ] Run axe DevTools or Lighthouse accessibility audit with zero violations
- [ ] Test within actual YaleSites page context (heading levels, landmark structure)

## Security Requirements

### Absolute Prohibitions

- **Never commit** API keys, passwords, tokens, secrets, or credentials to the repository
- **Never store** sensitive data in localStorage, sessionStorage, or cookies
- **Never include** `.env` files in the repository (add to `.gitignore`)
- **Never collect** personally identifiable information (PII) without explicit authorization
- **Never use** inline event handlers (`onclick="..."`) - use React event handlers
- **Never render** unsanitized HTML from user input or external sources
- **Never trust** user input - validate and sanitize all inputs

### Required Practices

- Validate all user inputs at system boundaries
- Run `npm audit` before deploying; resolve high and critical vulnerabilities
- If calling external APIs, handle CORS properly and document the API dependency
- Since your app's JS runs in the host page context, be extra careful not to modify DOM elements outside your container

### Repository Security

- Source code in the repository can be private; GitHub Pages output is always public
- Only compiled assets (`app.js`, `app.css`, `index.html`) are exposed via GitHub Pages
- Review build output before deploying to ensure no secrets are bundled

## Development Workflow

### Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # TypeScript check + production build
npm run preview      # Build and preview production version
npm run preview:fast # Preview existing build (no rebuild)
npm run lint         # ESLint check
npm run deploy       # Build and deploy to GitHub Pages
npm run setup        # Replace template placeholders interactively
```

### Before Every Commit

1. `npm run lint` passes with no errors
2. `npm run build` succeeds
3. No sensitive data in any staged file
4. Accessibility manually verified (keyboard nav, screen reader)

### Code Standards

- TypeScript strict mode; no `any` types unless absolutely necessary
- Functional React components with hooks
- 2-space indentation
- Single quotes for strings
- Run ESLint before committing

### Git Conventions

- Conventional Commits format: `feat(scope): message`, `fix:`, `chore:`, `docs:`
- Present tense, lowercase

## Project Structure

```
your-app-name/
├── src/
│   ├── main.tsx          # Entry point - mount ID must match repo name
│   ├── App.tsx           # Main application component
│   ├── App.css           # Application styles (scoped to container)
│   ├── index.css         # Global reset and base styles
│   └── vite-env.d.ts     # Vite type declarations
├── dist/                 # Build output (gitignored)
│   ├── index.html
│   └── assets/
│       ├── app.js        # Application JavaScript
│       └── app.css       # Application styles
├── index.html            # HTML template (for standalone dev/preview)
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Build config (base path + fixed asset names)
├── tsconfig.json         # TypeScript config
├── eslint.config.js      # ESLint config
└── setup.js              # Template placeholder replacement script
```

## Component Patterns

When building UI components, follow the patterns established by the [YaleSites Component Library](https://github.com/yalesites-org/component-library-twig):

### Atomic Design

- **Atoms**: buttons, inputs, labels, links, dividers
- **Molecules**: cards, alerts, form groups, tabs, accordions
- **Organisms**: larger composed sections (search interfaces, data displays)

### Naming Conventions

- Prefix all CSS class names with the app name to avoid collisions with host page styles
- Example: `.myapp-card`, `.myapp-card__title`, `.myapp-card--highlighted`
- This is critical because your CSS loads directly into the YaleSites page

### Component Checklist

When creating any interactive component:
- [ ] Has semantic HTML structure
- [ ] Has appropriate ARIA attributes
- [ ] Has keyboard support (Tab, Enter, Escape, Arrow keys as appropriate)
- [ ] Has visible focus indicator
- [ ] Meets minimum touch target size (2.75rem / 44px)
- [ ] Uses Yale color tokens (not arbitrary hex values)
- [ ] Uses Yale spacing scale (not arbitrary pixel values)
- [ ] Uses Yale type scale for text sizing
- [ ] Has `prefers-reduced-motion` guard on any animations
- [ ] Has responsive behavior across breakpoints
- [ ] CSS is scoped to app container (will not leak into host page)

## Recommended Workflow with Claude

Whether you are using Claude Code, the Claude desktop app, or claude.ai with this project loaded, follow this workflow to build a quality embed app. Just ask Claude in plain language at each stage.

### Before Writing Code

Ask Claude to help you plan before jumping into implementation:
- "Help me think through the requirements for this app. What are the user flows, edge cases, and accessibility considerations?"
- "What components will I need? How should I structure this?"

### While Building

Remind Claude to follow the design system defined in this file:
- "Build this using the Yale design tokens and patterns from CLAUDE.md"
- "Make sure all CSS is scoped to the app container"
- "Check that this component meets WCAG 2.1 AA requirements"

### After Your App Works

Ask Claude to review what was built:
- "Review my code for accessibility issues - check heading levels, keyboard navigation, ARIA attributes, and color contrast"
- "Check that all my CSS is scoped under the app container ID and nothing leaks into the host page"
- "Look for any hardcoded colors, spacing, or font sizes that should use Yale design tokens instead"
- "Review my code for security issues - check for secrets, unsanitized input, and dependency vulnerabilities"
- "Simplify and clean up the code without changing functionality"

### Before Deploying

If using Claude Code (which has terminal access), ask it to run checks:
- "Run `npm run lint` and `npm run build` and fix any issues"
- "Run `npm audit` and check for high or critical vulnerabilities"
- "Verify the build output has `assets/app.js` and `assets/app.css` in the correct location"

If using the Claude desktop app or claude.ai (no terminal access), run these yourself:
```bash
npm run lint
npm run build
npm audit
ls dist/assets/   # Should show app.js and app.css
```

## Packaging for Submission

Once your app is complete, tested, and passing all checks, package it for submission to the YaleSites team so they can create a repository in the `yalesites-org` GitHub organization.

### What to Include

Package the entire project directory excluding generated and dependency files:

```bash
zip -r my-app-name.zip . -x "node_modules/*" "dist/*" ".git/*" "*.tsbuildinfo"
```

The zip should contain:
- All source files (`src/`, `index.html`, config files)
- `package.json` and `package-lock.json` (so dependencies can be reproduced)
- `CLAUDE.md`, `README.md`, and any documentation
- `.gitignore`

Do **not** include:
- `node_modules/` (will be regenerated from `package-lock.json`)
- `dist/` (will be regenerated by the build)
- `.git/` directory
- `.tsbuildinfo` files

### Before Zipping, Verify

1. Template placeholders are replaced (run `npm run setup` if you haven't, or verify `{{APP_NAME}}`, `{{APP_TITLE}}`, and `{{GITHUB_ORG}}` do not appear in any files)
2. `npm run lint` passes
3. `npm run build` succeeds and `dist/assets/` contains `app.js` and `app.css`
4. No secrets, API keys, or `.env` files are present
5. All CSS is scoped to the app container ID

## Reference Links

- [YaleSites GitHub Pages Development Guide](https://github.com/yalesites-org/yalesites-project/blob/develop/web/profiles/custom/yalesites_profile/modules/custom/ys_embed/GITHUB_PAGES_DEVELOPMENT_GUIDE.md)
- [YaleSites Design Tokens](https://github.com/yalesites-org/tokens)
- [YaleSites Component Library](https://github.com/yalesites-org/component-library-twig)
- [YaleSites Project (Drupal)](https://github.com/yalesites-org/yalesites-project)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
