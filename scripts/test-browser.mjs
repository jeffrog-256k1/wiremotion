import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { preview } from 'vite';
import { chromium } from 'playwright';

const server = await preview({
  logLevel: 'error',
  preview: { host: '127.0.0.1', port: 0, strictPort: false },
});
const browser = await chromium.launch({
  channel: process.env.WIREMOTION_BROWSER_CHANNEL || undefined,
});
const errors = [],
  requests = [];
await mkdir('test-results', { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: 'reduce',
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => Boolean(window.wiremotion));
  const original = await page.locator('#editor').inputValue();
  assert.equal(await page.locator('#play').getAttribute('aria-label'), 'Play animation');
  await page.locator('#editor').fill('{');
  assert(await page.locator('#error').isVisible());
  assert(await page.locator('#export-gif').isDisabled());
  await page.locator('#editor').fill(original);
  assert(await page.locator('#error').isHidden());
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  assert.equal(JSON.parse(await page.locator('#editor').inputValue()).theme, 'light');
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  for (const name of ['pipeline', 'branch', 'hub']) {
    await page.selectOption('#example', name);
    const input = JSON.parse(await readFile(`examples/${name}.json`, 'utf8'));
    const frames = await page.evaluate(
      (input) => [
        window.wiremotion.draw(input, 1),
        window.wiremotion.draw(input, 1),
        window.wiremotion.draw(input, 2),
        window.wiremotion.draw(input, 0),
        window.wiremotion.draw(input, input.duration || 6),
      ],
      input,
    );
    assert.equal(frames[0], frames[1]);
    assert.notEqual(frames[0], frames[2]);
    assert.equal(frames[3], frames[4]);
    await writeFile(`test-results/${name}.png`, Buffer.from(frames[0].split(',')[1], 'base64'));
  }
  await page.selectOption('#example', 'pipeline');
  const downloadPromise = page.waitForEvent('download');
  await page.click('#export-png');
  const png = await downloadPromise;
  await png.saveAs('test-results/export.png');
  const gifPromise = page.waitForEvent('download');
  await page.click('#export-gif');
  const gifDownload = await gifPromise;
  await gifDownload.saveAs('test-results/export.gif');
  const gif = await readFile('test-results/export.gif');
  assert.equal(gif.toString('ascii', 0, 6), 'GIF89a');
  assert.equal(gif.readUInt16LE(6), 1280);
  assert.equal(gif.readUInt16LE(8), 720);
  // Walk actual GIF blocks; verify loop extension, every image and exact duration.
  let offset = 13 + (gif[10] & 128 ? 3 * 2 ** ((gif[10] & 7) + 1) : 0),
    frames = 0,
    delay = 0,
    loop = false;
  const skip = () => {
    while (gif[offset]) {
      offset += gif[offset] + 1;
      assert(offset < gif.length);
    }
    offset++;
  };
  while (offset < gif.length) {
    const block = gif[offset++];
    if (block === 0x3b) break;
    if (block === 0x21) {
      const type = gif[offset++];
      if (type === 0xf9) {
        assert.equal(gif[offset], 4);
        delay += gif.readUInt16LE(offset + 2) * 10;
      }
      if (type === 0xff && gif.toString('ascii', offset + 1, offset + 12) === 'NETSCAPE2.0')
        loop = true;
      skip();
    } else if (block === 0x2c) {
      const packed = gif[offset + 8];
      offset += 9;
      if (packed & 128) offset += 3 * 2 ** ((packed & 7) + 1);
      offset++;
      skip();
      frames++;
    } else throw new Error(`Unexpected GIF block ${block}`);
  }
  assert.equal(frames, 90);
  assert.equal(delay, 6000);
  assert(loop);
  assert(gif.length < 5 * 1048576);
  await page.click('#export-gif');
  await page.click('#cancel');
  await page.waitForFunction(() =>
    document.getElementById('export-result').textContent.includes('cancelled'),
  );
  assert(await page.locator('#export-gif').isEnabled());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)));
  assert.deepEqual(errors, []);
  assert(
    requests.every(
      (url) => url.startsWith(server.resolvedUrls.local[0]) || url.startsWith('blob:'),
    ),
  );
  const receipt = {
    frames,
    duration: delay,
    gifBytes: gif.length,
    sha256: createHash('sha256').update(gif).digest('hex'),
    deterministicFrames: true,
    reducedMotion: true,
    cancellation: true,
    mobileOverflow: false,
    externalRequests: 0,
  };
  await writeFile('test-results/verification.json', JSON.stringify(receipt, null, 2));
  console.log(JSON.stringify(receipt));
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
