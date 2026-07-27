function normalizeTags(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((tag) => String(tag || '').trim().toLowerCase())
      .filter(Boolean);
  }

  return String(value)
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildNoteQuery({ search = '', tag = '', category = '' } = {}) {
  const query = {};

  const normalizedTag = normalizeTags(tag);
  if (normalizedTag.length) {
    query.tags = { $in: normalizedTag };
  }

  const normalizedCategory = String(category || '').trim();
  if (normalizedCategory) {
    const categoryExpression = new RegExp(`^${escapeRegExp(normalizedCategory)}$`, 'i');
    query.category = { $regex: categoryExpression, $options: 'i' };
  }

  const normalizedSearch = String(search || '').trim();
  if (normalizedSearch) {
    const searchExpression = new RegExp(escapeRegExp(normalizedSearch), 'i');
    query.$or = [
      { title: searchExpression },
      { content: searchExpression }
    ];
  }

  return query;
}

module.exports = {
  normalizeTags,
  buildNoteQuery
};
