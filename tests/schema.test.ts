import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseDiagram, validateDiagram } from '../src/schema.ts';
import { layoutNodes } from '../src/renderer.ts';

const fixture = (name = 'pipeline') =>
  JSON.parse(readFileSync(new URL(`../examples/${name}.json`, import.meta.url), 'utf8'));

test('examples normalize and retain every connection', () => {
  for (const name of ['pipeline', 'branch', 'hub']) {
    const d = validateDiagram(fixture(name));
    assert.equal(d.edges.length, d.nodes.length - 1);
    assert.deepEqual(new Set(d.sequence), new Set(d.nodes.map((n) => n.id)));
  }
});
test('invalid input is rejected before rendering', () => {
  assert.throws(() => parseDiagram('{'), /Invalid JSON/);
  assert.throws(() => parseDiagram(' '.repeat(16385)), /16 KiB/);
  assert.throws(() => parseDiagram('あ'.repeat(6000)), /16 KiB/);
  for (const patch of [
    { version: 2 },
    { layout: 'automatic' },
    { theme: 'other' },
    { accent: 'red' },
    { width: 999999 },
    { duration: 60 },
    { seed: NaN },
    { title: 'x'.repeat(53) },
    { subtitle: 'x\ny' },
    { nodes: [] },
    { sequence: ['capture'] },
    { unexpected: true },
  ])
    assert.throws(() => validateDiagram({ ...fixture(), ...patch }));
});
test('bad graph references, duplicate edges and unsupported topology fail', () => {
  const d = fixture();
  d.nodes[1].id = d.nodes[0].id;
  assert.throws(() => validateDiagram(d), /unique/);
  const cases = [
    { from: 'missing', to: 'ship' },
    { from: 'capture', to: 'capture' },
    { from: 'capture', to: 'ship' },
    { from: 'ship', to: 'transform' },
  ];
  for (const edge of cases) {
    const d = fixture();
    d.edges[0] = edge;
    assert.throws(() => validateDiagram(d));
  }
  const branch = fixture('branch');
  branch.edges[1] = branch.edges[0];
  assert.throws(() => validateDiagram(branch), /Duplicate/);
  const invalid = fixture('hub');
  invalid.edges[0] = { from: 'notes', to: 'files' };
  assert.throws(() => validateDiagram(invalid), /first node/);
});
test('bounded templates keep all node boxes separate and inside the diagram', () => {
  for (const layout of ['pipeline', 'branch', 'hub'])
    for (let count = layout === 'pipeline' ? 2 : 3; count <= (layout === 'hub' ? 6 : 5); count++) {
      const nodes = Array.from({ length: count }, (_, i) => ({ id: `n${i}`, label: `Node ${i}` }));
      const d = validateDiagram({
        version: 1,
        title: 'Bounds',
        layout,
        nodes,
        edges: nodes
          .slice(1)
          .map((n, i) => ({ from: layout === 'pipeline' ? nodes[i].id : 'n0', to: n.id })),
      });
      const boxes = layoutNodes(d);
      for (const a of boxes) {
        assert(a.x - a.w / 2 >= 30 && a.x + a.w / 2 <= 1250);
        assert(a.y - a.h / 2 >= 190 && a.y + a.h / 2 <= 630);
        for (const b of boxes)
          if (a !== b)
            assert(
              Math.abs(a.x - b.x) >= (a.w + b.w) / 2 + 8 ||
                Math.abs(a.y - b.y) >= (a.h + b.h) / 2 + 8,
              `${layout}/${count} overlaps`,
            );
      }
    }
});
