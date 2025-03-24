const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);

// Check if we should use watch mode
const watch = args.includes('--watch');

// Base build options
const buildOptions = {
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/work-hour.js',
  format: 'iife',
  minify: !watch, // Only minify for production builds
  sourcemap: watch ? 'inline' : false,
};

// Run the build
async function runBuild() {
  try {
    // Create dist directory if it doesn't exist
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
    
    // Copy static files to dist
    copyFile('manifest.json', 'dist/manifest.json');
    copyFile('options.html', 'dist/options.html');
    copyFile('options.js', 'dist/options.js');
    copyFile('background.js', 'dist/background.js');
    
    // Copy icons if they exist
    if (fs.existsSync('icons')) {
      if (!fs.existsSync('dist/icons')) {
        fs.mkdirSync('dist/icons');
      }
      
      if (fs.existsSync('icons/icon16.png')) {
        copyFile('icons/icon16.png', 'dist/icons/icon16.png');
      }
      if (fs.existsSync('icons/icon48.png')) {
        copyFile('icons/icon48.png', 'dist/icons/icon48.png');
      }
      if (fs.existsSync('icons/icon128.png')) {
        copyFile('icons/icon128.png', 'dist/icons/icon128.png');
      }
    }
    
    if (watch) {
      // Set up watch mode
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      // Run a one-time build
      await esbuild.build(buildOptions);
      console.log('Build completed successfully!');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Helper function to copy a file
function copyFile(source, destination) {
  try {
    const data = fs.readFileSync(source);
    fs.writeFileSync(destination, data);
  } catch (err) {
    console.error(`Error copying ${source} to ${destination}:`, err);
  }
}

runBuild();