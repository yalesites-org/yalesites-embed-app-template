#!/usr/bin/env node

/**
 * Setup script for YaleSites GitHub Pages App Template
 * Automatically replaces template placeholders with user-provided values
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Template placeholders to replace
const PLACEHOLDERS = {
  '{{APP_NAME}}': 'Repository name (kebab-case, e.g., my-awesome-app)',
  '{{APP_TITLE}}': 'Human-readable app title (e.g., My Awesome App)',
  '{{GITHUB_ORG}}': 'GitHub organization (e.g., yalesites-org)'
};

// Files that contain placeholders
const FILES_TO_UPDATE = [
  'package.json',
  'vite.config.ts',
  'index.html',
  'src/main.tsx',
  'src/App.tsx'
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function validateKebabCase(input) {
  const kebabCasePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return kebabCasePattern.test(input);
}

async function collectUserInput() {
  console.log('🚀 YaleSites GitHub Pages App Template Setup\n');
  console.log('This script will replace template placeholders with your values.\n');

  const values = {};

  // Get APP_NAME
  while (true) {
    const appName = await question('Repository name (kebab-case, e.g., my-awesome-app): ');
    if (validateKebabCase(appName)) {
      values['{{APP_NAME}}'] = appName;
      break;
    } else {
      console.log('❌ Please use kebab-case (lowercase letters, numbers, and hyphens only)');
    }
  }

  // Get APP_TITLE
  const appTitle = await question('App title (e.g., My Awesome App): ');
  values['{{APP_TITLE}}'] = appTitle || values['{{APP_NAME}}'].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Get GITHUB_ORG
  const githubOrg = await question('GitHub organization (default: yalesites-org): ');
  values['{{GITHUB_ORG}}'] = githubOrg || 'yalesites-org';

  return values;
}

function replacePlaceholders(content, values) {
  let updatedContent = content;
  for (const [placeholder, value] of Object.entries(values)) {
    const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
    updatedContent = updatedContent.replace(regex, value);
  }
  return updatedContent;
}

async function updateFiles(values) {
  console.log('\n📝 Updating files...\n');

  for (const file of FILES_TO_UPDATE) {
    const filePath = path.join(__dirname, file);
    
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const updatedContent = replacePlaceholders(content, values);
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Updated: ${file}`);
      } else {
        console.log(`⚠️  Skipped: ${file} (not found)`);
      }
    } catch (error) {
      console.log(`❌ Error updating ${file}:`, error.message);
    }
  }
}

function displaySummary(values) {
  console.log('\n🎉 Setup complete!\n');
  console.log('📋 Summary:');
  Object.entries(values).forEach(([placeholder, value]) => {
    const description = PLACEHOLDERS[placeholder] || placeholder;
    console.log(`   ${placeholder}: ${value}`);
  });

  console.log('\n🚀 Next steps:');
  console.log('   1. npm install');
  console.log('   2. npm run dev');
  console.log('   3. npm run deploy');
  
  console.log(`\n🌐 Your app will be available at:`);
  console.log(`   https://${values['{{GITHUB_ORG}}']}.github.io/${values['{{APP_NAME}}']}/`);
}

async function main() {
  try {
    const values = await collectUserInput();
    await updateFiles(values);
    displaySummary(values);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Check if being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}