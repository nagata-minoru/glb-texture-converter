import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const stub = (name: string) => fileURLToPath(new URL(`./test/stubs/${name}`, import.meta.url));

export default defineConfig({
  resolve: {
    // https からロードされる外部モジュールを、オフラインで動くスタブに差し替える
    alias: {
      'https://code4fukui.github.io/GLTF/GLTF.js': stub('GLTF.ts'),
      'https://code4fukui.github.io/GLTF/GLB.js': stub('GLB.ts'),
    },
  },
  test: {
    include: ['test/**/*.test.ts'],
  },
});
