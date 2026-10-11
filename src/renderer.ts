import type { Diagram } from './schema.ts';

type Context = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type Point = [number, number];
export interface NodeBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
const TAU = Math.PI * 2;
const mod = (v: number, n: number) => ((v % n) + n) % n;

export function layoutNodes(d: Diagram): NodeBox[] {
  const n = d.nodes.length;
  if (d.layout === 'pipeline') {
    const w = Math.min(250, (1168 - (n - 1) * 48) / n);
    return d.nodes.map((node, i) => ({
      id: node.id,
      x: 56 + w / 2 + (i * (1168 - w)) / (n - 1),
      y: 387,
      w,
      h: 126,
    }));
  }
  if (d.layout === 'branch')
    return d.nodes.map((node, i) => ({
      id: node.id,
      x: i === 0 ? 255 : 987,
      y: i === 0 ? 395 : 240 + ((i - 1) * 320) / (n - 2),
      w: 250,
      h: 94,
    }));
  return d.nodes.map((node, i) => {
    const a = -Math.PI / 2 + ((i - 1) * TAU) / (n - 1);
    return {
      id: node.id,
      x: i === 0 ? 640 : 640 + 445 * Math.cos(a),
      y: i === 0 ? 401 : 401 + 160 * Math.sin(a),
      w: i === 0 ? 250 : 208,
      h: 92,
    };
  });
}

function route(a: NodeBox, b: NodeBox, layout: string): Point[] {
  if (layout === 'hub') {
    const dx = b.x - a.x,
      dy = b.y - a.y,
      exit = Math.min(
        a.w / 2 / Math.max(Math.abs(dx), 0.001),
        a.h / 2 / Math.max(Math.abs(dy), 0.001),
      );
    const enter = Math.min(
      b.w / 2 / Math.max(Math.abs(dx), 0.001),
      b.h / 2 / Math.max(Math.abs(dy), 0.001),
    );
    return [
      [a.x + dx * exit, a.y + dy * exit],
      [b.x - dx * enter, b.y - dy * enter],
    ];
  }
  const direction = b.x > a.x ? 1 : -1;
  const start: Point = [a.x + (direction * a.w) / 2, a.y],
    end: Point = [b.x - (direction * b.w) / 2, b.y];
  const middle = (start[0] + end[0]) / 2;
  return [start, [middle, start[1]], [middle, end[1]], end];
}
function pointAt(points: Point[], phase: number): Point {
  const lengths = points
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let distance = lengths.reduce((a, b) => a + b, 0) * Math.max(0, Math.min(1, phase));
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i] && lengths[i] > 0) {
      const t = distance / lengths[i];
      return [
        points[i][0] + (points[i + 1][0] - points[i][0]) * t,
        points[i][1] + (points[i + 1][1] - points[i][1]) * t,
      ];
    }
    distance -= lengths[i];
  }
  return points[points.length - 1];
}

