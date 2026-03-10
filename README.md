# YaleSites GitHub Pages App Template

A template for creating React applications that can be embedded in YaleSites using GitHub Pages and the `ys_embed` module's GitHub Applet embed source.

## 🚀 Quick Start

1. **Use this template** to create a new repository
2. **Clone your new repository**
3. **Customize the template** (see [Setup Instructions](#setup-instructions))
4. **Install dependencies**: `npm install`
5. **Start development**: `npm run dev`
6. **Deploy**: `npm run deploy`

## 📋 Setup Instructions

### Required Customizations

Before deploying, you MUST replace these template placeholders:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{APP_NAME}}` | Repository name (kebab-case) | `my-awesome-app` |
| `{{APP_TITLE}}` | Human-readable app title | `My Awesome App` |
| `{{GITHUB_ORG}}` | GitHub organization | `yalesites-org` |

### Files to Update

1. **package.json**:
   ```json
   {
     "name": "my-awesome-app",
     "homepage": "https://yalesites-org.github.io/my-awesome-app"
   }
   ```

2. **vite.config.ts**:
   ```typescript
   base: '/my-awesome-app/',
   ```

3. **src/main.tsx**:
   ```typescript
   createRoot(document.getElementById('my-awesome-app')!).render(
   ```

4. **index.html**:
   ```html
   <title>My Awesome App</title>
   ```

5. **src/App.tsx**:
   ```typescript
   <h1 id="main-heading">My Awesome App</h1>
   ```

### Automated Setup (Optional)

Run the setup script to automatically replace placeholders:

```bash
npm run setup
```

This script will prompt you for the required values and update all files automatically.

## 📁 Project Structure

```
your-app-name/
├── src/
│   ├── main.tsx          # Entry point - CRITICAL mount configuration
│   ├── App.tsx           # Main application component  
│   ├── App.css           # Application styles
│   └── index.css         # Global styles
├── package.json          # Build scripts and dependencies
├── vite.config.ts        # Build configuration - CRITICAL for embed
├── tsconfig.json         # TypeScript configuration
├── eslint.config.js      # Linting configuration
├── index.html            # HTML template
└── README.md             # This file
```

## 🛠 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build (rebuilds first)
npm run preview

# Preview existing build (fast, no rebuild)
npm run preview:fast

# Lint code
npm run lint

# Deploy to GitHub Pages
npm run deploy
```

## 🎯 YaleSites Integration

### Critical Requirements

This template follows the [YaleSites GitHub Pages Development Guide](https://github.com/yalesites-org/yalesites-project/blob/develop/web/profiles/custom/yalesites_profile/modules/custom/ys_embed/GITHUB_PAGES_DEVELOPMENT_GUIDE.md) requirements:

- ✅ **Mount Point**: Element ID matches repository name exactly
- ✅ **Asset Structure**: Builds output `assets/app.js` and `assets/app.css` 
- ✅ **Base Path**: Configured for GitHub Pages (`/repo-name/`)
- ✅ **WCAG 2.1 AA**: Accessible by default
- ✅ **Cross-Origin**: Works in iframe embed context

### Deployment Process

1. **Enable GitHub Pages** in repository settings:
   - Source: Deploy from a branch
   - Branch: `gh-pages` (created automatically)

2. **Deploy**:
   ```bash
   npm run deploy
   ```

3. **Verify**: Your app will be available at:
   ```
   https://yalesites-org.github.io/your-app-name/
   ```

### YaleSites Embed URLs

The embed system expects these exact URLs:
- **JavaScript**: `https://yalesites-org.github.io/your-app-name/assets/app.js`
- **CSS**: `https://yalesites-org.github.io/your-app-name/assets/app.css`

## ♿ Accessibility Features

This template includes WCAG 2.1 AA compliance features:

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Screen Reader Support**: ARIA labels and live regions
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Meets AA contrast requirements

### Testing Accessibility

```bash
# Install and use axe DevTools browser extension
# Run Lighthouse audit in Chrome DevTools
# Test keyboard navigation (Tab, Enter, Escape)
# Test with screen reader (VoiceOver, NVDA)
```

## 🔒 Security

- **No Secrets**: Never commit API keys or sensitive data
- **Dependencies**: Run `npm audit` regularly
- **CORS**: Configure external API calls properly
- **Validation**: Validate all user inputs

## 📦 Build Output

The build process creates:

```
dist/
├── index.html
└── assets/
    ├── app.js     # Your application JavaScript
    └── app.css    # Your application styles
```

**Important**: Assets MUST be in the `assets/` subdirectory for YaleSites integration.

## 🚨 Troubleshooting

### App Not Loading in YaleSites

Check that the mount point ID matches repository name:
```typescript
// ❌ Wrong
createRoot(document.getElementById('root')!).render(

// ✅ Correct  
createRoot(document.getElementById('my-app-name')!).render(
```

### Assets Not Found (404 Errors)

Verify build output structure:
```bash
npm run build && ls -la dist/assets/
# Should show: app.js and app.css
```

### Base Path Issues

Check `vite.config.ts` base path:
```typescript
base: '/your-repo-name/',  // Must match repository name
```

## Building with Claude (Vibe Coding)

This template is designed to work with Claude as your AI coding assistant. The included `CLAUDE.md` file contains all the Yale design system rules, accessibility requirements, and embed constraints. When Claude reads it, it will automatically follow these standards as it builds your app.

### Prerequisites

Before starting, make sure you have these installed on your computer:
- [Node.js](https://nodejs.org/) (version 18 or later)
- [Git](https://git-scm.com/)

Download or clone this template to a folder on your computer, then open a terminal in that folder and run:

```bash
npm install
```

### Option 1: Claude Code in VS Code (Recommended)

This is the easiest path. Claude can read your files, write code, and run commands directly in your editor.

**Setup:**
1. Install [VS Code](https://code.visualstudio.com/) if you don't have it
2. Install the [Claude Code extension](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) from the VS Code marketplace
3. Open the template folder in VS Code
4. Open the Claude Code panel in the sidebar

**Build your app:**
1. Tell Claude what you want: *"I want to build an app that lets people search and filter a list of campus events"*
2. When Claude asks clarifying questions, answer them - this helps it build something closer to what you need
3. Claude will write the code, update styles, and handle the template setup for you
4. Ask Claude to run `npm run dev` so you can preview your app in the browser
5. Iterate: *"Make the search bar wider"*, *"Add a date filter"*, *"The cards should show the event location"*

**When you're satisfied:**
1. Ask Claude: *"Run npm run lint and npm run build and fix any issues"*
2. Ask Claude: *"Review the code for accessibility and security issues"*
3. Ask Claude to package it: *"Zip up the project for submission, excluding node_modules, dist, and .git"*

### Option 2: Claude Code in the Terminal

Same capabilities as VS Code, but you interact with Claude in your terminal.

**Setup:**
1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Open a terminal and navigate to the template folder
3. Run `claude` to start a session

**Build your app:**
1. Tell Claude what you want to build
2. Claude will read the `CLAUDE.md` automatically and follow the Yale design standards
3. It can create files, edit code, run builds, and preview your app
4. Iterate by describing changes you want

**When you're satisfied:**
1. Tell Claude: *"Run lint and build and fix any issues"*
2. Tell Claude: *"Review for accessibility and security"*
3. Tell Claude: *"Zip up the project for submission, excluding node_modules, dist, and .git"*

### Option 3: Claude Desktop App or claude.ai

Claude cannot write files or run commands in this mode, so you will need to create files and run commands yourself. Claude will generate the code for you to copy into your project.

**Setup:**
1. Open [Claude](https://claude.ai) or the Claude desktop app
2. Create a new Project
3. Upload the `CLAUDE.md` file from this template as project knowledge (this tells Claude the Yale design rules)

**Build your app:**
1. Describe what you want: *"I want to build a single-page React app that does X. I'm using the YaleSites embed app template. Generate the code for src/App.tsx and src/App.css"*
2. Claude will generate code following the Yale design system
3. Copy the generated code into the corresponding files in your project
4. Run `npm run dev` in your terminal to preview
5. Go back to Claude with follow-up requests: *"Update the component to add a search filter"*

**When you're satisfied:**
1. Run these commands yourself in the terminal:
   ```bash
   npm run setup        # Replace template placeholders if you haven't already
   npm run lint         # Fix any code issues
   npm run build        # Verify the build succeeds
   npm audit            # Check for security vulnerabilities
   ls dist/assets/      # Confirm app.js and app.css exist
   ```
2. Ask Claude to review your code: paste the contents of your `App.tsx` and `App.css` and ask *"Review this for accessibility issues, style scoping problems, and security concerns"*
3. Package for submission:
   ```bash
   zip -r my-app-name.zip . -x "node_modules/*" "dist/*" ".git/*" "*.tsbuildinfo"
   ```

### Submitting Your App

Once your app is built, tested, and packaged as a zip file, submit it to the YaleSites team. They will:
1. Create a repository in the `yalesites-org` GitHub organization
2. Set up GitHub Pages deployment
3. Configure the embed in YaleSites

Before submitting, verify:
- [ ] Template placeholders are replaced (`npm run setup` or manually)
- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` succeeds
- [ ] No API keys, passwords, or secrets anywhere in the code
- [ ] All CSS is scoped to the app container ID

## 📚 Additional Resources

- [YaleSites GitHub Pages Development Guide](https://github.com/yalesites-org/yalesites-project/blob/develop/web/profiles/custom/yalesites_profile/modules/custom/ys_embed/GITHUB_PAGES_DEVELOPMENT_GUIDE.md)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)