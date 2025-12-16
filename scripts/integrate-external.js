#!/usr/bin/env node

/**
 * Integration script for legacy HTML experiences.
 * Prompts for a source HTML file, copies it (and referenced assets) into
 * public/external/, and updates external.config.json with display metadata.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const externalDir = path.join(projectRoot, 'public', 'external');
const configPath = path.join(projectRoot, 'external.config.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function readConfig() {
  if (!fs.existsSync(configPath)) {
    throw new Error('external.config.json not found. Please run from project root.');
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, answer => resolve(answer.trim())));
}

function expandHome(inputPath) {
  if (!inputPath.startsWith('~')) return inputPath;
  return path.join(os.homedir(), inputPath.slice(1));
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function emptyDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  for (const entry of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      emptyDir(fullPath);
      fs.rmdirSync(fullPath);
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}

function extractTitle(htmlContent) {
  const match = htmlContent.match(/<title>([\s\S]*?)<\/title>/i);
  if (!match) return null;
  return match[1].trim();
}

function isRelativeUrl(url) {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith('#')) return false;
  return !/^(?:[a-z]+:)?\/\//i.test(trimmed) && !trimmed.startsWith('data:');
}

function normalizeAssetPath(rawPath) {
  if (!rawPath) return null;
  const sanitized = rawPath.split('?')[0].split('#')[0].trim();
  return sanitized || null;
}

function extractAssets(htmlContent) {
  const matches = new Set();
  const assetRegex = /\b(?:src|href)=["']([^"']+)["']/gi;
  let result;
  while ((result = assetRegex.exec(htmlContent)) !== null) {
    const relative = result[1];
    if (isRelativeUrl(relative)) {
      const normalized = normalizeAssetPath(relative);
      if (normalized) {
        matches.add(normalized);
      }
    }
  }
  return Array.from(matches);
}

function copyAsset(sourceRoot, destinationRoot, assetPath) {
  const sourceAsset = path.resolve(sourceRoot, assetPath);
  if (!fs.existsSync(sourceAsset)) {
    console.warn(`⚠️  Missing asset: ${assetPath} (expected at ${sourceAsset})`);
    return;
  }
  const destinationAsset = path.join(destinationRoot, assetPath);
  ensureDir(path.dirname(destinationAsset));
  const stats = fs.lstatSync(sourceAsset);
  if (stats.isDirectory()) {
    fs.cpSync(sourceAsset, destinationAsset, { recursive: true });
  } else {
    fs.copyFileSync(sourceAsset, destinationAsset);
  }
  console.log(`📦 Copied asset: ${assetPath}`);
}

function updateConfig(config) {
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  console.log('🛠  Updated external.config.json');
}

async function main() {
  try {
    console.log('🧩 Legacy HTML Integration\n');
    const existingConfig = readConfig();

    let sourcePath = await question('Path to HTML file to integrate: ');
    if (!sourcePath) {
      throw new Error('No HTML file path provided.');
    }
    sourcePath = expandHome(sourcePath);
    sourcePath = path.resolve(process.cwd(), sourcePath);

    if (!fs.existsSync(sourcePath) || !fs.lstatSync(sourcePath).isFile()) {
      throw new Error(`HTML file not found at ${sourcePath}`);
    }

    ensureDir(externalDir);
    emptyDir(externalDir);

    const htmlContent = fs.readFileSync(sourcePath, 'utf8');
    const inferredTitle = extractTitle(htmlContent);

    const destFileNameAnswer = await question('Destination filename inside public/external (default: index.html): ');
    const destFileName = destFileNameAnswer || 'index.html';
    const destinationHtmlPath = path.join(externalDir, destFileName);
    fs.writeFileSync(destinationHtmlPath, htmlContent, 'utf8');
    console.log(`✅ Copied HTML to public/external/${destFileName}`);

    const assets = extractAssets(htmlContent);
    const sourceRoot = path.dirname(sourcePath);
    if (assets.length) {
      console.log('\n🔍 Copying referenced assets...');
      for (const assetPath of assets) {
        copyAsset(sourceRoot, externalDir, assetPath);
      }
    } else {
      console.log('\nℹ️  No relative assets detected in HTML.');
    }

    const currentTitle =
      typeof existingConfig.iframeTitle === 'string' && existingConfig.iframeTitle.trim().length > 0
        ? existingConfig.iframeTitle.trim()
        : '{{APP_TITLE}}';

    const htmlTitleNote =
      inferredTitle && inferredTitle !== currentTitle ? ` (detected in HTML: ${inferredTitle})` : '';

    const titleAnswer = await question(`Iframe title (press enter to keep ${currentTitle})${htmlTitleNote}: `);
    const iframeTitle = titleAnswer || currentTitle || inferredTitle || 'Legacy experience';

    const currentHeight =
      typeof existingConfig.initialHeight === 'number' && Number.isFinite(existingConfig.initialHeight)
        ? existingConfig.initialHeight
        : 600;

    const heightAnswer = await question(`Initial height in pixels (press enter to keep ${currentHeight}): `);
    const parsedHeight = heightAnswer ? Number.parseInt(heightAnswer, 10) : null;
    if (heightAnswer && Number.isNaN(parsedHeight)) {
      console.warn('⚠️  Invalid height input, keeping existing value.');
    }

    const currentUseIframe =
      typeof existingConfig.useIframe === 'boolean' ? existingConfig.useIframe : true;

    console.log('\n🔒 Security Configuration');
    console.log('   Iframe mode (recommended): Isolates content in a sandboxed iframe for better security.');
    console.log('   Direct injection mode: Injects HTML directly with CSP headers. Only use for trusted content.');
    const useIframeAnswer = await question(`Use iframe for security isolation? (Y/n, default: ${currentUseIframe ? 'Y' : 'n'}): `);
    const useIframe = useIframeAnswer.toLowerCase() === 'n' ? false : true;

    let allowList = existingConfig.allowList || ['allow-scripts', 'allow-same-origin'];
    let cspDirectives = existingConfig.cspDirectives || {
      'script-src': "'self'",
      'style-src': "'self' 'unsafe-inline'",
      'img-src': "'self' data:",
      'default-src': "'self'",
    };

    if (useIframe) {
      const allowListAnswer = await question(
        `Sandbox tokens (comma-separated, press enter to keep: ${allowList.join(', ')}): `
      );
      if (allowListAnswer.trim()) {
        allowList = allowListAnswer.split(',').map(token => token.trim());
      }
    } else {
      console.log('⚠️  WARNING: Direct injection mode has XSS risks. Only use for content you control.');
      const editCspAnswer = await question('Use default CSP directives? (Y/n): ');
      if (editCspAnswer.toLowerCase() === 'n') {
        console.log('Current CSP directives:');
        console.log(JSON.stringify(cspDirectives, null, 2));
        const cspAnswer = await question('Enter new CSP as JSON (or press enter to keep current): ');
        if (cspAnswer.trim()) {
          try {
            cspDirectives = JSON.parse(cspAnswer);
          } catch {
            console.warn('⚠️  Invalid JSON, keeping existing CSP directives.');
          }
        }
      }
    }

    const updatedConfig = {
      ...existingConfig,
      entryHtml: destFileName,
      iframeTitle,
      useIframe,
      allowList,
      cspDirectives,
    };
    if (parsedHeight && parsedHeight > 0) {
      updatedConfig.initialHeight = parsedHeight;
    }

    updateConfig(updatedConfig);

    console.log('\n🎉 Integration complete!');
    console.log('   • Run npm run dev to preview the embedded experience.');
    console.log('   • Verify interactive features before deploy.');
  } catch (error) {
    console.error(`\n❌ Integration failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
