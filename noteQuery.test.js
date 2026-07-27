const test = require('node:test');
const assert = require('node:assert/strict');

const { buildNoteQuery, normalizeTags } = require('../app/utils/noteQuery');

test('normalizeTags trims and lowercases comma-separated tags', () => {
  assert.deepEqual(normalizeTags(' Work, Study ,   '), ['work', 'study']);
  assert.deepEqual(normalizeTags(['  Home ', 'Work']), ['home', 'work']);
});

test('buildNoteQuery creates filters for search, tag, and category', () => {
  const query = buildNoteQuery({ search: 'launch', tag: 'work', category: 'Planning' });

  assert.equal(query.tags.$in[0], 'work');
  assert.equal(query.category.$options, 'i');
  assert.equal(query.category.$regex.source, '^Planning$');
  assert.equal(query.$or[0].title instanceof RegExp, true);
  assert.equal(query.$or[1].content instanceof RegExp, true);
});