export function drawDiagram(ctx: Context, d: Diagram, seconds: number, width = d.width): void {
  const t = mod(seconds, d.duration) / d.duration;
  const dark = d.theme === 'dark';
  const p = {
    bg: dark ? '#0b0e11' : '#f1efe8',
    panel: dark ? '#12171b' : '#faf9f4',
    fg: dark ? '#eeede5' : '#161b20',
    dim: dark ? '#96a2a6' : '#606b71',
    line: dark ? '#3a454b' : '#b1b7b7',
    grid: dark ? '#202a30' : '#d6d9d2',
  };
  ctx.save();
  ctx.setTransform(width / 1280, 0, 0, width / 1280, 0, 0);
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, 1280, 720);
  const line = (points: Point[], color = p.line, weight = 1) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  };
  const square = (x: number, y: number, size: number, color = d.accent) => {
    ctx.fillStyle = color;
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
  };
  const label = (
    str: string,
    x: number,
    y: number,
    size = 14,
    color = p.fg,
    maxWidth = 1168,
    bold = false,
  ) => {
    ctx.fillStyle = color;
    let s = size;
    const family = bold ? 'Arial, Helvetica, sans-serif' : '"Courier New", monospace';
    do {
      ctx.font = `${bold ? 700 : 400} ${s}px ${family}`;
      if (ctx.measureText(str).width <= maxWidth || s <= 9) break;
      s -= 0.5;
    } while (s > 9);
    if (ctx.measureText(str).width > maxWidth) {
      const parts = Array.from(
        new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(str),
        (part) => part.segment,
      );
      while (parts.length && ctx.measureText(parts.join('') + '…').width > maxWidth) parts.pop();
      str = parts.join('') + '…';
    }
    ctx.fillText(str, x, y);
  };
  // Static seeded halftone: deterministic, with no external fonts or images.
  for (let x = 32; x < 1260; x += 16)
    for (let y = 24; y < 706; y += 16) {
      const field = (Math.sin(x * 0.008 + d.seed) + Math.cos(y * 0.014 - d.seed)) * 0.25 + 0.5;
      ctx.fillStyle = p.grid;
      ctx.beginPath();
      ctx.arc(x, y, 0.45 + field * 0.72, 0, TAU);
      ctx.fill();
    }
  for (const [x, y, dx, dy] of [
    [24, 24, 1, 1],
    [1256, 24, -1, 1],
    [24, 696, 1, -1],
    [1256, 696, -1, -1],
  ])
    line(
      [
        [x + 18 * dx, y],
        [x, y],
        [x, y + 18 * dy],
      ],
      p.dim,
    );
  label('FLOW STUDY / 001', 56, 58, 13, p.dim);
  label(
    `${d.layout.toUpperCase()}   /   ${String(d.nodes.length).padStart(2, '0')} NODES`,
    936,
    58,
    13,
    p.dim,
  );
  line([
    [56, 77],
    [1224, 77],
  ]);
  square(56, 77, 5);
  label(d.title, 55, 139, 50, p.fg, 1168, true);
  label(d.subtitle, 57, 172, 16, p.dim, 1168);
  const boxes = layoutNodes(d),
    active = d.sequence[Math.floor(t * d.sequence.length)];
  d.edges.forEach((edge, i) => {
    const points = route(
      boxes.find((n) => n.id === edge.from)!,
      boxes.find((n) => n.id === edge.to)!,
      d.layout,
    );
    line(points, p.line, 1.5);
    const phase = mod(t * 2 - i * 0.18, 1);
    for (let trail = 7; trail >= 0; trail--) {
      const q = pointAt(points, mod(phase - trail * 0.012, 1));
      ctx.globalAlpha = 1 - trail * 0.11;
      square(q[0], q[1], trail === 0 ? 7 : 3);
    }
    ctx.globalAlpha = 1;
    for (const q of [points[0], points[points.length - 1]]) {
      ctx.fillStyle = p.bg;
      ctx.fillRect(q[0] - 4, q[1] - 4, 8, 8);
      ctx.strokeStyle = p.dim;
      ctx.strokeRect(q[0] - 4, q[1] - 4, 8, 8);
    }
    if (edge.label) {
      const q = pointAt(points, 0.5);
      const pos = d.layout === 'branch' ? points.reduce((a, b) => (a[0] > b[0] ? a : b)) : q;
      label(edge.label, pos[0] - (d.layout === 'branch' ? 150 : 28), pos[1] - 16, 12, p.dim, 150);
    }
  });
  boxes.forEach((box, i) => {
    const node = d.nodes[i],
      x = box.x - box.w / 2,
      y = box.y - box.h / 2,
      on = node.id === active;
    ctx.fillStyle = p.panel;
    ctx.fillRect(x, y, box.w, box.h);
    ctx.strokeStyle = on ? d.accent : p.line;
    ctx.lineWidth = on ? 1.8 : 1;
    ctx.strokeRect(x + 0.5, y + 0.5, box.w - 1, box.h - 1);
    if (on) {
      ctx.fillStyle = d.accent;
      ctx.fillRect(x, y, 3, box.h);
    }
    label(String(i + 1).padStart(2, '0'), x + 16, y + 23, 12, on ? d.accent : p.dim, box.w - 30);
    square(x + box.w - 18, y + 19, on ? 6 : 3, on ? d.accent : p.dim);
    label(node.label, x + 16, y + box.h * 0.55, 26, p.fg, box.w - 32, true);
    label(node.detail, x + 16, y + box.h - 16, 12, p.dim, box.w - 32);
  });
  if (d.layout === 'pipeline') {
    line(
      [
        [56, 524],
        [1224, 524],
      ],
      p.line,
    );
    for (let i = 0; i < 70; i++) {
      const h = 7 + 19 * (Math.sin(i * 0.47 + d.seed) * 0.5 + 0.5);
      line(
        [
          [56 + i * 16.9, 549],
          [56 + i * 16.9, 549 + h],
        ],
        i / 70 < t ? d.accent : p.line,
        2,
      );
    }
    label('SIGNAL / TRAVERSAL', 56, 600, 12, p.dim);
    label('MAKE THE CONNECTION VISIBLE.', 912, 600, 12, p.dim);
  }
  line([
    [56, 640],
    [1224, 640],
  ]);
  label(`${String(d.edges.length).padStart(2, '0')} CONNECTIONS`, 56, 672, 13, p.dim);
  label(`LOOP ${d.duration}.0s`, 565, 672, 13, p.dim);
  label('JSON → MOTION', 1058, 672, 13, p.fg);
  ctx.fillStyle = p.line;
  ctx.fillRect(56, 694, 1168, 2);
  ctx.fillStyle = d.accent;
  ctx.fillRect(56, 694, 1168 * t, 2);
  ctx.restore();
}
