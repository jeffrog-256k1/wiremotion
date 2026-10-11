import assert from 'node:assert/strict';
import test from 'node:test';
import { languages, isLanguage, translate } from '../src/i18n.ts';
import { DiagramError, parseDiagram } from '../src/schema.ts';

test('validation exposes stable codes without changing CLI English errors', () => {
  for (const [input, code] of [
    ['{', 'invalidJson'],
    ['null', 'object'],
    [' '.repeat(16385), 'inputSize'],
  ] as const) {
    assert.throws(
      () => parseDiagram(input),
      (error: unknown) => {
        assert(error instanceof DiagramError);
        assert.equal(error.code, code);
        for (const language of languages) {
          const message = translate(language, error.code, error.params);
          assert(message.length > 0);
          assert(!message.includes('{path}'));
          if (language !== 'en') assert.notEqual(message, error.message);
        }
        return true;
      },
    );
  }
});

test('message parameters are substituted once and language values are bounded', () => {
  assert(isLanguage('zh-CN'));
  assert(!isLanguage('__proto__'));
  assert(!isLanguage(null));
  assert.equal(
    translate('en', 'unknownField', { path: 'diagram', key: '{path}' }),
    'diagram: unknown field "{path}".',
  );
  assert.equal(translate('es', 'rendering', { percent: 50 }), 'Renderizando 50%');
});
