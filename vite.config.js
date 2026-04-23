import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '/' : '/vitox-rembudgrup/',
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
    // root: 'src',
    css: {
      postcss: {
        plugins: [
          SortCss({ sort: 'mobile-first' }), // Moved to correct location
        ],
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: glob.sync('./*.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
            return '[name].js';
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }

            const isManifest = assetInfo.name === 'site.webmanifest';
            const isFavicon =
              assetInfo.name.includes('favicon') ||
              assetInfo.name.includes('apple-touch-icon');

            if (isManifest || isFavicon) {
              return '[name][extname]';
            }

            const isImage = /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(
              assetInfo.name
            );
            if (isImage && !isFavicon) {
              return 'img/[name][extname]';
            }

            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      outDir: 'dist',
      emptyOutDir: true,
    },
    plugins: [
      injectHTML(),
      {
        name: 'html-reload',
        handleHotUpdate({ file, server }) {
          if (file.endsWith('.html')) {
            server.ws.send({
              type: 'full-reload',
              path: '*',
            });
          }
        },
      },
      FullReload(['./index.html', './*.html', './src/**/**.html']),
      SortCss({
        sort: 'mobile-first',
      }),
    ],
  };
});

// const isImage = /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(
//   assetInfo.name
// );
