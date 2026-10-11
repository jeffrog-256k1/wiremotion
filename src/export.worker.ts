import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { validateDiagram } from './schema.ts';
import { drawDiagram } from './renderer.ts';

self.onmessage = async (event: MessageEvent) => {
  try {
    const d = validateDiagram(event.data),
      width = d.width,
      height = (width * 9) / 16;
    const canvas = new OffscreenCanvas(width, height),
      ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas rendering is unavailable in this browser.');
    drawDiagram(ctx, d, d.duration * 0.38);
    const png = await (await canvas.convertToBlob({ type: 'image/png' })).arrayBuffer();
    const palette = quantize(ctx.getImageData(0, 0, width, height).data, 128),
      gif = GIFEncoder(),
      frames = d.duration * 15;
    for (let frame = 0; frame < frames; frame++) {
      drawDiagram(ctx, d, frame / 15);
      const pixels = ctx.getImageData(0, 0, width, height).data;
      // GIF delay uses hundredths. 70+60+70 ms repeats to exactly 15 fps.
      gif.writeFrame(applyPalette(pixels, palette), width, height, {
        palette,
        delay: [70, 60, 70][frame % 3],
        repeat: 0,
      });
      self.postMessage({ type: 'progress', value: (frame + 1) / frames });
    }
    gif.finish();
    const buffer = gif.bytes().slice().buffer;
    self.postMessage({ type: 'complete', gif: buffer, png }, { transfer: [buffer, png] });
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Export failed.',
    });
  }
};
