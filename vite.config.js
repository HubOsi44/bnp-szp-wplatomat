import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const IMAGE_EXT = /\.(png|jpe?g|gif|svg|webp|avif)$/i;

export default defineConfig(({ mode }) => {
  // `npm run build:single` — cała strona w jednym index.html (CSS, JS i obrazki wbudowane),
  // tak jak w pierwotnej wersji pliku.
  if (mode === 'single') {
    return {
      base: './',
      plugins: [viteSingleFile()],
      build: {
        outDir: 'dist-single',
        emptyOutDir: true,
      },
    };
  }

  return {
    // Ścieżki względne — zbudowaną stronę można wgrać do dowolnego katalogu na serwerze.
    base: './',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // Obrazki zawsze jako osobne pliki, bez wbudowywania w base64.
      assetsInlineLimit: 0,
      rolldownOptions: {
        output: {
          entryFileNames: 'js/main.js',
          chunkFileNames: 'js/[name].js',
          assetFileNames: (asset) => {
            const name = asset.names?.[0] ?? '';
            if (name.endsWith('.css')) return 'css/style.css';
            if (IMAGE_EXT.test(name)) return 'images/[name][extname]';
            return 'assets/[name][extname]';
          },
        },
      },
    },
  };
});
