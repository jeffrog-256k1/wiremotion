export type Layout = 'pipeline' | 'branch' | 'hub';
export type Theme = 'dark' | 'light';
export interface DiagramNode {
  id: string;
  label: string;
  detail: string;
}
export interface DiagramEdge {
  from: string;
  to: string;
  label: string;
}
export interface Diagram {
  version: 1;
  title: string;
  subtitle: string;
  layout: Layout;
  theme: Theme;
  accent: string;
  duration: 4 | 6;
  width: 960 | 1280;
  seed: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  sequence: string[];
}
export const MAX_INPUT_BYTES = 16384;

function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error(`${path} must be an object.`);
  return value as Record<string, unknown>;
}
function keys(value: Record<string, unknown>, allowed: string[], path: string) {
  for (const key of Object.keys(value))
    if (!allowed.includes(key)) throw new Error(`${path}: unknown field "${key}".`);
}
function text(value: unknown, path: string, max: number, optional = false): string {
  if (optional && value === undefined) return '';
  if (
    typeof value !== 'string' ||
    (!optional && !value.trim()) ||
    [...value].length > max ||
    /[\x00-\x1f\x7f]/.test(value)
  ) {
    throw new Error(`${path} must be ${optional ? '0' : '1'}–${max} characters on one line.`);
  }
  return value.trim();
}
function choice<T extends string | number>(value: unknown, options: readonly T[], path: string): T {
  if (!options.includes(value as T)) throw new Error(`${path} must be ${options.join(' or ')}.`);
  return value as T;
}

export function parseDiagram(input: string): Diagram {
  if (new TextEncoder().encode(input).length > MAX_INPUT_BYTES)
    throw new Error('JSON must be 16 KiB or smaller.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new Error('Invalid JSON. Check commas, quotes, and brackets.');
  }
  return validateDiagram(parsed);
}

export function validateDiagram(input: unknown): Diagram {
  const d = object(input, 'diagram');
  keys(
    d,
    [
      'version',
      'title',
      'subtitle',
      'layout',
      'theme',
      'accent',
      'duration',
      'width',
      'seed',
      'nodes',
      'edges',
      'sequence',
    ],
    'diagram',
  );
  if (d.version !== 1) throw new Error('version must be 1.');
  const layout = choice(d.layout, ['pipeline', 'branch', 'hub'] as const, 'layout');
  const theme = choice(d.theme ?? 'dark', ['dark', 'light'] as const, 'theme');
  const accent = text(d.accent ?? '#ff5938', 'accent', 7);
  if (!/^#[0-9a-fA-F]{6}$/.test(accent))
    throw new Error('accent must be a six-digit hex color, such as #ff5938.');
  const seed = d.seed ?? 7;
  if (!Number.isInteger(seed) || Number(seed) < 0 || Number(seed) > 2147483647)
    throw new Error('seed must be an integer from 0 to 2147483647.');
  const min = layout === 'pipeline' ? 2 : 3,
    max = layout === 'hub' ? 6 : 5;
  if (!Array.isArray(d.nodes) || d.nodes.length < min || d.nodes.length > max)
    throw new Error(`${layout} requires ${min}–${max} nodes.`);
  const nodes = d.nodes.map((raw, i) => {
    const node = object(raw, `nodes[${i}]`);
    keys(node, ['id', 'label', 'detail'], `nodes[${i}]`);
    const id = text(node.id, `nodes[${i}].id`, 24);
    if (!/^[a-zA-Z0-9_-]+$/.test(id))
      throw new Error('Node IDs use letters, numbers, underscores, and hyphens.');
    return {
      id,
      label: text(node.label, `nodes[${i}].label`, 26),
      detail: text(node.detail, `nodes[${i}].detail`, 42, true),
    };
  });
  const ids = nodes.map((n) => n.id);
  if (new Set(ids).size !== ids.length) throw new Error('Node IDs must be unique.');
  if (!Array.isArray(d.edges) || d.edges.length !== nodes.length - 1)
    throw new Error('Provide exactly one edge per step or spoke (nodes minus one).');
  const pairs = new Set<string>();
  const edges = d.edges.map((raw, i) => {
    const edge = object(raw, `edges[${i}]`);
    keys(edge, ['from', 'to', 'label'], `edges[${i}]`);
    const from = text(edge.from, `edges[${i}].from`, 24),
      to = text(edge.to, `edges[${i}].to`, 24);
    if (!ids.includes(from) || !ids.includes(to) || from === to)
      throw new Error('Each edge must connect two different existing node IDs.');
    const a = ids.indexOf(from),
      b = ids.indexOf(to);
    if (layout === 'pipeline' ? b !== a + 1 : a !== 0 && b !== 0)
      throw new Error(
        layout === 'pipeline'
          ? 'Pipeline edges follow the node order, one step at a time.'
          : 'Branch and hub edges connect the first node to each other node.',
      );
    const pair = [a, b].sort((x, y) => x - y).join(':');
    if (pairs.has(pair)) throw new Error('Duplicate connection.');
    pairs.add(pair);
    return { from, to, label: text(edge.label, `edges[${i}].label`, 16, true) };
  });
  const sequence = d.sequence ?? ids;
  if (
    !Array.isArray(sequence) ||
    sequence.length !== ids.length ||
    new Set(sequence).size !== ids.length ||
    !sequence.every((id) => typeof id === 'string' && ids.includes(id))
  )
    throw new Error('sequence must contain each node ID exactly once.');
  return {
    version: 1,
    title: text(d.title, 'title', 52),
    subtitle: text(d.subtitle, 'subtitle', 96, true),
    layout,
    theme,
    accent,
    duration: choice(d.duration ?? 6, [4, 6] as const, 'duration'),
    width: choice(d.width ?? 1280, [960, 1280] as const, 'width'),
    seed: Number(seed),
    nodes,
    edges,
    sequence,
  };
}
