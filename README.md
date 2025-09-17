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

This template follows the [YaleSites GitHub Pages Development Guide](./YaleSites-GitHub-Pages-Development-Guide.md) requirements:

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

## 📚 Additional Resources

- [YaleSites GitHub Pages Development Guide](./YaleSites-GitHub-Pages-Development-Guide.md)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

1. Follow the patterns established in this template
2. Maintain WCAG 2.1 AA accessibility standards
3. Test thoroughly before deployment
4. Update documentation as needed

---

**Ready to build your YaleSites app? Start customizing!** 🎉