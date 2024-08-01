import { resolve as resolveURL } from 'url';
import { get } from 'https';

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('https://')) {
    return {
      url: specifier,
      shortCircuit: true,
    };
  }
  return nextResolve(specifier, context);
}

export function load(url, context, nextLoad) {
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          resolve({
            format: 'module',
            shortCircuit: true,
            source: data,
          });
        });
      }).on('error', reject);
    });
  }
  return nextLoad(url, context);
}