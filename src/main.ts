import './style.css';
import pipeline from '../examples/pipeline.json';
import branch from '../examples/branch.json';
import hub from '../examples/hub.json';
import { DiagramError, parseDiagram, validateDiagram, type Diagram } from './schema.ts';
import { drawDiagram } from './renderer.ts';
import { exportDiagram, readmeSnippet } from './export.ts';

import {
  initialLanguage,
  isLanguage,
  applyLanguage,
  translate,
  type MessageKey,
  type MessageParams,
} from './i18n.ts';
let language = initialLanguage();
const t = (key: MessageKey, params: MessageParams = {}) => translate(language, key, params);
const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const editor = el<HTMLTextAreaElement>('editor'),
  canvas = el<HTMLCanvasElement>('canvas'),
  ctx = canvas.getContext('2d')!;
const examples = { pipeline, branch, hub },
  reduced = matchMedia('(prefers-reduced-motion: reduce)');
let diagram = validateDiagram(pipeline),
  playing = !reduced.matches,
  time = diagram.duration * 0.38,
  last = performance.now(),
  valid = true,
  busy = false;
let aborter: AbortController | undefined;
const controls = [
  'language',
  'example',
  'editor',
  'format',
  'save-json',
  'dark',
  'light',
  'export-gif',
  'export-png',
  'copy',
];
const result = el('export-result');
let resultMessage: { key: MessageKey; params: MessageParams } | undefined;
function showResult(key?: MessageKey, params: MessageParams = {}) {
  resultMessage = key ? { key, params } : undefined;
  result.textContent = key ? t(key, params) : '';
}
function setLanguage() {
  applyLanguage(language);
  el<HTMLSelectElement>('language').value = language;
  playLabel();
  update();
  if (resultMessage) showResult(resultMessage.key, resultMessage.params);
}
el<HTMLSelectElement>('language').onchange = (event) => {
  const selected = (event.target as HTMLSelectElement).value;
  if (!isLanguage(selected)) return;
  language = selected;
  try {
    localStorage.setItem('wiremotion-language', language);
  } catch {
    /* Optional preference only. */
  }
  const url = new URL(location.href);
  url.searchParams.set('lang', language);
  history.replaceState(null, '', url);
  setLanguage();
};

function availability() {
  for (const id of controls)
    (el(id) as HTMLButtonElement).disabled =
      busy || (!valid && ['export-gif', 'export-png', 'copy', 'save-json'].includes(id));
}
function update() {
  el('byte-count').textContent =
    `${new TextEncoder().encode(editor.value).length.toLocaleString(language)} B`;
  try {
    const next = parseDiagram(editor.value);
    diagram = next;
    valid = true;
    canvas.width = diagram.width;
    canvas.height = (diagram.width * 9) / 16;
    canvas.setAttribute(
      'aria-label',
      `${diagram.title}. ${diagram.nodes.map((n) => n.label).join(' → ')}.`,
    );
    el('error').hidden = true;
    el('input-state').textContent = t('valid');
    el('diagram-meta').textContent = t('diagramMeta', {
      nodes: diagram.nodes.length,
      edges: diagram.edges.length,
    });
    el('dark').setAttribute('aria-pressed', String(diagram.theme === 'dark'));
    el('light').setAttribute('aria-pressed', String(diagram.theme === 'light'));
    time %= diagram.duration;
    drawDiagram(ctx, diagram, time);
  } catch (error) {
    valid = false;
    el('error').hidden = false;
    el('error').textContent =
      error instanceof DiagramError ? t(error.code, error.params) : t('unknownError');
    el('input-state').textContent = t('lastValid');
  }
  availability();
}
function load(value: unknown) {
  editor.value = JSON.stringify(value, null, 2);
  editor.scrollTop = 0;
  time = diagram.duration * 0.38;
  update();
  showResult();
}
editor.addEventListener('input', update);
el<HTMLSelectElement>('example').onchange = (event) =>
  load(examples[(event.target as HTMLSelectElement).value as keyof typeof examples]);
