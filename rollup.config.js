import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';
import legacy from '@rollup/plugin-legacy';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

const baseConfig = createSpaConfig({
  // development mode creates a non-minified build for debugging or development
  developmentMode: process.env.ROLLUP_WATCH === 'true',

  // set to true to inject the service worker registration into your index.html
  injectServiceWorker: false,
});

export default merge(baseConfig, {
  input: './index.html',
  output: {
    sourcemap: true,
  },
  plugins: [
    legacy({
      'assets/hterm_all.js': {
        hterm: 'hterm',
        lib: 'lib',
      },
    }),
    resolve({
      browser: true,
    }),
    replace({
      'process.env.NODE_ENV':
        process.env.ROLLUP_WATCH === 'true' ? '"development"' : '"production"',
    }),
  ],
});
