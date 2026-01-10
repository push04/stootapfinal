import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Build all functions in netlify/functions
const functionsDir = join(__dirname, 'netlify', 'functions');
const outputDir = join(__dirname, 'netlify-functions-build');

async function buildFunctions() {
  try {
    const files = await readdir(functionsDir);
    const tsFiles = files.filter(f => f.endsWith('.ts'));

    for (const file of tsFiles) {
      const entryPoint = join(functionsDir, file);
      const outfile = join(outputDir, file.replace('.ts', '.js'));

      console.log(`Building ${file}...`);
      
      await build({
        entryPoints: [entryPoint],
        bundle: true,
        platform: 'node',
        target: 'node20',
        format: 'esm',
        outfile,
   external: [
    '@neondatabase/serverless',
    'pg-native',
  ],
  alias: {
    '@shared': join(__dirname, 'shared'),
    '@': join(__dirname, 'client', 'src'),
  },
  minify: false,
  sourcemap: true,
  })

      console.log(`✓ Built ${file}`);
    }

    console.log('All functions built successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildFunctions();
