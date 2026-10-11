import type { Diagram } from './schema.ts';

export function exportDiagram(
  diagram: Diagram,
  progress: (value: number) => void = () => {},
  signal?: AbortSignal,
): Promise<{ gif: ArrayBuffer; png: ArrayBuffer }> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Export cancelled.'));
      return;
    }
    const worker = new Worker(new URL('./export.worker.ts', import.meta.url), { type: 'module' });
    const finish = () => {
      worker.terminate();
      signal?.removeEventListener('abort', cancel);
    };
    const cancel = () => {
      finish();
      reject(new Error('Export cancelled.'));
    };
    signal?.addEventListener('abort', cancel, { once: true });
    worker.onerror = () => {
      finish();
      reject(new Error('Export failed. Use a current browser with OffscreenCanvas support.'));
    };
    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') progress(data.value);
      else if (data.type === 'complete') {
        finish();
        resolve({ gif: data.gif, png: data.png });
      } else if (data.type === 'error') {
        finish();
        reject(new Error(data.message));
      }
    };
    worker.postMessage(diagram);
  });
}

export function readmeSnippet(name = 'wiremotion'): string {
  return `<picture>\n  <source media="(prefers-reduced-motion: reduce)" srcset="assets/${name}.png">\n  <img src="assets/${name}.gif" alt="Diagram of your workflow" width="1280">\n</picture>\n\n[View the still image](assets/${name}.png)\n`;
}