for (const theme of ['dark', 'light'] as const)
  el(theme).onclick = () => {
    if (!valid) {
      update();
      return;
    }
    load({
      ...diagram,
      theme,
      accent:
        theme === 'light' && diagram.accent === '#ff5938'
          ? '#c33e23'
          : theme === 'dark' && diagram.accent === '#c33e23'
            ? '#ff5938'
            : diagram.accent,
    });
  };
el('format').onclick = () => {
  if (valid) load(diagram);
  else update();
};
function playLabel() {
  el('play').textContent = t(playing ? 'pause' : 'play');
  el('play').setAttribute('aria-label', t(playing ? 'pauseAria' : 'playAria'));
}
el('play').onclick = () => {
  playing = !playing;
  playLabel();
};
reduced.addEventListener('change', () => {
  playing = !reduced.matches;
  time = diagram.duration * 0.38;
  playLabel();
});
function frame(now: number) {
  if (playing && !document.hidden) {
    time = (time + Math.min((now - last) / 1000, 0.1)) % diagram.duration;
    drawDiagram(ctx, diagram, time);
  }
  last = now;
  el('frame-time').textContent =
    `${time.toFixed(2).padStart(5, '0')} / ${diagram.duration.toFixed(2).padStart(5, '0')}`;
  requestAnimationFrame(frame);
}
function download(data: Blob, name: string) {
  const url = URL.createObjectURL(data),
    a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
el('save-json').onclick = () =>
  download(
    new Blob([JSON.stringify(diagram, null, 2) + '\n'], { type: 'application/json' }),
    'wiremotion.json',
  );
el('export-png').onclick = () => {
  const still = document.createElement('canvas');
  still.width = diagram.width;
  still.height = (diagram.width * 9) / 16;
  drawDiagram(still.getContext('2d')!, diagram, diagram.duration * 0.38);
  still.toBlob((blob) => {
    if (blob) {
      download(blob, 'wiremotion.png');
      showResult('pngSaved');
    }
  }, 'image/png');
};
el('copy').onclick = async () => {
  try {
    await navigator.clipboard.writeText(readmeSnippet());
    showResult('copied');
  } catch {
    download(new Blob([readmeSnippet()], { type: 'text/markdown' }), 'wiremotion-embed.md');
    showResult('snippetSaved');
  }
};
el('cancel').onclick = () => aborter?.abort();
el('export-gif').onclick = async () => {
  busy = true;
  availability();
  el('progress-row').hidden = false;
  showResult();
  el('export-status').textContent = t('rendering', { percent: 0 });
  aborter = new AbortController();
  el<HTMLProgressElement>('progress').value = 0;
  try {
    const exported = await exportDiagram(
      diagram,
      (value) => {
        el<HTMLProgressElement>('progress').value = value * 100;
        el('export-status').textContent = t('rendering', { percent: Math.round(value * 100) });
      },
      aborter.signal,
    );
    download(new Blob([exported.gif], { type: 'image/gif' }), 'wiremotion.gif');
    showResult('gifSaved', {
      size: (exported.gif.byteLength / 1048576).toFixed(2),
      duration: diagram.duration,
    });
  } catch (error) {
    showResult((error as Error).message === 'Export cancelled.' ? 'cancelled' : 'exportFailed');
  } finally {
    busy = false;
    availability();
    el('progress-row').hidden = true;
    aborter = undefined;
  }
};

// Shared browser bridge for the local CLI and renderer regression checks.
async function base64(data: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(new Blob([data]));
  });
}
declare global {
  interface Window {
    wiremotion: {
      render: (input: unknown) => Promise<{ gif: string; png: string }>;
      draw: (input: unknown, seconds: number) => string;
    };
  }
}
window.wiremotion = {
  render: async (input) => {
    const files = await exportDiagram(validateDiagram(input));
    return { gif: await base64(files.gif), png: await base64(files.png) };
  },
  draw: (input, seconds) => {
    const d = validateDiagram(input),
      c = document.createElement('canvas');
    c.width = d.width;
    c.height = (d.width * 9) / 16;
    drawDiagram(c.getContext('2d')!, d, seconds);
    return c.toDataURL('image/png');
  },
};
load(pipeline);
setLanguage();
requestAnimationFrame(frame);
